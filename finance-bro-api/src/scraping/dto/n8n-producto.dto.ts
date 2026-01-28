import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class N8nProductoDto {
  /**
   * ID único generado por n8n (banco__tipocredito__tipovivienda__denominacion)
   * Ejemplo: "bancolombia__creditohipotecario__vis__pesos"
   */
  @IsString()
  @IsNotEmpty({ message: 'El id_unico es obligatorio' })
  @MinLength(5, { message: 'El id_unico debe tener al menos 5 caracteres' })
  @MaxLength(255, { message: 'El id_unico no puede exceder 255 caracteres' })
  id_unico: string;

  /**
   * Nombre del banco o entidad financiera
   * Ejemplo: "Banco de Colombia", "Bancolombia", "Davivienda"
   */
  @IsString()
  @IsNotEmpty({ message: 'El banco es obligatorio' })
  @MaxLength(255, { message: 'El nombre del banco no puede exceder 255 caracteres' })
  banco: string;

  /**
   * Tipo de crédito
   * Ejemplo: "Crédito hipotecario para compra de vivienda", "Leasing habitacional"
   */
  @IsString()
  @IsNotEmpty({ message: 'El tipo_credito es obligatorio' })
  @MaxLength(255, { message: 'El tipo_credito no puede exceder 255 caracteres' })
  tipo_credito: string;

  /**
   * Tipo de vivienda
   * Valores: "VIS", "No VIS", "Aplica para ambos", "VIP"
   */
  @IsString()
  @IsNotEmpty({ message: 'El tipo_vivienda es obligatorio' })
  @MaxLength(100, { message: 'El tipo_vivienda no puede exceder 100 caracteres' })
  tipo_vivienda: string;

  /**
   * Denominación de la tasa
   * Valores: "Pesos", "UVR"
   */
  @IsString()
  @IsNotEmpty({ message: 'La denominacion es obligatoria' })
  @MaxLength(50, { message: 'La denominacion no puede exceder 50 caracteres' })
  denominacion: string;

  /**
   * Tipo de tasa
   * Ejemplo: "Tasa efectiva anual", "Tasa nominal mensual"
   */
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El tipo_tasa no puede exceder 100 caracteres' })
  tipo_tasa?: string;

  /**
   * Valor de la tasa
   * Ejemplo: "12.5%", "10% - 15%"
   */
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La tasa no puede exceder 50 caracteres' })
  tasa?: string;

  /**
   * Tasa mínima (si es rango)
   * Ejemplo: "10%"
   */
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La tasa_minima no puede exceder 50 caracteres' })
  tasa_minima?: string;

  /**
   * Tasa máxima (si es rango)
   * Ejemplo: "15%"
   */
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La tasa_maxima no puede exceder 50 caracteres' })
  tasa_maxima?: string;

  /**
   * Monto mínimo del crédito
   * Ejemplo: "$50,000,000"
   */
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'El monto_minimo no puede exceder 50 caracteres' })
  monto_minimo?: string;

  /**
   * Monto máximo del crédito
   * Ejemplo: "$500,000,000"
   */
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'El monto_maximo no puede exceder 50 caracteres' })
  monto_maximo?: string;

  /**
   * Plazo máximo del crédito
   * Ejemplo: "20 años", "240 meses"
   */
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'El plazo_maximo no puede exceder 50 caracteres' })
  plazo_maximo?: string;

  /**
   * Tipo de pago
   * Ejemplo: "Cuota fija", "Cuota variable"
   */
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El tipo_pago no puede exceder 100 caracteres' })
  tipo_pago?: string;

  /**
   * Descripción del producto
   * Ejemplo: "Crédito hipotecario VIS en pesos con tasa fija"
   */
  @IsString()
  @IsNotEmpty({ message: 'La descripcion es obligatoria' })
  descripcion: string;

  /**
   * Condiciones del producto (separadas por punto y coma)
   * Ejemplo: "Monto máximo 150 SMMLV; Plazo hasta 20 años"
   */
  @IsString()
  @IsOptional()
  condiciones?: string;

  /**
   * Requisitos del producto (separados por punto y coma)
   * Ejemplo: "Ingresos mínimos 2 SMMLV; Antigüedad laboral 1 año"
   */
  @IsString()
  @IsOptional()
  requisitos?: string;

  /**
   * Descuento por nómina
   * Ejemplo: "+200 pbs con cuenta de nómina"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'El descuento_nomina no puede exceder 255 caracteres' })
  descuento_nomina?: string;

  /**
   * Beneficio de avalúo
   * Ejemplo: "Avalúo gratis", "50% descuento en avalúo"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'El beneficio_avaluo no puede exceder 255 caracteres' })
  beneficio_avaluo?: string;

  /**
   * Fecha de extracción (formato YYYY-MM-DD)
   * Ejemplo: "2025-01-20"
   */
  @IsString()
  @IsNotEmpty({ message: 'La fecha_extraccion es obligatoria' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha_extraccion debe tener formato YYYY-MM-DD (ej: 2025-01-20)',
  })
  fecha_extraccion: string;

  /**
   * Hora de extracción (formato HH:mm:ss)
   * Ejemplo: "14:30:00"
   */
  @IsString()
  @IsNotEmpty({ message: 'La hora_extraccion es obligatoria' })
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: 'La hora_extraccion debe tener formato HH:mm:ss (ej: 14:30:00)',
  })
  hora_extraccion: string;

  /**
   * URL de la página donde se extrajo la información
   * Ejemplo: "https://www.bancolombia.com/personas/creditos/vivienda"
   */
  @IsString()
  @IsNotEmpty({ message: 'La url_pagina es obligatoria' })
  @IsUrl({}, { message: 'La url_pagina debe ser una URL válida' })
  url_pagina: string;

  /**
   * URL del PDF (opcional)
   * Ejemplo: "https://www.bancolombia.com/wcm/connect/tasas.pdf"
   */
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'La url_pdf debe ser una URL válida' })
  url_pdf?: string;
}
