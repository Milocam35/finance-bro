import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasaVigente } from '../productos/entities/tasa-vigente.entity';
import { CalcularSimulacionDto } from './dto/calcular-simulacion.dto';
import { CalcularLoteDto } from './dto/calcular-lote.dto';
import {
  ResultadoSimulacionDto,
  ResultadoLoteItemDto,
  ResultadoLoteDto,
} from './dto/resultado-simulacion.dto';

@Injectable()
export class SimulacionesService {
  private readonly logger = new Logger(SimulacionesService.name);

  constructor(
    @InjectRepository(TasaVigente)
    private readonly tasaVigenteRepo: Repository<TasaVigente>,
  ) {}

  /**
   * Cálculo puro de cuota mensual — Sistema Francés (cuota fija).
   * PMT = P × [r(1+r)^n] / [(1+r)^n − 1]
   * donde r = tasa mensual equivalente = (1 + TEA/100)^(1/12) - 1
   */
  calcular(dto: CalcularSimulacionDto): ResultadoSimulacionDto {
    const { monto: P, plazo_meses: n, tasa_anual } = dto;

    // Tasa mensual equivalente a la TEA
    const r = Math.pow(1 + tasa_anual / 100, 1 / 12) - 1;

    // Si tasa = 0, la cuota es reparto uniforme del capital
    const cuota =
      r > 0
        ? P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        : P / n;

    const total = cuota * n;

    return {
      cuota_mensual: Math.round(cuota),
      total_pago: Math.round(total),
      total_intereses: Math.round(total - P),
      tasa_mensual: parseFloat(r.toFixed(8)),
      tasa_anual_usada: tasa_anual,
      monto: P,
      plazo_meses: n,
    };
  }

  /**
   * Resuelve la TEA efectiva de un producto según denominación.
   * - UVR: usa tasa_final (ya incluye la variación UVR)
   * - Rango: usa tasa_minima como representativa (mejor caso para el usuario)
   * - Pesos: usa tasa_valor
   * Retorna null si no hay tasa calculable.
   */
  private resolverTEA(
    tasaVigente: TasaVigente,
    denominacionCodigo: string,
  ): { tasa: number; texto?: string } | null {
    const tv = tasaVigente;
    const isUVR = denominacionCodigo === 'uvr';

    // Para rangos se usa la tasa mínima (representa la mejor opción para el usuario)
    if (tv.es_rango && tv.tasa_minima != null && Number(tv.tasa_minima) > 0) {
      return {
        tasa: Number(tv.tasa_minima),
        texto: tv.tasa_texto_original ?? undefined,
      };
    }

    // Para UVR preferimos tasa_final que ya convierte UVR + spread a EA equivalente
    if (isUVR && tv.tasa_final != null && Number(tv.tasa_final) > 0) {
      return {
        tasa: Number(tv.tasa_final),
        texto: tv.tasa_texto_original ?? undefined,
      };
    }

    // Tasa principal en pesos
    if (tv.tasa_valor != null && Number(tv.tasa_valor) > 0) {
      return {
        tasa: Number(tv.tasa_valor),
        texto: tv.tasa_texto_original ?? undefined,
      };
    }

    // Fallback a tasa_final si hay
    if (tv.tasa_final != null && Number(tv.tasa_final) > 0) {
      return {
        tasa: Number(tv.tasa_final),
        texto: tv.tasa_texto_original ?? undefined,
      };
    }

    return null;
  }

  /**
   * Calcula cuotas para un lote de productos.
   * Resuelve las tasas vigentes desde la DB y aplica la lógica de denominación.
   */
  async calcularLote(dto: CalcularLoteDto): Promise<ResultadoLoteDto> {
    this.logger.log(
      `Calculando lote: ${dto.producto_ids.length} productos, monto=${dto.monto}, plazo=${dto.plazo_meses}m`,
    );

    // Carga tasas vigentes con la denominación del producto en una sola query
    const tasas = await this.tasaVigenteRepo
      .createQueryBuilder('tv')
      .innerJoinAndSelect('tv.producto', 'p')
      .innerJoinAndSelect('p.denominacion', 'd')
      .where('tv.producto_id IN (:...ids)', { ids: dto.producto_ids })
      .getMany();

    const resultados: ResultadoLoteItemDto[] = [];

    for (const tv of tasas) {
      const denominacionCodigo = tv.producto?.denominacion?.codigo ?? 'pesos';
      const teaInfo = this.resolverTEA(tv, denominacionCodigo);

      if (!teaInfo) {
        this.logger.warn(
          `Producto ${tv.producto_id} sin tasa calculable — omitido del lote`,
        );
        continue;
      }

      const resultado = this.calcular({
        monto: dto.monto,
        plazo_meses: dto.plazo_meses,
        tasa_anual: teaInfo.tasa,
      });

      resultados.push({
        ...resultado,
        producto_id: tv.producto_id,
        tasa_texto: teaInfo.texto,
      });
    }

    const promedio =
      resultados.length > 0
        ? Math.round(
            resultados.reduce((sum, r) => sum + r.cuota_mensual, 0) /
              resultados.length,
          )
        : 0;

    return { resultados, promedio_cuota_mensual: promedio };
  }
}
