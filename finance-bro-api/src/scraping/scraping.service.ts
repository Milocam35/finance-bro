import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CatalogosService } from '../catalogos/catalogos.service';
import { ProductosService } from '../productos/productos.service';
import { N8nProductoDto } from './dto/n8n-producto.dto';
import {
  parseTasa,
  parseMonto,
  parsePlazo,
  normalizarTexto,
} from '../common/utils/parsers.util';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(
    private readonly catalogosService: CatalogosService,
    private readonly productosService: ProductosService,
  ) {}

  /**
   * Procesa los datos de n8n e inserta/actualiza en PostgreSQL
   * @param dto - Datos del producto desde n8n
   * @returns Resultado de la ingesta
   */
  async ingestarProducto(dto: N8nProductoDto): Promise<{
    success: boolean;
    producto_id: string;
    accion: 'creado' | 'actualizado';
    cambio_tasa: boolean;
    tasa_anterior?: number;
    tasa_nueva?: number;
  }> {
    this.logger.log(`Iniciando ingesta para id_unico: ${dto.id_unico}`);

    // ==================== PASO 1: NORMALIZACIÓN DE DATOS ====================
    const datosNormalizados = this.normalizarDatosN8n(dto);

    // ==================== PASO 2: BÚSQUEDA/CREACIÓN DE ENTIDAD FINANCIERA ====================
    const entidad = await this.catalogosService.getOrCreateEntidad(
      datosNormalizados.nombre_normalizado,
      dto.banco,
    );

    this.logger.log(`Entidad financiera: ${entidad.nombre} (ID: ${entidad.id})`);

    // ==================== PASO 3: RESOLUCIÓN DE CATÁLOGOS ====================
    const catalogos = await this.resolverCatalogos(dto);

    // ==================== PASO 4: BUSCAR PRODUCTO EXISTENTE ====================
    let producto = await this.productosService.findByIdUnico(dto.id_unico);

    let accion: 'creado' | 'actualizado' = 'creado';

    if (!producto) {
      // ==================== PASO 5A: CREAR NUEVO PRODUCTO ====================
      producto = await this.productosService.create({
        id_unico_scraping: dto.id_unico,
        entidad_id: entidad.id,
        tipo_credito_id: catalogos.tipoCreditoId,
        tipo_vivienda_id: catalogos.tipoViviendaId,
        denominacion_id: catalogos.denominacionId,
        tipo_tasa_id: catalogos.tipoTasaId,
        tipo_pago_id: catalogos.tipoPagoId,
        descripcion: dto.descripcion,
        url_extraccion: dto.url_pagina,
        url_redireccion: dto.url_pagina,
        url_pdf: dto.url_pdf || null,
        fecha_extraccion: new Date(dto.fecha_extraccion),
        hora_extraccion: dto.hora_extraccion,
        activo: true,
      });

      this.logger.log(`Producto creado: ${producto.id}`);
    } else {
      // ==================== PASO 5B: ACTUALIZAR PRODUCTO EXISTENTE ====================
      producto = await this.productosService.update(producto.id, {
        descripcion: dto.descripcion,
        url_extraccion: dto.url_pagina,
        url_redireccion: dto.url_pagina,
        url_pdf: dto.url_pdf || null,
        fecha_extraccion: new Date(dto.fecha_extraccion),
        hora_extraccion: dto.hora_extraccion,
      });

      accion = 'actualizado';
      this.logger.log(`Producto actualizado: ${producto.id}`);
    }

    // ==================== PASO 6: DETECCIÓN DE CAMBIO DE TASA ====================
    const tasaAnterior = await this.productosService.getTasaVigente(producto.id);
    const tasaAnteriorValor = tasaAnterior?.tasa_valor || null;

    const tasaNueva = datosNormalizados.tasas;
    let cambioTasa = false;

    // Comparar si hubo cambio en la tasa
    if (tasaAnteriorValor && tasaNueva.tasa_valor) {
      if (Math.abs(tasaAnteriorValor - tasaNueva.tasa_valor) >= 0.01) {
        cambioTasa = true;
        this.logger.log(
          `Cambio de tasa detectado: ${tasaAnteriorValor}% → ${tasaNueva.tasa_valor}%`,
        );
      }
    }

    // ==================== PASO 7: UPSERT DE TASA VIGENTE ====================
    await this.productosService.updateTasaVigente(producto.id, {
      tasa_valor: tasaNueva.tasa_valor,
      tasa_texto_original: dto.tasa || null,
      tasa_minima: tasaNueva.tasa_minima,
      tasa_maxima: tasaNueva.tasa_maxima,
      es_rango: tasaNueva.es_rango,
      fecha_vigencia: new Date(dto.fecha_extraccion),
    });

    // ==================== PASO 8: INSERTAR EN HISTÓRICO DE TASAS ====================
    await this.productosService.insertTasaHistorica({
      producto_id: producto.id,
      tasa_valor: tasaNueva.tasa_valor,
      fecha_extraccion: new Date(dto.fecha_extraccion),
      hora_extraccion: dto.hora_extraccion,
    });

    // ==================== PASO 9: UPSERT DE MONTOS ====================
    const montos = datosNormalizados.montos;
    if (montos.monto_minimo || montos.monto_maximo || montos.plazo_maximo_meses) {
      await this.productosService.upsertMontos(producto.id, {
        monto_minimo: montos.monto_minimo,
        monto_maximo: montos.monto_maximo,
        plazo_minimo_meses: null,
        plazo_maximo_meses: montos.plazo_maximo_meses,
        porcentaje_financiacion_min: null,
        porcentaje_financiacion_max: null,
      });
    }

    // ==================== PASO 10: REEMPLAZAR CONDICIONES ====================
    if (dto.condiciones && dto.condiciones.trim()) {
      const condiciones = dto.condiciones
        .split(';')
        .map((c, index) => ({
          condicion: c.trim(),
          orden: index + 1,
        }))
        .filter((c) => c.condicion.length > 0);

      await this.productosService.replaceCondiciones(producto.id, condiciones);
    } else {
      await this.productosService.replaceCondiciones(producto.id, []);
    }

    // ==================== PASO 11: REEMPLAZAR REQUISITOS ====================
    if (dto.requisitos && dto.requisitos.trim()) {
      const requisitos = dto.requisitos
        .split(';')
        .map((r, index) => ({
          requisito: r.trim(),
          tipo_requisito: 'general',
          es_obligatorio: true,
          orden: index + 1,
        }))
        .filter((r) => r.requisito.length > 0);

      await this.productosService.replaceRequisitos(producto.id, requisitos);
    } else {
      await this.productosService.replaceRequisitos(producto.id, []);
    }

    // ==================== PASO 12: REEMPLAZAR BENEFICIOS ====================
    const beneficios = [];

    if (dto.descuento_nomina && dto.descuento_nomina.trim()) {
      beneficios.push({
        tipo_beneficio: 'descuento_nomina',
        descripcion: dto.descuento_nomina.trim(),
        valor: this.extraerValorBeneficio(dto.descuento_nomina),
        aplica_condicion: 'Con cuenta de nómina',
      });
    }

    if (dto.beneficio_avaluo && dto.beneficio_avaluo.trim()) {
      beneficios.push({
        tipo_beneficio: 'avaluo',
        descripcion: dto.beneficio_avaluo.trim(),
        valor: null,
        aplica_condicion: null,
      });
    }

    await this.productosService.replaceBeneficios(producto.id, beneficios);

    // ==================== RESULTADO ====================
    this.logger.log(
      `Ingesta completada: ${accion} | Cambio tasa: ${cambioTasa} | ID: ${producto.id}`,
    );

    return {
      success: true,
      producto_id: producto.id,
      accion,
      cambio_tasa: cambioTasa,
      tasa_anterior: tasaAnteriorValor,
      tasa_nueva: tasaNueva.tasa_valor,
    };
  }

  /**
   * Normaliza los datos crudos de n8n
   */
  private normalizarDatosN8n(dto: N8nProductoDto): {
    nombre_normalizado: string;
    tasas: {
      tasa_valor: number | null;
      tasa_minima: number | null;
      tasa_maxima: number | null;
      es_rango: boolean;
    };
    montos: {
      monto_minimo: number | null;
      monto_maximo: number | null;
      plazo_maximo_meses: number | null;
    };
  } {
    // Normalizar nombre del banco
    const nombre_normalizado = normalizarTexto(dto.banco);

    // Parsear tasas
    let tasa_valor: number | null = null;
    let tasa_minima: number | null = null;
    let tasa_maxima: number | null = null;
    let es_rango = false;

    if (dto.tasa && dto.tasa.trim()) {
      tasa_valor = parseTasa(dto.tasa);
    }

    if (dto.tasa_minima && dto.tasa_minima.trim()) {
      tasa_minima = parseTasa(dto.tasa_minima);
      es_rango = true;
    }

    if (dto.tasa_maxima && dto.tasa_maxima.trim()) {
      tasa_maxima = parseTasa(dto.tasa_maxima);
      es_rango = true;
    }

    // Si es rango pero no hay tasa_valor, calcular promedio
    if (es_rango && !tasa_valor && tasa_minima && tasa_maxima) {
      tasa_valor = (tasa_minima + tasa_maxima) / 2;
    }

    // Parsear montos
    let monto_minimo: number | null = null;
    let monto_maximo: number | null = null;

    if (dto.monto_minimo && dto.monto_minimo.trim()) {
      monto_minimo = parseMonto(dto.monto_minimo);
    }

    if (dto.monto_maximo && dto.monto_maximo.trim()) {
      monto_maximo = parseMonto(dto.monto_maximo);
    }

    // Parsear plazo
    let plazo_maximo_meses: number | null = null;

    if (dto.plazo_maximo && dto.plazo_maximo.trim()) {
      plazo_maximo_meses = parsePlazo(dto.plazo_maximo);
    }

    return {
      nombre_normalizado,
      tasas: {
        tasa_valor,
        tasa_minima,
        tasa_maxima,
        es_rango,
      },
      montos: {
        monto_minimo,
        monto_maximo,
        plazo_maximo_meses,
      },
    };
  }

  /**
   * Resuelve los códigos de catálogos a UUIDs
   */
  private async resolverCatalogos(dto: N8nProductoDto): Promise<{
    tipoCreditoId: string;
    tipoViviendaId: string;
    denominacionId: string;
    tipoTasaId: string;
    tipoPagoId: string | null;
  }> {
    // Mapeo de tipo_credito
    const mapeoTipoCredito: Record<string, string> = {
      'Crédito hipotecario para compra de vivienda': 'hipotecario',
      'Crédito de consumo': 'consumo',
      'Crédito de vehículo': 'vehiculo',
      'Leasing habitacional': 'leasing',
    };

    const codigoTipoCredito = mapeoTipoCredito[dto.tipo_credito] || 'hipotecario';
    const tipoCredito = await this.catalogosService.findTipoCreditoByCodigo(codigoTipoCredito);

    if (!tipoCredito) {
      throw new BadRequestException(`Tipo de crédito no encontrado: ${dto.tipo_credito}`);
    }

    // Mapeo de tipo_vivienda
    const mapeoTipoVivienda: Record<string, string> = {
      VIS: 'vis',
      'No VIS': 'no_vis',
      'Aplica para ambos': 'aplica_ambos',
      VIP: 'vip',
    };

    const codigoTipoVivienda = mapeoTipoVivienda[dto.tipo_vivienda] || 'aplica_ambos';
    const tipoVivienda = await this.catalogosService.findTipoViviendaByCodigo(codigoTipoVivienda);

    if (!tipoVivienda) {
      throw new BadRequestException(`Tipo de vivienda no encontrado: ${dto.tipo_vivienda}`);
    }

    // Mapeo de denominacion
    const mapeoDenominacion: Record<string, string> = {
      Pesos: 'pesos',
      UVR: 'uvr',
    };

    const codigoDenominacion = mapeoDenominacion[dto.denominacion] || 'pesos';
    const denominacion = await this.catalogosService.findDenominacionByCodigo(codigoDenominacion);

    if (!denominacion) {
      throw new BadRequestException(`Denominación no encontrada: ${dto.denominacion}`);
    }

    // Mapeo de tipo_tasa
    const mapeoTipoTasa: Record<string, string> = {
      'Tasa efectiva anual': 'efectiva_anual',
      'Tasa nominal mensual': 'nominal_mensual',
    };

    const codigoTipoTasa = mapeoTipoTasa[dto.tipo_tasa || ''] || 'efectiva_anual';
    const tipoTasa = await this.catalogosService.findTipoTasaByCodigo(codigoTipoTasa);

    if (!tipoTasa) {
      throw new BadRequestException(`Tipo de tasa no encontrado: ${dto.tipo_tasa}`);
    }

    // Mapeo de tipo_pago (nullable)
    let tipoPagoId: string | null = null;

    if (dto.tipo_pago && dto.tipo_pago.trim()) {
      const mapeoTipoPago: Record<string, string> = {
        'Cuota fija': 'cuota_fija',
        'Cuota variable': 'cuota_variable',
      };

      const codigoTipoPago = mapeoTipoPago[dto.tipo_pago] || null;

      if (codigoTipoPago) {
        const tipoPago = await this.catalogosService.findTipoPagoByCodigo(codigoTipoPago);
        tipoPagoId = tipoPago?.id || null;
      }
    }

    return {
      tipoCreditoId: tipoCredito.id,
      tipoViviendaId: tipoVivienda.id,
      denominacionId: denominacion.id,
      tipoTasaId: tipoTasa.id,
      tipoPagoId,
    };
  }

  /**
   * Extrae el valor numérico de un beneficio
   * Ejemplo: "+200 pbs" → "200 pbs"
   */
  private extraerValorBeneficio(texto: string): string | null {
    // Buscar patrones como "+200 pbs", "200 puntos básicos", etc.
    const match = texto.match(/(\+?-?\d+(?:\.\d+)?)\s*(pbs|puntos|%|porcentaje)?/i);

    if (match) {
      return match[0].trim();
    }

    return null;
  }
}
