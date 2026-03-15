import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateEntidadFinancieraDto } from './create-entidad-financiera.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateEntidadFinancieraDto extends PartialType(
  CreateEntidadFinancieraDto,
) {
  @ApiPropertyOptional({
    description: 'Estado de activación de la entidad financiera',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un valor booleano' })
  activo?: boolean;
}
