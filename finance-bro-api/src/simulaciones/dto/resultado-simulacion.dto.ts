import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResultadoSimulacionDto {
  @ApiProperty({ description: 'Cuota mensual estimada en pesos', example: 2485000 })
  cuota_mensual: number;

  @ApiProperty({ description: 'Total a pagar (capital + intereses)', example: 596400000 })
  total_pago: number;

  @ApiProperty({ description: 'Total de intereses pagados', example: 396400000 })
  total_intereses: number;

  @ApiProperty({ description: 'Tasa mensual equivalente (decimal)', example: 0.010539 })
  tasa_mensual: number;

  @ApiProperty({ description: 'TEA usada para el cálculo (%)', example: 13.5 })
  tasa_anual_usada: number;

  @ApiProperty({ description: 'Monto del crédito', example: 200000000 })
  monto: number;

  @ApiProperty({ description: 'Plazo en meses', example: 240 })
  plazo_meses: number;
}

export class ResultadoLoteItemDto extends ResultadoSimulacionDto {
  @ApiProperty({ description: 'ID del producto', example: 'uuid-del-producto' })
  producto_id: string;

  @ApiPropertyOptional({ description: 'Texto original de la tasa', example: 'UVR + 6.50%' })
  tasa_texto?: string;
}

export class ResultadoLoteDto {
  @ApiProperty({ type: [ResultadoLoteItemDto] })
  resultados: ResultadoLoteItemDto[];

  @ApiProperty({ description: 'Promedio de cuota mensual entre todos los productos del lote', example: 2510000 })
  promedio_cuota_mensual: number;
}
