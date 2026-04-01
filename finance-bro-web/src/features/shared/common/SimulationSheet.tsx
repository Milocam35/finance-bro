import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  FileText,
  TrendingDown,
  TrendingUp,
  Scale,
  Loader2,
} from "lucide-react";
import { simulacionQueries } from "@/lib/query-keys";
import type { ProductoCredito } from "@/features/mortgage-loans/types";

interface SimulationSheetProps {
  producto: ProductoCredito;
  isOpen: boolean;
  onClose: () => void;
  initialAmount: number;
  initialTermMonths: number;
  promedioLote?: number;
  bankColor: { primary: string; bg: string };
  onAddToComparison?: () => void;
  isInComparison?: boolean;
}

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

function getRateLevel(rate: number): { label: string; bgClass: string } {
  if (rate <= 12.5) return { label: "Excelente", bgClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" };
  if (rate <= 13.5) return { label: "Buena", bgClass: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300" };
  if (rate <= 14.5) return { label: "Promedio", bgClass: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" };
  return { label: "Alta", bgClass: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" };
}

export function SimulationSheet({
  producto,
  isOpen,
  onClose,
  initialAmount,
  initialTermMonths,
  promedioLote,
  bankColor,
  onAddToComparison,
  isInComparison,
}: SimulationSheetProps) {
  const tv = producto.tasa_vigente;
  const isUVR = producto.denominacion.codigo === "uvr";

  // TEA efectiva del producto (readonly en el sheet)
  const tasaDisplay =
    isUVR && tv?.tasa_final != null && tv.tasa_final > 0
      ? Number(tv.tasa_final)
      : tv?.tasa_valor != null && tv.tasa_valor > 0
      ? Number(tv.tasa_valor)
      : tv?.tasa_final != null
      ? Number(tv.tasa_final)
      : 0;

  // Límites de monto y plazo del producto
  const montoMin = producto.monto?.monto_minimo
    ? Math.max(Number(producto.monto.monto_minimo), 1_000_000)
    : 1_000_000;
  const montoMax = producto.monto?.monto_maximo
    ? Number(producto.monto.monto_maximo)
    : 2_000_000_000;
  const plazoMaxMeses = producto.monto?.plazo_maximo_meses
    ? Number(producto.monto.plazo_maximo_meses)
    : 360;

  // Estado local de inputs del simulador
  const [amount, setAmount] = useState(() =>
    Math.min(Math.max(initialAmount, montoMin), montoMax)
  );
  const [termMonths, setTermMonths] = useState(() =>
    Math.min(Math.max(initialTermMonths, 1), plazoMaxMeses)
  );

  // Query reactiva — se re-fetcha automáticamente al cambiar amount/termMonths/tasaDisplay
  const { data: resultado, isFetching } = useQuery(
    simulacionQueries.single(amount, termMonths, tasaDisplay)
  );

  const rateLevel = getRateLevel(tasaDisplay);
  const productUrl = producto.url_redireccion || producto.url_extraccion;

  // Ahorro vs promedio del lote
  const ahorro =
    resultado && promedioLote ? promedioLote - resultado.cuota_mensual : null;
  const isBarato = ahorro !== null && ahorro > 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] overflow-y-auto flex flex-col gap-0 p-0"
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full shrink-0"
          style={{
            background: `linear-gradient(90deg, ${bankColor.primary}, ${bankColor.primary}80, transparent)`,
          }}
        />

        <div className="flex flex-col gap-5 p-6 flex-1">
          {/* Header */}
          <SheetHeader className="p-0">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: bankColor.bg, color: bankColor.primary }}
              >
                {producto.entidad.nombre.charAt(0)}
              </div>
              <div>
                <SheetTitle className="text-base leading-tight">
                  {producto.entidad.nombre}
                </SheetTitle>
                <p className="text-[11px] text-muted-foreground">
                  Simula tu crédito
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Tasa readonly */}
          <div className="rounded-xl p-4 border border-border bg-muted/30">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              Tasa efectiva anual
            </p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-extrabold" style={{ color: bankColor.primary }}>
                {tasaDisplay > 0 ? `${tasaDisplay.toFixed(2)}%` : "—"}
              </p>
              {tasaDisplay > 0 && (
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${rateLevel.bgClass}`}>
                  {rateLevel.label}
                </span>
              )}
            </div>
            {tv?.tasa_texto_original && (
              <p className="text-[11px] text-muted-foreground mt-1">
                {tv.tasa_texto_original}
              </p>
            )}
          </div>

          <Separator />

          {/* Monto slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Monto del crédito</p>
              <p className="text-sm font-bold text-foreground">{formatCOP(amount)}</p>
            </div>
            <Slider
              min={montoMin}
              max={montoMax}
              step={Math.max(1_000_000, Math.round((montoMax - montoMin) / 200))}
              value={[amount]}
              onValueChange={([v]) => setAmount(v)}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{formatCOP(montoMin)}</span>
              <span>{formatCOP(montoMax)}</span>
            </div>
          </div>

          {/* Plazo slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Plazo</p>
              <p className="text-sm font-bold text-foreground">
                {termMonths} meses
                {termMonths >= 12 && (
                  <span className="text-muted-foreground font-normal ml-1">
                    ({Math.floor(termMonths / 12)} años
                    {termMonths % 12 > 0 ? ` ${termMonths % 12}m` : ""})
                  </span>
                )}
              </p>
            </div>
            <Slider
              min={1}
              max={plazoMaxMeses}
              step={1}
              value={[termMonths]}
              onValueChange={([v]) => setTermMonths(v)}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1 mes</span>
              <span>{Math.floor(plazoMaxMeses / 12)} años</span>
            </div>
          </div>

          <Separator />

          {/* Resultados */}
          {tasaDisplay === 0 ? (
            <div className="rounded-xl p-4 bg-muted/30 text-center">
              <p className="text-sm text-muted-foreground">
                Tasa no disponible para este producto.
              </p>
            </div>
          ) : isFetching || !resultado ? (
            <div className="rounded-xl p-6 bg-muted/30 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Calculando...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Cuota principal */}
              <div
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: bankColor.bg }}
              >
                <p className="text-[11px] text-muted-foreground mb-1">
                  Cuota mensual estimada
                </p>
                <p
                  className="text-3xl font-extrabold tracking-tight"
                  style={{ color: bankColor.primary }}
                >
                  {formatCOP(resultado.cuota_mensual)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">por mes</p>
              </div>

              {/* Métricas secundarias */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg p-3 bg-muted/40">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Total a pagar</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCOP(resultado.total_pago)}
                  </p>
                </div>
                <div className="rounded-lg p-3 bg-muted/40">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Total en intereses</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCOP(resultado.total_intereses)}
                  </p>
                </div>
              </div>

              {/* Ahorro vs promedio */}
              {ahorro !== null && Math.abs(ahorro) > 0 && (
                <div
                  className={`rounded-lg p-3 flex items-center gap-2 ${
                    isBarato
                      ? "bg-emerald-50 dark:bg-emerald-950/40"
                      : "bg-orange-50 dark:bg-orange-950/40"
                  }`}
                >
                  {isBarato ? (
                    <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
                  )}
                  <div>
                    <p
                      className={`text-[11px] font-semibold ${
                        isBarato
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {isBarato ? "Más barato" : "Más caro"} que el promedio
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {isBarato ? "-" : "+"}
                      {formatCOP(Math.abs(ahorro))} / mes vs. promedio de{" "}
                      {formatCOP(promedioLote!)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botón comparar */}
          {onAddToComparison && (
            <Button
              variant="outline"
              className={`w-full gap-2 ${
                isInComparison
                  ? "border-[#FFC300] bg-[#FFC300]/10 text-[#FFC300] hover:bg-[#FFC300]/20"
                  : "hover:border-[#FFC300]/50 hover:text-[#FFC300]"
              }`}
              onClick={onAddToComparison}
            >
              <Scale className="w-4 h-4" />
              {isInComparison ? "Quitar de comparación" : "Agregar a comparación"}
            </Button>
          )}

          {/* Acciones */}
          <div className="flex gap-2 mt-auto pt-2">
            {productUrl && (
              <a
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-10 rounded-xl border border-border text-sm font-medium text-foreground bg-card hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Solicitar
              </a>
            )}
            {producto.url_pdf && (
              <a
                href={producto.url_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-10 rounded-xl border border-border text-sm font-medium text-foreground bg-card hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                PDF
              </a>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
