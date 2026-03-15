import { ApiProperty } from '@nestjs/swagger';
import { EntidadFinanciera } from '../entities/entidad-financiera.entity';

export class EntidadFinancieraResponseDto {
  @ApiProperty({
    description: 'UUID de la entidad financiera',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre completo de la entidad financiera',
    example: 'Banco de Bogotá',
  })
  nombre: string;

  @ApiProperty({
    description: 'Nombre normalizado para URLs (slug)',
    example: 'banco-de-bogota',
  })
  nombre_normalizado: string;

  @ApiProperty({
    description: 'URL del logo de la entidad financiera',
    example: 'https://example.com/logo.png',
    nullable: true,
  })
  logo_url: string | null;

  @ApiProperty({
    description: 'URL del sitio web oficial',
    example: 'https://www.bancodebogota.com',
    nullable: true,
  })
  sitio_web: string | null;

  @ApiProperty({
    description: 'Estado de activación',
    example: true,
  })
  activo: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2026-02-08T12:00:00.000Z',
  })
  created_at: Date;

  static fromEntity(entity: EntidadFinanciera): EntidadFinancieraResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      nombre_normalizado: entity.nombre_normalizado,
      logo_url: entity.logo_url,
      sitio_web: entity.sitio_web,
      activo: entity.activo,
      created_at: entity.created_at,
    };
  }

  static fromEntities(
    entities: EntidadFinanciera[],
  ): EntidadFinancieraResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
