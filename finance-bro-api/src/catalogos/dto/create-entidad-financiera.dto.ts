import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateEntidadFinancieraDto {
  @ApiProperty({
    description: 'Nombre completo de la entidad financiera',
    example: 'Banco de Bogotá',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre: string;

  @ApiProperty({
    description:
      'Nombre normalizado para URLs (slug). Letras minúsculas, guiones, sin tildes ni espacios.',
    example: 'banco-de-bogota',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre normalizado es requerido' })
  @MinLength(3, {
    message: 'El nombre normalizado debe tener al menos 3 caracteres',
  })
  @MaxLength(255, {
    message: 'El nombre normalizado no puede exceder 255 caracteres',
  })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'El nombre normalizado solo puede contener letras minúsculas, números y guiones (ej: banco-de-bogota)',
  })
  nombre_normalizado: string;

  @ApiProperty({
    description: 'URL del logo de la entidad financiera',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'El logo_url debe ser una URL válida' })
  @MaxLength(255, { message: 'El logo_url no puede exceder 255 caracteres' })
  logo_url?: string;

  @ApiProperty({
    description: 'URL del sitio web oficial de la entidad financiera',
    example: 'https://www.bancodebogota.com',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'El sitio_web debe ser una URL válida' })
  @MaxLength(255, { message: 'El sitio_web no puede exceder 255 caracteres' })
  sitio_web?: string;
}
