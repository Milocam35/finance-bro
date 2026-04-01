import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CalcularSimulacionDto {
  @ApiProperty({
    description: 'Monto del crédito en pesos colombianos',
    example: 200000000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  monto: number;

  @ApiProperty({
    description: 'Plazo del crédito en meses',
    example: 240,
    minimum: 1,
    maximum: 600,
  })
  @IsNumber()
  @Min(1)
  @Max(600)
  @Type(() => Number)
  plazo_meses: number;

  @ApiProperty({
    description: 'Tasa efectiva anual en porcentaje (ej: 13.5 para 13.5%)',
    example: 13.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  tasa_anual: number;
}
