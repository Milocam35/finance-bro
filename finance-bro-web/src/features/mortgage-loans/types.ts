// Tipos de catálogos (Datos Maestros)
export type TipoCreditoCodigo = 'hipotecario' | 'consumo' | 'vehiculo';
export type TipoViviendaCodigo = 'vis' | 'no_vis' | 'vip' | 'aplica_ambos';
export type DenominacionCodigo = 'pesos' | 'uvr';
export type TipoTasaCodigo = 'efectiva_anual' | 'nominal_mensual';
export type TipoPagoCodigo = 'cuota_fija' | 'cuota_variable';
export type TipoBeneficio = 'descuento_nomina' | 'descuento_lealtad' | 'sin_comisiones' | 'seguros_incluidos' | 'otro';
export type TipoRequisito = 'documentacion' | 'ingresos' | 'historial_credito' | 'garantias' | 'otro';

// Entidad Financiera
export interface EntidadFinanciera {
  id: string;
  nombre: string;
  nombre_normalizado: string;
  logo_url?: string | null;
  sitio_web?: string;
  activo?: boolean;
}

// Tipos de catálogo
export interface TipoCredito {
  id: string;
  codigo: string;
  nombre: string;
}

export interface TipoVivienda {
  id: string;
  codigo: TipoViviendaCodigo;
  nombre: string;
  valor_maximo_smmlv?: number;
}

export interface Denominacion {
  id: string;
  codigo: DenominacionCodigo;
  nombre: string;
}

export interface TipoTasa {
  id: string;
  codigo: TipoTasaCodigo;
  nombre: string;
}

export interface TipoPago {
  id: string;
  codigo: TipoPagoCodigo;
  nombre: string;
}

// Tasa del producto
export interface TasaVigente {
  tasa_valor: number;
  tasa_texto_original?: string;
  tasa_final?: number;
  uvr_variacion_anual?: number;
  tasa_minima?: number;
  tasa_maxima?: number;
  es_rango: boolean;
}

// Montos y condiciones
export interface MontoProducto {
  monto_minimo?: number;
  monto_maximo?: number;
  plazo_minimo_meses?: number;
  plazo_maximo_meses?: number;
}

export interface CondicionProducto {
  condicion: string;
  orden: number;
}

export interface RequisitoProducto {
  requisito: string;
  es_obligatorio: boolean;
  orden: number;
}

export interface BeneficioProducto {
  tipo_beneficio: string;
  descripcion: string;
  valor?: string;
  aplica_condicion?: string;
}

// Producto de crédito completo (alineado con ProductoResponseDto del backend)
export interface ProductoCredito {
  id: string;
  id_unico_scraping: string;
  entidad: EntidadFinanciera;
  tipo_credito: TipoCredito;
  tipo_vivienda: TipoVivienda;
  denominacion: Denominacion;
  tipo_tasa?: TipoTasa;
  tipo_pago?: TipoPago;
  descripcion?: string;
  url_extraccion?: string;
  url_redireccion?: string;
  url_pdf?: string;
  fecha_extraccion?: string;
  hora_extraccion?: string;
  activo: boolean;

  // Relaciones
  tasa_vigente?: TasaVigente;
  monto?: MontoProducto;
  condiciones?: CondicionProducto[];
  requisitos?: RequisitoProducto[];
  beneficios?: BeneficioProducto[];
}

// Respuesta paginada del backend
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
