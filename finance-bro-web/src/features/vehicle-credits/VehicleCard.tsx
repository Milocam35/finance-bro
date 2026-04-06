import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Check,
  Info,
  ExternalLink,
  FileText,
  RotateCcw,
  CalendarDays,
  Scale,
  Calculator,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductoCredito } from "@/features/mortgage-loans/types";
import { SimulationSheet } from "@/features/shared/common/SimulationSheet";
import type { ResultadoLoteItem } from "@/lib/query-keys";

interface VehicleCardProps {
  producto: ProductoCredito;
  index: number;
  loanAmount: number;
  termMonths: number;
  simulacionResult?: ResultadoLoteItem;
  promedioLote?: number;
  allProducts: ProductoCredito[];
  onToggleComparison?: () => void;
  isInComparison?: boolean;
}

const BANK_LOGOS: Record<string, string> = {
  bancolombia: "/images/banks/bancolombia.png",
  davivienda: "/images/banks/davivienda.png",
  bbva: "/images/banks/bbva.png",
  scotiabank: "/images/banks/davibank.jpg",
  "scotiabank colpatria": "/images/banks/davibank.jpg",
  colpatria: "/images/banks/davibank.jpg",
  itau: "/images/banks/itau.png",
  "itaú": "/images/banks/itau.png",
  "banco itaú": "/images/banks/itau.png",
  lulo: "/images/banks/lulobank.png",
  "lulo bank": "/images/banks/lulobank.png",
  lulobank: "/images/banks/lulobank.png",
  nu: "/images/banks/nu.svg",
  "nu colombia": "/images/banks/nu.svg",
  credifamilia: "/images/banks/credifamilia.png",
  koa: "/images/banks/koa.png",
  iris: "/images/banks/iris.png",
};

function getBankLogo(entidad: { nombre: string; nombre_normalizado: string; logo_url?: string | null }): string | null {
  if (entidad.logo_url) return entidad.logo_url;
  const normalized = entidad.nombre_normalizado.toLowerCase();
  if (BANK_LOGOS[normalized]) return BANK_LOGOS[normalized];
  for (const [key, path] of Object.entries(BANK_LOGOS)) {
    if (normalized.includes(key) || key.includes(normalized)) return path;
  }
  return null;
}

const BANK_COLORS: Record<string, { primary: string; bg: string }> = {
  bancolombia: { primary: "#FDDA24", bg: "rgba(253, 218, 36, 0.08)" },
  davivienda: { primary: "#ED1C24", bg: "rgba(237, 28, 36, 0.08)" },
  bbva: { primary: "#004481", bg: "rgba(0, 68, 129, 0.08)" },
  scotiabank: { primary: "#EC111A", bg: "rgba(236, 17, 26, 0.08)" },
  colpatria: { primary: "#EC111A", bg: "rgba(236, 17, 26, 0.08)" },
  itau: { primary: "#EC7000", bg: "rgba(236, 112, 0, 0.08)" },
  lulobank: { primary: "#00C389", bg: "rgba(0, 195, 137, 0.08)" },
  nu: { primary: "#820AD1", bg: "rgba(130, 10, 209, 0.08)" },
  credifamilia: { primary: "#00A651", bg: "rgba(0, 166, 81, 0.08)" },
  koa: { primary: "#1B3A5C", bg: "rgba(27, 58, 92, 0.08)" },
  iris: { primary: "#6B5CE7", bg: "rgba(107, 92, 231, 0.08)" },
};

function getBankColor(nombre_normalizado: string): { primary: string; bg: string } {
  const normalized = nombre_normalizado.toLowerCase();
  if (BANK_COLORS[normalized]) return BANK_COLORS[normalized];
  for (const [key, colors] of Object.entries(BANK_COLORS)) {
    if (normalized.includes(key) || key.includes(normalized)) return colors;
  }
  return { primary: "hsl(var(--secondary))", bg: "hsl(var(--secondary) / 0.08)" };
}

function getDisplayRate(producto: ProductoCredito): number {
  const tv = producto.tasa_vigente;
  if (!tv) return 0;
  if (tv.tasa_valor != null && tv.tasa_valor > 0) return tv.tasa_valor;
  if (tv.tasa_final != null && tv.tasa_final > 0) return tv.tasa_final;
  if (tv.tasa_maxima != null && tv.tasa_maxima > 0) return tv.tasa_maxima;
  return 0;
}

function getRateLevel(rate: number): { label: string; color: string; bgClass: string } {
  if (rate <= 14)
    return { label: "Excelente", color: "hsl(var(--rate-excellent))", bgClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" };
  if (rate <= 16)
    return { label: "Buena", color: "hsl(var(--rate-good))", bgClass: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300" };
  if (rate <= 19)
    return { label: "Promedio", color: "hsl(var(--rate-average))", bgClass: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" };
  return { label: "Alta", color: "hsl(var(--rate-high))", bgClass: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

function formatExtractionDate(fecha?: string): string | null {
  if (!fecha) return null;
  try {
    const date = new Date(fecha + "T00:00:00");
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

export function VehicleCard({
  producto,
  index,
  loanAmount,
  termMonths,
  simulacionResult,
  promedioLote,
  allProducts,
  onToggleComparison,
  isInComparison,
}: VehicleCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const displayRate = getDisplayRate(producto);
  const rateLevel = getRateLevel(displayRate);
  const logo = getBankLogo(producto.entidad);
  const bankColor = getBankColor(producto.entidad.nombre_normalizado);
  const productUrl = producto.url_redireccion || producto.url_extraccion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="h-[300px]"
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 rounded-2xl border border-border bg-card overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${bankColor.primary}, ${bankColor.primary}80, transparent)` }}
          />

          <div className="p-4 h-[calc(100%-4px)] flex flex-col gap-3">

            {/* ── Header ── */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                style={{ backgroundColor: "#0466C818", border: "1.5px solid #0466C825" }}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={producto.entidad.nombre}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = `<span style="font-size:1.25rem;font-weight:700;color:#0466C8">${producto.entidad.nombre.charAt(0)}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-xl font-bold text-[#0466C8]">
                    {producto.entidad.nombre.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm leading-tight truncate">
                  {producto.entidad.nombre}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Crédito de Vehículo</p>
              </div>
              <span className={`shrink-0 text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide ${rateLevel.bgClass}`}>
                {rateLevel.label}
              </span>
            </div>

            {/* ── Tasa + Cuota ── */}
            <div className="rounded-xl p-3.5 bg-[#0466C808] border border-[#0466C818]">
              <div className="flex items-start gap-3">
                {/* Tasa */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                    {producto.tasa_vigente?.es_rango && (producto.tasa_vigente.tasa_minima ?? 0) > 0 ? "Tasa desde" : "Tasa anual"}
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground/50" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{producto.tipo_tasa?.nombre ?? "Tasa efectiva anual"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </p>
                  <p className="text-3xl font-extrabold tracking-tight leading-none" style={{ color: rateLevel.color }}>
                    {producto.tasa_vigente?.es_rango && (producto.tasa_vigente.tasa_minima ?? 0) > 0
                      ? `${producto.tasa_vigente.tasa_minima!.toFixed(2)}%`
                      : `${displayRate.toFixed(2)}%`}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 h-3.5">
                    {producto.tasa_vigente?.es_rango && producto.tasa_vigente.tasa_maxima
                      ? `hasta ${producto.tasa_vigente.tasa_maxima.toFixed(2)}%`
                      : ""}
                  </p>
                </div>

                <div className="w-px self-stretch bg-border/40 shrink-0" />

                {/* Cuota */}
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-[10px] text-muted-foreground mb-1 flex items-center justify-end gap-1">
                    <Calculator className="w-3 h-3" />
                    Cuota /mes
                  </p>
                  <p className="text-3xl font-extrabold leading-none text-[#0466C8]">
                    {simulacionResult
                      ? formatCurrency(simulacionResult.cuota_mensual)
                      : <span className="text-muted-foreground/35 font-normal text-xs">Calculando…</span>
                    }
                  </p>
                  <p className="text-[9px] text-muted-foreground/50 mt-1 h-3.5">
                    {simulacionResult && termMonths >= 12 ? `${Math.floor(termMonths / 12)} años` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Fecha ── */}
            {formatExtractionDate(producto.fecha_extraccion) && (
              <div className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                <span className="text-[9px] text-muted-foreground/50">
                  Actualizado {formatExtractionDate(producto.fecha_extraccion)}
                </span>
              </div>
            )}

            {/* ── Acciones ── */}
            <div className="flex gap-1.5 mt-auto">
              {/* Comparar — pequeño */}
              {onToggleComparison && (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleComparison(); }}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                    isInComparison
                      ? "border-[#0466C8] bg-[#0466C8]/15 text-[#0466C8]"
                      : "border-[#0466C8]/30 bg-[#0466C8]/5 text-[#0466C8]/60 hover:border-[#0466C8] hover:text-[#0466C8]"
                  }`}
                  title={isInComparison ? "Quitar de comparación" : "Agregar a comparación"}
                >
                  <Scale className="w-3.5 h-3.5" />
                </button>
              )}
              {/* Más info — pequeño */}
              <button
                onClick={() => setIsFlipped(true)}
                className="w-9 h-9 rounded-xl border border-[#0466C8]/30 bg-[#0466C8]/5 text-[#0466C8]/60 hover:border-[#0466C8] hover:text-[#0466C8] flex items-center justify-center transition-all"
                title="Más información"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              {/* Plan de pagos — grande */}
              <button
                onClick={(e) => { e.stopPropagation(); setIsSheetOpen(true); }}
                className="flex-1 h-9 rounded-xl bg-[#0466C8] hover:bg-[#0353A4] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-[#0466C8]/25 active:scale-95"
              >
                <Calculator className="w-3.5 h-3.5" />
                Plan de pagos
              </button>
              {/* Solicitar — grande */}
              <button
                onClick={(e) => { e.stopPropagation(); if (productUrl) window.open(productUrl, "_blank", "noopener,noreferrer"); }}
                className="flex-1 h-9 rounded-xl bg-[#0466C8] hover:bg-[#0353A4] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-[#0466C8]/25 active:scale-95"
                title="Ir a página oficial"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Solicitar
              </button>
            </div>

            <SimulationSheet
              producto={producto}
              isOpen={isSheetOpen}
              onClose={() => setIsSheetOpen(false)}
              initialAmount={loanAmount}
              initialTermMonths={termMonths}
              promedioLote={promedioLote}
              bankColor={bankColor}
              onAddToComparison={onToggleComparison}
              isInComparison={isInComparison}
            />
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 rounded-2xl border border-border bg-card overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${bankColor.primary}, ${bankColor.primary}80, transparent)` }}
          />

          <div className="p-5 h-[calc(100%-4px)] flex flex-col overflow-y-auto custom-scrollbar">
            {/* Back header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ backgroundColor: bankColor.bg }}
                >
                  {logo ? (
                    <img src={logo} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <span className="text-sm font-bold" style={{ color: bankColor.primary }}>
                      {producto.entidad.nombre.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground leading-tight">
                    {producto.entidad.nombre}
                  </h4>
                  <p className="text-[10px] text-muted-foreground">Detalles del crédito vehicular</p>
                </div>
              </div>
              <button
                onClick={() => setIsFlipped(false)}
                className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Description */}
            {producto.descripcion && (
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                {producto.descripcion}
              </p>
            )}

            {/* Rate info grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2.5 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground mb-0.5">Tasa</p>
                <p className="text-sm font-bold" style={{ color: rateLevel.color }}>
                  {displayRate.toFixed(2)}%
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground mb-0.5">Denominación</p>
                <p className="text-sm font-semibold text-foreground">Pesos</p>
              </div>
              {producto.tipo_pago && (
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Tipo de pago</p>
                  <p className="text-sm font-semibold text-foreground">{producto.tipo_pago.nombre}</p>
                </div>
              )}
              {producto.tasa_vigente?.tasa_texto_original && (
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Tasa original</p>
                  <p className="text-xs font-medium text-foreground">
                    {producto.tasa_vigente.tasa_texto_original}
                  </p>
                </div>
              )}
            </div>

            {/* Montos & Plazos */}
            {producto.monto && (
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                  Montos y plazos
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {producto.monto.monto_minimo != null && producto.monto.monto_minimo > 0 && (
                    <div className="p-2.5 rounded-lg border border-border">
                      <p className="text-[10px] text-muted-foreground">Monto mín.</p>
                      <p className="text-xs font-semibold text-foreground">{formatCurrency(producto.monto.monto_minimo)}</p>
                    </div>
                  )}
                  {producto.monto.monto_maximo != null && producto.monto.monto_maximo > 0 && (
                    <div className="p-2.5 rounded-lg border border-border">
                      <p className="text-[10px] text-muted-foreground">Monto máx.</p>
                      <p className="text-xs font-semibold text-foreground">{formatCurrency(producto.monto.monto_maximo)}</p>
                    </div>
                  )}
                  {producto.monto.plazo_maximo_meses != null && producto.monto.plazo_maximo_meses > 0 && (
                    <div className="p-2.5 rounded-lg border border-border">
                      <p className="text-[10px] text-muted-foreground">Plazo máx.</p>
                      <p className="text-xs font-semibold text-foreground">
                        {producto.monto.plazo_maximo_meses >= 12
                          ? `${Math.floor(producto.monto.plazo_maximo_meses / 12)} años`
                          : `${producto.monto.plazo_maximo_meses} meses`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Benefits */}
            {(producto.beneficios?.length ?? 0) > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                  Beneficios
                </p>
                <div className="space-y-1.5">
                  {producto.beneficios!.slice(0, 4).map((beneficio, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3 h-3 shrink-0 mt-0.5" style={{ color: bankColor.primary }} />
                      <span className="text-[11px] text-foreground leading-tight">
                        {beneficio.descripcion}
                        {beneficio.valor && <span className="text-muted-foreground"> ({beneficio.valor})</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conditions */}
            {(producto.condiciones?.length ?? 0) > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                  Condiciones
                </p>
                <div className="space-y-1">
                  {producto.condiciones!.sort((a, b) => a.orden - b.orden).slice(0, 3).map((condicion, i) => (
                    <p key={i} className="text-[11px] text-muted-foreground leading-tight flex items-start gap-1.5">
                      <span style={{ color: bankColor.primary }}>-</span>
                      {condicion.condicion}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Back actions */}
            <div className="flex gap-2 mt-auto pt-3 border-t border-border">
              {productUrl && (
                <a
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-9 rounded-xl border border-border text-[11px] font-medium text-foreground bg-card hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3" />
                  Página oficial
                </a>
              )}
              {producto.url_pdf && (
                <a
                  href={producto.url_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-9 rounded-xl border border-border text-[11px] font-medium text-foreground bg-card hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3 h-3" />
                  PDF
                </a>
              )}
              <button
                onClick={() => {
                  if (productUrl) window.open(productUrl, "_blank", "noopener,noreferrer");
                }}
                className="flex-1 h-9 rounded-xl text-[11px] font-semibold text-primary-foreground transition-all flex items-center justify-center gap-1"
                style={{
                  backgroundColor: bankColor.primary,
                  boxShadow: `0 2px 8px ${bankColor.primary}40`,
                }}
              >
                Solicitar
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
