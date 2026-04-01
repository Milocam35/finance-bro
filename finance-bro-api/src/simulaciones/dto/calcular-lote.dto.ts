import { IsNumber, Min, Max, IsArray, IsUUID, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CalcularLoteDto {
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
    description: 'Lista de IDs (UUID) de los productos a calcular',
    example: ['uuid1', 'uuid2', 'uuid3'],
    type: [String],
    minItems: 1,
    maxItems: 100,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  producto_ids: string[];
}
