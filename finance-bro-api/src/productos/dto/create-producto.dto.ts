import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsUrl,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTOs anidados para relaciones
class CreateTasaDto {
  @ApiProperty({
    description: 'Valor de la tasa (porcentaje)',
    example: 11.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  tasa_valor: number;

  @ApiPropertyOptional({
    description: 'Tasa final calculada - conversión UVR a EA (solo para productos en UVR)',
    example: 12.04,
  })
  @IsOptional()
  @IsNumber()
  tasa_final?: number;

  @ApiPropertyOptional({
    description: 'Variación anual del UVR (solo para productos en UVR)',
    example: 5.20,
  })
  @IsOptional()
  @IsNumber()
  uvr_variacion_anual?: number;

  @ApiPropertyOptional({
    description: 'Tasa mínima si es rango',
    example: 10.5,
  })
  @IsOptional()
  @IsNumber()
  tasa_minima?: number;

  @ApiPropertyOptional({
    description: 'Tasa máxima si es rango',
    example: 12.5,
  })
  @IsOptional()
  @IsNumber()
  tasa_maxima?: number;

  @ApiProperty({
    description: 'Indica si la tasa es un rango',
    example: true,
  })
  @IsBoolean()
  es_rango: boolean;

  @ApiPropertyOptional({
    description: 'Texto original de la tasa',
    example: '11.50% EA',
  })
  @IsOptional()
  @IsString()
  tasa_texto_original?: string;
}

class CreateMontoDto {
  @ApiPropertyOptional({
    description: 'Monto mínimo del crédito',
    example: 50000000,
  })
  @IsOptional()
  @IsNumber()
  monto_minimo?: number;

  @ApiPropertyOptional({
    description: 'Monto máximo del crédito',
    example: 200000000,
  })
  @IsOptional()
  @IsNumber()
  monto_maximo?: number;

  @ApiPropertyOptional({
    description: 'Plazo mínimo en meses',
    example: 12,
  })
  @IsOptional()
  @IsNumber()
  plazo_minimo_meses?: number;

  @ApiPropertyOptional({
    description: 'Plazo máximo en meses',
    example: 240,
  })
  @IsOptional()
  @IsNumber()
  plazo_maximo_meses?: number;
}

class CreateCondicionDto {
  @ApiProperty({
    description: 'Texto de la condición',
    example: 'Tener cuenta de nómina',
  })
  @IsString()
  @IsNotEmpty()
  condicion: string;

  @ApiProperty({
    description: 'Orden de la condición',
    example: 1,
  })
  @IsNumber()
  orden: number;
}

class CreateRequisitoDto {
  @ApiProperty({
    description: 'Texto del requisito',
    example: 'Documento de identidad',
  })
  @IsString()
  @IsNotEmpty()
  requisito: string;

  @ApiProperty({
    description: 'Indica si el requisito es obligatorio',
    example: true,
  })
  @IsBoolean()
  es_obligatorio: boolean;

  @ApiProperty({
    description: 'Orden del requisito',
    example: 1,
  })
  @IsNumber()
  orden: number;
}

class CreateBeneficioDto {
  @ApiProperty({
    description: 'Tipo de beneficio',
    example: 'descuento_nomina',
    enum: ['descuento_nomina', 'avaluo', 'estudio_credito', 'otro'],
  })
  @IsString()
  @IsNotEmpty()
  tipo_beneficio: string;

  @ApiProperty({
    description: 'Descripción del beneficio',
    example: 'Descuento en tasa con cuenta de nómina',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Valor del beneficio',
    example: '+200 pbs',
  })
  @IsOptional()
  @IsString()
  valor?: string;

  @ApiPropertyOptional({
    description: 'Condición para aplicar el beneficio',
    example: 'Con Cuenta de Nómina',
  })
  @IsOptional()
  @IsString()
  aplica_condicion?: string;
}

export class CreateProductoDto {
  @ApiProperty({
    description: 'ID único de scraping (para idempotencia)',
    example: 'bancolombia__hipotecario__vis__pesos',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  id_unico_scraping: string;

  @ApiProperty({
    description: 'UUID de la entidad financiera (Bancolombia)',
    example: '092a19bc-7f8c-41cb-9a56-a49ac9c35508',
  })
  @IsUUID()
  entidad_id: string;

  @ApiProperty({
    description: 'UUID del tipo de crédito (Hipotecario)',
    example: '2e0430b1-d94d-4472-a34c-1b41fb9661c7',
  })
  @IsUUID()
  tipo_credito_id: string;

  @ApiProperty({
    description: 'UUID del tipo de vivienda (VIS)',
    example: '1f6861bc-409e-40f8-94af-7e605d854999',
  })
  @IsUUID()
  tipo_vivienda_id: string;

  @ApiProperty({
    description: 'UUID de la denominación (Pesos)',
    example: 'f69f7c38-c34f-41af-90dd-5b5062a9981d',
  })
  @IsUUID()
  denominacion_id: string;

  @ApiPropertyOptional({
    description: 'UUID del tipo de tasa (Efectiva Anual)',
    example: '55343d92-12b0-4329-981b-b77a7f4924ad',
  })
  @IsOptional()
  @IsUUID()
  tipo_tasa_id?: string;

  @ApiPropertyOptional({
    description: 'UUID del tipo de pago (Cuota Fija)',
    example: 'e797bbc8-e2c2-4e8a-aab6-747b8cf1420a',
  })
  @IsOptional()
  @IsUUID()
  tipo_pago_id?: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Crédito hipotecario VIS en pesos con tasa fija',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description: 'URL donde se extrajo la información',
    example: 'https://www.bancolombia.com/personas/creditos/hipotecario',
  })
  @IsUrl()
  @IsNotEmpty()
  url_extraccion: string;

  @ApiProperty({
    description: 'URL de redirección al producto',
    example: 'https://www.bancolombia.com/personas/creditos/hipotecario',
  })
  @IsUrl()
  @IsNotEmpty()
  url_redireccion: string;

  @ApiPropertyOptional({
    description: 'URL del PDF con información del producto',
    example: 'https://www.bancolombia.com/wcm/connect/tasas.pdf',
  })
  @IsOptional()
  @IsUrl()
  url_pdf?: string;

  @ApiProperty({
    description: 'Fecha de extracción (YYYY-MM-DD)',
    example: '2026-01-29',
  })
  @IsString()
  @IsNotEmpty()
  fecha_extraccion: string;

  @ApiProperty({
    description: 'Hora de extracción (HH:mm:ss)',
    example: '10:30:00',
  })
  @IsString()
  @IsNotEmpty()
  hora_extraccion: string;

  @ApiProperty({
    description: 'Indica si el producto está activo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  // Relaciones anidadas
  @ApiPropertyOptional({
    description: 'Tasa vigente del producto',
    type: CreateTasaDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTasaDto)
  tasa?: CreateTasaDto;

  @ApiPropertyOptional({
    description: 'Montos y plazos del producto',
    type: CreateMontoDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMontoDto)
  monto?: CreateMontoDto;

  @ApiPropertyOptional({
    description: 'Condiciones del producto',
    type: [CreateCondicionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCondicionDto)
  condiciones?: CreateCondicionDto[];

  @ApiPropertyOptional({
    description: 'Requisitos del producto',
    type: [CreateRequisitoDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequisitoDto)
  requisitos?: CreateRequisitoDto[];

  @ApiPropertyOptional({
    description: 'Beneficios del producto',
    type: [CreateBeneficioDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBeneficioDto)
  beneficios?: CreateBeneficioDto[];
}
