import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO de respuesta para productos con todas las relaciones
 * Este DTO es solo para documentación, no se usa para validación
 */
export class ProductoResponseDto {
  @ApiProperty({
    description: 'UUID del producto',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID único de scraping',
    example: 'bancolombia__hipotecario__vis__pesos',
  })
  id_unico_scraping: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Crédito hipotecario VIS en pesos con tasa fija',
  })
  descripcion: string;

  @ApiProperty({
    description: 'URL donde se extrajo la información',
    example: 'https://www.bancolombia.com/personas/creditos/hipotecario',
  })
  url_extraccion: string;

  @ApiProperty({
    description: 'URL de redirección al producto',
    example: 'https://www.bancolombia.com/personas/creditos/hipotecario',
  })
  url_redireccion: string;

  @ApiPropertyOptional({
    description: 'URL del PDF del producto',
    example: 'https://www.bancolombia.com/wcm/connect/tasas.pdf',
  })
  url_pdf?: string;

  @ApiProperty({
    description: 'Fecha de extracción',
    example: '2026-01-29',
  })
  fecha_extraccion: Date;

  @ApiProperty({
    description: 'Hora de extracción',
    example: '10:30:00',
  })
  hora_extraccion: string;

  @ApiProperty({
    description: 'Indica si el producto está activo',
    example: true,
  })
  activo: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2026-01-29T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2026-01-29T15:45:00Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Entidad financiera',
    example: {
      id: '092a19bc-7f8c-41cb-9a56-a49ac9c35508',
      nombre: 'Bancolombia',
      nombre_normalizado: 'bancolombia',
    },
  })
  entidad: {
    id: string;
    nombre: string;
    nombre_normalizado: string;
  };

  @ApiProperty({
    description: 'Tipo de crédito',
    example: {
      id: '2e0430b1-d94d-4472-a34c-1b41fb9661c7',
      codigo: 'hipotecario',
      nombre: 'Crédito Hipotecario',
    },
  })
  tipo_credito: {
    id: string;
    codigo: string;
    nombre: string;
  };

  @ApiProperty({
    description: 'Tipo de vivienda',
    example: {
      id: '1f6861bc-409e-40f8-94af-7e605d854999',
      codigo: 'vis',
      nombre: 'VIS',
    },
  })
  tipo_vivienda: {
    id: string;
    codigo: string;
    nombre: string;
  };

  @ApiProperty({
    description: 'Denominación',
    example: {
      id: 'f69f7c38-c34f-41af-90dd-5b5062a9981d',
      codigo: 'pesos',
      nombre: 'Pesos',
    },
  })
  denominacion: {
    id: string;
    codigo: string;
    nombre: string;
  };

  @ApiPropertyOptional({
    description: 'Tipo de tasa',
    example: {
      id: '55343d92-12b0-4329-981b-b77a7f4924ad',
      codigo: 'efectiva_anual',
      nombre: 'Tasa Efectiva Anual',
    },
  })
  tipo_tasa?: {
    id: string;
    codigo: string;
    nombre: string;
  };

  @ApiPropertyOptional({
    description: 'Tipo de pago',
    example: {
      id: 'e797bbc8-e2c2-4e8a-aab6-747b8cf1420a',
      codigo: 'cuota_fija',
      nombre: 'Cuota Fija',
    },
  })
  tipo_pago?: {
    id: string;
    codigo: string;
    nombre: string;
  };

  @ApiPropertyOptional({
    description: 'Tasa vigente',
    examples: {
      pesos: {
        summary: 'Tasa en Pesos',
        value: {
          tasa_valor: 11.5,
          tasa_minima: 10.5,
          tasa_maxima: 12.5,
          es_rango: true,
          tasa_texto_original: '11.50% EA',
        },
      },
      uvr: {
        summary: 'Tasa en UVR',
        value: {
          tasa_valor: 6.5,
          tasa_final: 12.04,
          uvr_variacion_anual: 5.20,
          tasa_texto_original: 'UVR + 6.50%',
          es_rango: false,
        },
      },
    },
  })
  tasa_vigente?: {
    tasa_valor: number;
    tasa_final?: number;
    uvr_variacion_anual?: number;
    tasa_minima?: number;
    tasa_maxima?: number;
    es_rango: boolean;
    tasa_texto_original?: string;
  };

  @ApiPropertyOptional({
    description: 'Montos y plazos',
    example: {
      monto_minimo: 50000000,
      monto_maximo: 200000000,
      plazo_minimo_meses: 12,
      plazo_maximo_meses: 240,
    },
  })
  monto?: {
    monto_minimo?: number;
    monto_maximo?: number;
    plazo_minimo_meses?: number;
    plazo_maximo_meses?: number;
  };

  @ApiPropertyOptional({
    description: 'Condiciones del producto',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        condicion: { type: 'string', example: 'Tener cuenta de nómina' },
        orden: { type: 'number', example: 1 },
      },
    },
  })
  condiciones?: Array<{
    condicion: string;
    orden: number;
  }>;

  @ApiPropertyOptional({
    description: 'Requisitos del producto',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        requisito: { type: 'string', example: 'Documento de identidad' },
        es_obligatorio: { type: 'boolean', example: true },
        orden: { type: 'number', example: 1 },
      },
    },
  })
  requisitos?: Array<{
    requisito: string;
    es_obligatorio: boolean;
    orden: number;
  }>;

  @ApiPropertyOptional({
    description: 'Beneficios del producto',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        tipo_beneficio: { type: 'string', example: 'descuento_nomina' },
        descripcion: { type: 'string', example: 'Descuento en tasa' },
        valor: { type: 'string', example: '+200 pbs' },
        aplica_condicion: { type: 'string', example: 'Con cuenta de nómina' },
      },
    },
  })
  beneficios?: Array<{
    tipo_beneficio: string;
    descripcion: string;
    valor?: string;
    aplica_condicion?: string;
  }>;
}

export class PaginatedProductosResponseDto {
  @ApiProperty({
    description: 'Lista de productos',
    type: [ProductoResponseDto],
  })
  data: ProductoResponseDto[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    example: {
      total: 50,
      page: 1,
      limit: 10,
      totalPages: 5,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
