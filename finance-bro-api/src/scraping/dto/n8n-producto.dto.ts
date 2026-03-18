import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class N8nProductoDto {
  @ApiProperty({
    description:
      'ID único generado por n8n (formato: banco__tipocredito__tipovivienda__denominacion)',
    examples: {
      pesos: {
        summary: 'Producto en Pesos',
        value: 'bancolombia__hipotecario__vis__pesos',
      },
      uvr: {
        summary: 'Producto en UVR',
        value: 'bancolombia__creditohipotecarioparacompradevivienda__vis__uvr',
      },
    },
    minLength: 5,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'El id_unico es obligatorio' })
  @MinLength(5, { message: 'El id_unico debe tener al menos 5 caracteres' })
  @MaxLength(255, { message: 'El id_unico no puede exceder 255 caracteres' })
  id_unico: string;

  @ApiProperty({
    description: 'Nombre del banco o entidad financiera',
    example: 'Bancolombia',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'El banco es obligatorio' })
  @MaxLength(255, { message: 'El nombre del banco no puede exceder 255 caracteres' })
  banco: string;

  @ApiProperty({
    description: 'Tipo de crédito',
    example: 'Crédito hipotecario para compra de vivienda',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'El tipo_credito es obligatorio' })
  @MaxLength(255, { message: 'El tipo_credito no puede exceder 255 caracteres' })
  tipo_credito: string;

  @ApiPropertyOptional({
    description: 'Tipo de vivienda (opcional para créditos no hipotecarios)',
    example: 'VIS',
    enum: ['VIS', 'No VIS', 'Aplica para ambos', 'VIP', 'No aplica', ''],
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El tipo_vivienda no puede exceder 100 caracteres' })
  tipo_vivienda?: string;

  @ApiProperty({
    description: 'Denominación de la tasa',
    example: 'Pesos',
    enum: ['Pesos', 'UVR'],
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'La denominacion es obligatoria' })
  @MaxLength(50, { message: 'La denominacion no puede exceder 50 caracteres' })
  denominacion: string;

  @ApiPropertyOptional({
    description: 'Tipo de tasa',
    example: 'Tasa efectiva anual',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El tipo_tasa no puede exceder 100 caracteres' })
  tipo_tasa?: string;

  @ApiPropertyOptional({
    description: 'Valor de la tasa (puede incluir spread UVR si aplica)',
    examples: {
      pesos: {
        summary: 'Tasa en Pesos',
        value: '11.50% EA',
      },
      uvr: {
        summary: 'Tasa en UVR',
        value: 'UVR + 6.50%',
      },
    },
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La tasa no puede exceder 50 caracteres' })
  tasa?: string;

  @ApiPropertyOptional({
    description: 'Tasa final calculada - conversión UVR a EA (solo para productos en UVR)',
    example: '12.04%',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La tasa_final no puede exceder 50 caracteres' })
  tasa_final?: string;

  @ApiPropertyOptional({
    description: 'Variación anual del UVR (solo para productos en UVR)',
    example: '5.20%',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La uvr_variacion_anual no puede exceder 50 caracteres' })
  uvr_variacion_anual?: string;

  @ApiPropertyOptional({
    description: 'Tasa mínima (si es rango)',
    example: '10.50',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La tasa_minima no puede exceder 50 caracteres' })
  tasa_minima?: string;

  @ApiPropertyOptional({
    description: 'Tasa máxima (si es rango)',
    example: '12.50',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La tasa_maxima no puede exceder 50 caracteres' })
  tasa_maxima?: string;

  @ApiPropertyOptional({
    description: 'Monto mínimo del crédito',
    example: '$50.000.000',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'El monto_minimo no puede exceder 50 caracteres' })
  monto_minimo?: string;

  @ApiPropertyOptional({
    description: 'Monto máximo del crédito',
    example: '$200.000.000',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'El monto_maximo no puede exceder 50 caracteres' })
  monto_maximo?: string;

  @ApiPropertyOptional({
    description: 'Plazo máximo del crédito',
    example: '20 años',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'El plazo_maximo no puede exceder 50 caracteres' })
  plazo_maximo?: string;

  @ApiPropertyOptional({
    description: 'Tipo de pago',
    example: 'Cuota fija',
    enum: ['Cuota fija', 'Cuota variable'],
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El tipo_pago no puede exceder 100 caracteres' })
  tipo_pago?: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Crédito hipotecario VIS en pesos con tasa fija',
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripcion es obligatoria' })
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Condiciones del producto (separadas por punto y coma)',
    example: 'Monto máximo 150 SMMLV; Plazo hasta 20 años; Seguro de vida obligatorio',
  })
  @IsString()
  @IsOptional()
  condiciones?: string;

  @ApiPropertyOptional({
    description: 'Requisitos del producto (separados por punto y coma)',
    example: 'Ingresos mínimos 2 SMMLV; Antigüedad laboral 1 año; Documento de identidad',
  })
  @IsString()
  @IsOptional()
  requisitos?: string;

  @ApiPropertyOptional({
    description: 'Descuento por nómina',
    example: '+200 pbs con cuenta de nómina',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'El descuento_nomina no puede exceder 255 caracteres' })
  descuento_nomina?: string;

  @ApiPropertyOptional({
    description: 'Beneficio de avalúo',
    example: 'Avalúo sin costo',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'El beneficio_avaluo no puede exceder 255 caracteres' })
  beneficio_avaluo?: string;

  @ApiProperty({
    description: 'Fecha de extracción (formato YYYY-MM-DD)',
    example: '2025-01-28',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
  })
  @IsString()
  @IsNotEmpty({ message: 'La fecha_extraccion es obligatoria' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha_extraccion debe tener formato YYYY-MM-DD (ej: 2025-01-20)',
  })
  fecha_extraccion: string;

  @ApiProperty({
    description: 'Hora de extracción (formato HH:mm:ss)',
    example: '14:30:00',
    pattern: '^\\d{2}:\\d{2}:\\d{2}$',
  })
  @IsString()
  @IsNotEmpty({ message: 'La hora_extraccion es obligatoria' })
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: 'La hora_extraccion debe tener formato HH:mm:ss (ej: 14:30:00)',
  })
  hora_extraccion: string;

  @ApiProperty({
    description: 'URL de la página donde se extrajo la información',
    example: 'https://www.bancolombia.com/personas/creditos/vivienda',
    format: 'uri',
  })
  @IsString()
  @IsNotEmpty({ message: 'La url_pagina es obligatoria' })
  @IsUrl({}, { message: 'La url_pagina debe ser una URL válida' })
  url_pagina: string;

  @ApiPropertyOptional({
    description: 'URL del PDF con información del producto',
    example: 'https://www.bancolombia.com/wcm/connect/tasas.pdf',
    format: 'uri',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsUrl({}, { message: 'La url_pdf debe ser una URL válida' })
  url_pdf?: string;
}
