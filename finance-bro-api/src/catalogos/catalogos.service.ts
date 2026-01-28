import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntidadFinanciera } from './entities/entidad-financiera.entity';
import { TipoCredito } from './entities/tipo-credito.entity';
import { TipoVivienda } from './entities/tipo-vivienda.entity';
import { Denominacion } from './entities/denominacion.entity';
import { TipoTasa } from './entities/tipo-tasa.entity';
import { TipoPago } from './entities/tipo-pago.entity';

@Injectable()
export class CatalogosService {
  private readonly logger = new Logger(CatalogosService.name);

  constructor(
    @InjectRepository(EntidadFinanciera)
    private readonly entidadFinancieraRepo: Repository<EntidadFinanciera>,
    @InjectRepository(TipoCredito)
    private readonly tipoCreditoRepo: Repository<TipoCredito>,
    @InjectRepository(TipoVivienda)
    private readonly tipoViviendaRepo: Repository<TipoVivienda>,
    @InjectRepository(Denominacion)
    private readonly denominacionRepo: Repository<Denominacion>,
    @InjectRepository(TipoTasa)
    private readonly tipoTasaRepo: Repository<TipoTasa>,
    @InjectRepository(TipoPago)
    private readonly tipoPagoRepo: Repository<TipoPago>,
  ) {}

  /**
   * Busca una entidad financiera por su nombre normalizado
   * @param nombreNormalizado - Nombre normalizado del banco (ej: 'bancolombia', 'banco-de-bogota')
   * @returns EntidadFinanciera o null si no existe
   */
  async findEntidadByNombre(
    nombreNormalizado: string,
  ): Promise<EntidadFinanciera | null> {
    const entidad = await this.entidadFinancieraRepo.findOne({
      where: { nombre_normalizado: nombreNormalizado, activo: true },
    });

    if (!entidad) {
      this.logger.debug(
        `Entidad financiera no encontrada: ${nombreNormalizado}`,
      );
    }

    return entidad;
  }

  /**
   * Crea una nueva entidad financiera
   * @param data - Datos de la entidad financiera
   * @returns EntidadFinanciera creada
   */
  async createEntidad(data: {
    nombre: string;
    nombre_normalizado: string;
  }): Promise<EntidadFinanciera> {
    const nuevaEntidad = this.entidadFinancieraRepo.create({
      nombre: data.nombre,
      nombre_normalizado: data.nombre_normalizado,
      activo: true,
    });

    const entidadGuardada = await this.entidadFinancieraRepo.save(nuevaEntidad);

    this.logger.log(
      `Nueva entidad financiera creada: ${entidadGuardada.nombre} (ID: ${entidadGuardada.id})`,
    );

    return entidadGuardada;
  }

  /**
   * Busca un tipo de crédito por su código
   * @param codigo - Código del tipo de crédito (ej: 'hipotecario', 'consumo', 'vehiculo')
   * @returns TipoCredito o null si no existe
   */
  async findTipoCreditoByCodigo(codigo: string): Promise<TipoCredito | null> {
    const tipo = await this.tipoCreditoRepo.findOne({
      where: { codigo, activo: true },
    });

    if (!tipo) {
      this.logger.warn(`Tipo de crédito no encontrado: ${codigo}`);
    }

    return tipo;
  }

  /**
   * Busca un tipo de vivienda por su código
   * @param codigo - Código del tipo de vivienda (ej: 'vis', 'no_vis', 'vip', 'aplica_ambos')
   * @returns TipoVivienda o null si no existe
   */
  async findTipoViviendaByCodigo(
    codigo: string,
  ): Promise<TipoVivienda | null> {
    const tipo = await this.tipoViviendaRepo.findOne({
      where: { codigo, activo: true },
    });

    if (!tipo) {
      this.logger.warn(`Tipo de vivienda no encontrado: ${codigo}`);
    }

    return tipo;
  }

  /**
   * Busca una denominación por su código
   * @param codigo - Código de la denominación (ej: 'pesos', 'uvr')
   * @returns Denominacion o null si no existe
   */
  async findDenominacionByCodigo(codigo: string): Promise<Denominacion | null> {
    const denominacion = await this.denominacionRepo.findOne({
      where: { codigo, activo: true },
    });

    if (!denominacion) {
      this.logger.warn(`Denominación no encontrada: ${codigo}`);
    }

    return denominacion;
  }

  /**
   * Busca un tipo de tasa por su código
   * @param codigo - Código del tipo de tasa (ej: 'efectiva_anual', 'nominal_mensual')
   * @returns TipoTasa o null si no existe
   */
  async findTipoTasaByCodigo(codigo: string): Promise<TipoTasa | null> {
    const tipo = await this.tipoTasaRepo.findOne({
      where: { codigo, activo: true },
    });

    if (!tipo) {
      this.logger.warn(`Tipo de tasa no encontrado: ${codigo}`);
    }

    return tipo;
  }

  /**
   * Busca un tipo de pago por su código
   * @param codigo - Código del tipo de pago (ej: 'cuota_fija', 'cuota_variable')
   * @returns TipoPago o null si no existe
   */
  async findTipoPagoByCodigo(codigo: string): Promise<TipoPago | null> {
    const tipo = await this.tipoPagoRepo.findOne({
      where: { codigo, activo: true },
    });

    if (!tipo) {
      this.logger.debug(`Tipo de pago no encontrado: ${codigo}`);
    }

    return tipo;
  }

  /**
   * Obtiene o crea una entidad financiera (upsert pattern)
   * @param nombreNormalizado - Nombre normalizado del banco
   * @param nombre - Nombre completo del banco
   * @returns EntidadFinanciera (existente o nueva)
   */
  async getOrCreateEntidad(
    nombreNormalizado: string,
    nombre: string,
  ): Promise<EntidadFinanciera> {
    let entidad = await this.findEntidadByNombre(nombreNormalizado);

    if (!entidad) {
      entidad = await this.createEntidad({
        nombre,
        nombre_normalizado: nombreNormalizado,
      });
    }

    return entidad;
  }
}
