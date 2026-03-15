import { IsOptional, IsUUID, IsBoolean, IsNumber, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductosDto {
  @ApiPropertyOptional({
    description: 'Filtrar por UUID de entidad financiera',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  entidad_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por UUID de tipo de crédito',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  tipo_credito_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por UUID de tipo de vivienda',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsOptional()
  @IsUUID()
  tipo_vivienda_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por UUID de denominación',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsOptional()
  @IsUUID()
  denominacion_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por UUID de tipo de tasa',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @IsOptional()
  @IsUUID()
  tipo_tasa_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por UUID de tipo de pago',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @IsOptional()
  @IsUUID()
  tipo_pago_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por productos activos/inactivos',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({
    description: 'Búsqueda por texto en descripción',
    example: 'hipotecario VIS',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Número de página (para paginación)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de resultados por página',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'created_at',
    enum: ['created_at', 'updated_at', 'descripcion'],
    default: 'created_at',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'created_at' | 'updated_at' | 'descripcion';

  @ApiPropertyOptional({
    description: 'Dirección de ordenamiento',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
