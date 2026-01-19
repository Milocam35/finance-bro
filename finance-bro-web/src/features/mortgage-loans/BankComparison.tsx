import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ArrowUpDown } from "lucide-react";
import { BankCard } from "./BankCard";
import { CreditFilters, FilterState } from "./CreditFilters";
import { ProductoCredito } from "./types";

const productosData: ProductoCredito[] = [
  {
    id: "prod-001",
    id_unico_scraping: "bancolombia__creditohipotecario__vis__uvr",
    activo: true,
    entidad: {
      id: "ent-001",
      nombre: "Bancolombia",
      nombre_normalizado: "bancolombia",
      logo_url: null,
      sitio_web: "https://www.bancolombia.com",
      activo: true,
    },
    tipo_vivienda: {
      id: "tv-002",
      codigo: "vis",
      nombre: "VIS",
      valor_maximo_smmlv: 135,
    },
    denominacion: {
      id: "den-002",
      codigo: "uvr",
      nombre: "UVR",
    },
    tipo_tasa: {
      id: "tt-001",
      codigo: "efectiva_anual",
      nombre: "Tasa efectiva anual",
    },
    tipo_pago: {
      id: "tp-002",
      codigo: "cuota_variable",
      nombre: "Cuota Variable",
    },
    descripcion: "Crédito hipotecario VIS en UVR. Tasa efectiva anual desde UVR + 6.50%.",
    url_pagina: "https://www.bancolombia.com/personas/creditos/vivienda/credito-hipotecario-para-comprar-vivienda",
    url_pdf: undefined,
    tasa_vigente: {
      producto_id: "prod-001",
      tasa_valor: 6.50,
      tasa_texto_original: "UVR + 6.50%",
      tasa_minima: undefined,
      tasa_maxima: undefined,
      es_rango: false,
      spread_uvr: 6.50,
      fecha_vigencia: "2026-01-14",
    },
    monto: {
      producto_id: "prod-001",
      monto_minimo: 0,
      monto_maximo: 262635750,
      plazo_minimo_meses: 12,
      plazo_maximo_meses: 360,
      porcentaje_financiacion_min: 0,
      porcentaje_financiacion_max: 80,
    },
    condiciones: [
      { id: "cond-001", producto_id: "prod-001", condicion: "Aplica para vivienda de interés social (VIS) cuyo valor comercial no exceda los $262,635,750", orden: 1 },
      { id: "cond-002", producto_id: "prod-001", condicion: "Financiación hasta el 80% del valor comercial", orden: 2 },
    ],
    requisitos: [
      { id: "req-001", producto_id: "prod-001", requisito: "Ingresos mínimos de 1 SMMLV", tipo_requisito: "ingresos", es_obligatorio: true, orden: 1 },
      { id: "req-002", producto_id: "prod-001", requisito: "Avalúo y estudio jurídico", tipo_requisito: "documentacion", es_obligatorio: true, orden: 2 },
    ],
    beneficios: [
      { id: "ben-001", producto_id: "prod-001", tipo_beneficio: "otro", descripcion: "Tasa competitiva en UVR", valor: "Desde UVR + 6.50%", aplica_condicion: undefined },
      { id: "ben-002", producto_id: "prod-001", tipo_beneficio: "otro", descripcion: "Financiación hasta 80% del valor", valor: undefined, aplica_condicion: undefined },
      { id: "ben-003", producto_id: "prod-001", tipo_beneficio: "otro", descripcion: "Plazo hasta 30 años", valor: undefined, aplica_condicion: undefined },
    ],
    rating: undefined,
    cat: undefined,
    cuota_mensual_estimada: undefined,
    tiempo_procesamiento: undefined,
    highlight: "💰 Mejor opción VIS en UVR",
  },
  {
    id: "prod-002",
    id_unico_scraping: "davivienda-vis-001",
    activo: true,
    entidad: {
      id: "ent-002",
      nombre: "Davivienda",
      nombre_normalizado: "davivienda",
      logo_url: null,
      sitio_web: "https://www.davivienda.com",
      activo: true,
    },
    tipo_vivienda: {
      id: "tv-002",
      codigo: "vis",
      nombre: "VIS",
      valor_maximo_smmlv: 135,
    },
    denominacion: {
      id: "den-001",
      codigo: "pesos",
      nombre: "Pesos",
    },
    tipo_tasa: {
      id: "tt-001",
      codigo: "efectiva_anual",
      nombre: "Efectiva Anual",
    },
    tipo_pago: {
      id: "tp-001",
      codigo: "cuota_fija",
      nombre: "Cuota Fija",
    },
    descripcion: "Crédito hipotecario subsidiado VIS con cobertura del gobierno y tasas preferenciales para vivienda de interés social.",
    url_pagina: "https://www.davivienda.com/personas/creditos/credito-hipotecario",
    url_pdf: undefined,
    tasa_vigente: {
      producto_id: "prod-002",
      tasa_valor: 12.99,
      tasa_texto_original: "12.99% E.A.",
      tasa_minima: undefined,
      tasa_maxima: undefined,
      es_rango: false,
      spread_uvr: undefined,
      fecha_vigencia: "2026-01-15",
    },
    monto: {
      producto_id: "prod-002",
      monto_minimo: 30000000,
      monto_maximo: 180000000,
      plazo_minimo_meses: 60,
      plazo_maximo_meses: 240,
      porcentaje_financiacion_min: 70,
      porcentaje_financiacion_max: 80,
    },
    condiciones: [
      { id: "cond-004", producto_id: "prod-002", condicion: "Aplica subsidio del gobierno para vivienda VIS", orden: 1 },
      { id: "cond-005", producto_id: "prod-002", condicion: "Cobertura de tasa de interés del gobierno hasta 5 años", orden: 2 },
    ],
    requisitos: [
      { id: "req-005", producto_id: "prod-002", requisito: "Cédula de ciudadanía", tipo_requisito: "documentacion", es_obligatorio: true, orden: 1 },
      { id: "req-006", producto_id: "prod-002", requisito: "Ingresos no superiores a 4 SMMLV", tipo_requisito: "ingresos", es_obligatorio: true, orden: 2 },
      { id: "req-007", producto_id: "prod-002", requisito: "No ser propietario de otra vivienda", tipo_requisito: "otro", es_obligatorio: true, orden: 3 },
    ],
    beneficios: [
      { id: "ben-004", producto_id: "prod-002", tipo_beneficio: "otro", descripcion: "Cobertura de tasa de interés del gobierno", valor: "Hasta 5 años", aplica_condicion: "Aprobación de subsidio" },
      { id: "ben-005", producto_id: "prod-002", tipo_beneficio: "seguros_incluidos", descripcion: "Seguro de vida incluido", valor: undefined, aplica_condicion: undefined },
      { id: "ben-006", producto_id: "prod-002", tipo_beneficio: "descuento_lealtad", descripcion: "Puntos DaviPlata por cada pago", valor: undefined, aplica_condicion: undefined },
    ],
    rating: 4.4,
    cat: 15.3,
    cuota_mensual_estimada: 4920000,
    tiempo_procesamiento: "12-18 días",
  },
  {
    id: "prod-003",
    id_unico_scraping: "bbogota-novis-uvr-001",
    activo: true,
    entidad: {
      id: "ent-003",
      nombre: "Banco de Bogotá",
      nombre_normalizado: "banco-de-bogota",
      logo_url: null,
      sitio_web: "https://www.bancodebogota.com",
      activo: true,
    },
    tipo_vivienda: {
      id: "tv-001",
      codigo: "no_vis",
      nombre: "No VIS",
    },
    denominacion: {
      id: "den-002",
      codigo: "uvr",
      nombre: "UVR",
    },
    tipo_tasa: {
      id: "tt-001",
      codigo: "efectiva_anual",
      nombre: "Efectiva Anual",
    },
    tipo_pago: {
      id: "tp-002",
      codigo: "cuota_variable",
      nombre: "Cuota Variable",
    },
    descripcion: "Crédito hipotecario en UVR con tasas competitivas y plazos extendidos. Ideal para quienes buscan estabilidad a largo plazo.",
    url_pagina: "https://www.bancodebogota.com/personas/creditos/hipotecario",
    url_pdf: "https://www.bancodebogota.com/personas/creditos/hipotecario.pdf",
    tasa_vigente: {
      producto_id: "prod-003",
      tasa_valor: 6.25,
      tasa_texto_original: "UVR + 6.25%",
      tasa_minima: 5.99,
      tasa_maxima: 7.50,
      es_rango: true,
      spread_uvr: 6.25,
      fecha_vigencia: "2026-01-15",
    },
    monto: {
      producto_id: "prod-003",
      monto_minimo: 80000000,
      monto_maximo: 3000000000,
      plazo_minimo_meses: 60,
      plazo_maximo_meses: 300,
      porcentaje_financiacion_min: 50,
      porcentaje_financiacion_max: 70,
    },
    condiciones: [
      { id: "cond-006", producto_id: "prod-003", condicion: "Tasa variable indexada a UVR", orden: 1 },
      { id: "cond-007", producto_id: "prod-003", condicion: "Cuota ajustable anualmente según inflación", orden: 2 },
      { id: "cond-008", producto_id: "prod-003", condicion: "Opción de cambio a tasa fija después de 3 años", orden: 3 },
    ],
    requisitos: [
      { id: "req-008", producto_id: "prod-003", requisito: "Cédula de ciudadanía", tipo_requisito: "documentacion", es_obligatorio: true, orden: 1 },
      { id: "req-009", producto_id: "prod-003", requisito: "Declaración de renta últimos 2 años", tipo_requisito: "ingresos", es_obligatorio: true, orden: 2 },
      { id: "req-010", producto_id: "prod-003", requisito: "Score crediticio mínimo de 700", tipo_requisito: "historial_credito", es_obligatorio: true, orden: 3 },
    ],
    beneficios: [
      { id: "ben-007", producto_id: "prod-003", tipo_beneficio: "descuento_nomina", descripcion: "Tasa preferencial", valor: "-0.5%", aplica_condicion: "Con nómina Banco de Bogotá" },
      { id: "ben-008", producto_id: "prod-003", tipo_beneficio: "otro", descripcion: "Plazo extendido hasta 25 años", valor: undefined, aplica_condicion: undefined },
      { id: "ben-009", producto_id: "prod-003", tipo_beneficio: "otro", descripcion: "Banca móvil premium sin costo", valor: undefined, aplica_condicion: undefined },
    ],
    rating: 4.3,
    cat: 15.7,
    cuota_mensual_estimada: 4985000,
    tiempo_procesamiento: "10-15 días",
  },
  {
    id: "prod-004",
    id_unico_scraping: "bbva-novis-001",
    activo: true,
    entidad: {
      id: "ent-004",
      nombre: "BBVA Colombia",
      nombre_normalizado: "bbva-colombia",
      logo_url: null,
      sitio_web: "https://www.bbva.com.co",
      activo: true,
    },
    tipo_vivienda: {
      id: "tv-003",
      codigo: "aplica_ambos",
      nombre: "VIS y No VIS",
    },
    denominacion: {
      id: "den-001",
      codigo: "pesos",
      nombre: "Pesos",
    },
    tipo_tasa: {
      id: "tt-001",
      codigo: "efectiva_anual",
      nombre: "Efectiva Anual",
    },
    tipo_pago: {
      id: "tp-001",
      codigo: "cuota_fija",
      nombre: "Cuota Fija",
    },
    descripcion: "Crédito hipotecario flexible que aplica para VIS y No VIS con plazos extendidos y atención premier personalizada.",
    url_pagina: "https://www.bbva.com.co/personas/productos/creditos/hipotecario.html",
    url_pdf: undefined,
    tasa_vigente: {
      producto_id: "prod-004",
      tasa_valor: 13.50,
      tasa_texto_original: "Desde 13.50% E.A.",
      tasa_minima: 13.50,
      tasa_maxima: 14.99,
      es_rango: true,
      spread_uvr: undefined,
      fecha_vigencia: "2026-01-15",
    },
    monto: {
      producto_id: "prod-004",
      monto_minimo: 40000000,
      monto_maximo: 2500000000,
      plazo_minimo_meses: 60,
      plazo_maximo_meses: 300,
      porcentaje_financiacion_min: 50,
      porcentaje_financiacion_max: 80,
    },
    condiciones: [
      { id: "cond-009", producto_id: "prod-004", condicion: "Aplica para VIS y No VIS según el avalúo del inmueble", orden: 1 },
      { id: "cond-010", producto_id: "prod-004", condicion: "Opción de tasa mixta (fija los primeros 5 años, luego variable)", orden: 2 },
    ],
    requisitos: [
      { id: "req-011", producto_id: "prod-004", requisito: "Documento de identidad vigente", tipo_requisito: "documentacion", es_obligatorio: true, orden: 1 },
      { id: "req-012", producto_id: "prod-004", requisito: "Certificado laboral o RUT", tipo_requisito: "ingresos", es_obligatorio: true, orden: 2 },
    ],
    beneficios: [
      { id: "ben-010", producto_id: "prod-004", tipo_beneficio: "otro", descripcion: "Plazo extendido hasta 25 años", valor: undefined, aplica_condicion: undefined },
      { id: "ben-011", producto_id: "prod-004", tipo_beneficio: "otro", descripcion: "Servicio de banca premier incluido", valor: undefined, aplica_condicion: "Créditos superiores a $500M" },
      { id: "ben-012", producto_id: "prod-004", tipo_beneficio: "otro", descripcion: "Opción de tasa mixta", valor: undefined, aplica_condicion: undefined },
    ],
    rating: 4.2,
    cat: 16.0,
    cuota_mensual_estimada: 5045000,
    tiempo_procesamiento: "18-25 días",
    highlight: "🏆 Mayor plazo disponible",
  },
];

export function BankComparison() {
  const [filters, setFilters] = useState<FilterState>({
    amount: 200000000,
    term: 20,
    propertyType: "all",
    housingType: "all",
    denomination: "all",
    sortBy: "rate",
  });

  // Filtrar productos según los filtros activos
  const filteredProductos = productosData.filter((producto) => {
    // Filtrar por tipo de vivienda
    if (filters.housingType && filters.housingType !== "all") {
      if (producto.tipo_vivienda.codigo === "aplica_ambos") {
        // Si el producto aplica para ambos, siempre se muestra
      } else if (producto.tipo_vivienda.codigo !== filters.housingType) {
        return false;
      }
    }

    // Filtrar por denominación
    if (filters.denomination && filters.denomination !== "all") {
      if (producto.denominacion.codigo !== filters.denomination) {
        return false;
      }
    }

    return true;
  });

  // Ordenar productos filtrados
  const sortedProductos = [...filteredProductos].sort((a, b) => {
    switch (filters.sortBy) {
      case "rate":
        return a.tasa_vigente.tasa_valor - b.tasa_vigente.tasa_valor;
      case "payment":
        return (a.cuota_mensual_estimada || 0) - (b.cuota_mensual_estimada || 0);
      case "cat":
        return (a.cat || 0) - (b.cat || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  return (
    <>
      {/* Header Section with Blue Background and Waves */}
      <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden bg-[#001233]">
        {/* Fondo sólido base */}
        <div className="absolute inset-0 bg-[#001233]" />

        {/* Olas decorativas en el fondo */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Ola 1 - superior */}
          <svg
            className="absolute top-0 left-0 w-full"
            viewBox="0 0 1440 300"
            preserveAspectRatio="none"
            style={{ height: "50%", transform: "rotate(180deg)" }}
          >
            <path
              d="M0,250 C180,220 360,160 540,160 C720,160 900,220 1080,240 C1260,260 1380,220 1440,200 L1440,0 L0,0 Z"
              fill="#002855"
              fillOpacity="0.3"
            />
          </svg>

          {/* Ola 2 - decorativa */}
          <svg
            className="absolute top-0 left-0 w-full"
            viewBox="0 0 1440 300"
            preserveAspectRatio="none"
            style={{ height: "35%", transform: "rotate(180deg)" }}
          >
            <path
              d="M0,280 C240,240 480,180 720,200 C960,220 1200,280 1440,240 L1440,0 L0,0 Z"
              fill="#0353A4"
              fillOpacity="0.2"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 lg:py-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-4">
              <Building2 className="w-4 h-4" />
              Créditos Hipotecarios Para Compra De Vivienda
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Compara las mejores opciones
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Encontramos las tasas más competitivas de los principales bancos.
              Toda la información actualizada para que tomes la mejor decisión.
            </p>
          </motion.div>
        </div>

        {/* Transición suave */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Filters and Results Section */}
      <section className="pt-8 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="mb-10">
            <CreditFilters onFilterChange={setFilters} />
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{sortedProductos.length}</span> opciones encontradas
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpDown className="w-4 h-4" />
              Ordenado por: <span className="font-medium text-foreground">
                {filters.sortBy === "rate" && "Menor tasa"}
                {filters.sortBy === "payment" && "Menor mensualidad"}
                {filters.sortBy === "cat" && "Menor costo total"}
                {filters.sortBy === "rating" && "Mejor calificación"}
              </span>
            </div>
          </div>

          {/* Bank Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedProductos.map((producto, index) => (
              <BankCard
                key={producto.id}
                producto={producto}
                index={index}
                loanAmount={filters.amount}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
