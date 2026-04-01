import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SimulacionesService } from './simulaciones.service';
import { CalcularSimulacionDto } from './dto/calcular-simulacion.dto';
import { CalcularLoteDto } from './dto/calcular-lote.dto';
import {
  ResultadoSimulacionDto,
  ResultadoLoteDto,
} from './dto/resultado-simulacion.dto';

@ApiTags('simulaciones')
@Controller('api/simulaciones')
export class SimulacionesController {
  private readonly logger = new Logger(SimulacionesController.name);

  constructor(private readonly simulacionesService: SimulacionesService) {}

  @Post('calcular')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calcular cuota mensual de un crédito',
    description:
      'Calcula la cuota mensual estimada bajo el sistema de amortización francés ' +
      '(cuota fija). Recibe monto, plazo y tasa efectiva anual; retorna cuota mensual, ' +
      'total a pagar y total de intereses.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de la simulación',
    type: ResultadoSimulacionDto,
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  calcular(@Body() dto: CalcularSimulacionDto): ResultadoSimulacionDto {
    this.logger.log(
      `POST /api/simulaciones/calcular - monto=${dto.monto}, plazo=${dto.plazo_meses}m, tasa=${dto.tasa_anual}%`,
    );
    return this.simulacionesService.calcular(dto);
  }

  @Post('calcular-lote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calcular cuotas para múltiples productos a la vez',
    description:
      'Resuelve la tasa efectiva de cada producto desde la base de datos y calcula ' +
      'la cuota mensual estimada para todos. Ideal para mostrar cuotas en el comparador.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados del lote con promedio',
    type: ResultadoLoteDto,
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  calcularLote(@Body() dto: CalcularLoteDto): Promise<ResultadoLoteDto> {
    this.logger.log(
      `POST /api/simulaciones/calcular-lote - ${dto.producto_ids.length} productos`,
    );
    return this.simulacionesService.calcularLote(dto);
  }
}
