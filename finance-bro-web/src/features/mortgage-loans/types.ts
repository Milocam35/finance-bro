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
  logo_url: string | null;
  sitio_web: string;
  activo: boolean;
}

// Tipos de catálogo
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
  producto_id: string;
  tasa_valor: number;
  tasa_texto_original: string;
  tasa_minima?: number;
  tasa_maxima?: number;
  es_rango: boolean;
  spread_uvr?: number;
  fecha_vigencia: string;
}

// Montos y condiciones
export interface MontoProducto {
  producto_id: string;
  monto_minimo: number;
  monto_maximo: number;
  plazo_minimo_meses: number;
  plazo_maximo_meses: number;
  porcentaje_financiacion_min: number;
  porcentaje_financiacion_max: number;
}

export interface CondicionProducto {
  id: string;
  producto_id: string;
  condicion: string;
  orden: number;
}

export interface RequisitoProducto {
  id: string;
  producto_id: string;
  requisito: string;
  tipo_requisito: TipoRequisito;
  es_obligatorio: boolean;
  orden: number;
}

export interface BeneficioProducto {
  id: string;
  producto_id: string;
  tipo_beneficio: TipoBeneficio;
  descripcion: string;
  valor?: string;
  aplica_condicion?: string;
}

// Producto de crédito completo
export interface ProductoCredito {
  id: string;
  id_unico_scraping: string;
  entidad: EntidadFinanciera;
  tipo_vivienda: TipoVivienda;
  denominacion: Denominacion;
  tipo_tasa: TipoTasa;
  tipo_pago: TipoPago;
  descripcion?: string;
  url_pagina?: string;
  url_pdf?: string;
  activo: boolean;

  // Relaciones
  tasa_vigente: TasaVigente;
  monto: MontoProducto;
  condiciones: CondicionProducto[];
  requisitos: RequisitoProducto[];
  beneficios: BeneficioProducto[];

  // Campos calculados (para el frontend)
  rating?: number;
  cat?: number; // Costo Anual Total
  cuota_mensual_estimada?: number;
  tiempo_procesamiento?: string;
  highlight?: string; // Badge destacado (ej: "Mejor tasa", "Mayor plazo")
}

// Tipo simplificado para la vista de tarjetas
export interface ProductoCreditoCard {
  id: string;
  entidad: {
    nombre: string;
    logo_url: string | null;
  };
  tipo_vivienda: {
    codigo: TipoViviendaCodigo;
    nombre: string;
  };
  denominacion: {
    codigo: DenominacionCodigo;
    nombre: string;
  };
  tipo_tasa: {
    codigo: TipoTasaCodigo;
    nombre: string;
  };
  tipo_pago: {
    codigo: TipoPagoCodigo;
    nombre: string;
  };
  tasa_vigente: {
    tasa_valor: number;
    es_rango: boolean;
    tasa_minima?: number;
    tasa_maxima?: number;
    spread_uvr?: number;
  };
  monto: {
    monto_minimo: number;
    monto_maximo: number;
    plazo_minimo_meses: number;
    plazo_maximo_meses: number;
    porcentaje_financiacion_min: number;
    porcentaje_financiacion_max: number;
  };
  beneficios: BeneficioProducto[];
  rating?: number;
  cat?: number;
  cuota_mensual_estimada?: number;
  tiempo_procesamiento?: string;
  highlight?: string;
}
