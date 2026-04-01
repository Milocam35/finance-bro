import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingDown, ExternalLink, X } from "lucide-react";
import type { ProductoCredito } from "@/features/mortgage-loans/types";
import type { ResultadoLoteItem } from "@/lib/query-keys";

interface ComparisonDialogProps {
  productos: ProductoCredito[];
  isOpen: boolean;
  onClose: () => void;
  loanAmount: number;
  termMonths: number;
  simMap: Map<string, ResultadoLoteItem>;
  promedioLote?: number;
  onRemove: (id: string) => void;
}

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

function getRateLevel(rate: number) {
  if (rate <= 12.5) return { label: "Excelente", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" };
  if (rate <= 13.5) return { label: "Buena", cls: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300" };
  if (rate <= 14.5) return { label: "Promedio", cls: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" };
  return { label: "Alta", cls: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" };
}

const BANK_LOGOS: Record<string, string> = {
  bancolombia: "/images/banks/bancolombia.png",
  davivienda: "/images/banks/davivienda.png",
  bbva: "/images/banks/bbva.png",
  scotiabank: "/images/banks/davibank.jpg",
  colpatria: "/images/banks/davibank.jpg",
  itau: "/images/banks/itau.png",
  "itaú": "/images/banks/itau.png",
  lulo: "/images/banks/lulobank.png",
  "lulo bank": "/images/banks/lulobank.png",
  lulobank: "/images/banks/lulobank.png",
  nu: "/images/banks/nu.svg",
  "nu colombia": "/images/banks/nu.svg",
  credifamilia: "/images/banks/credifamilia.png",
  koa: "/images/banks/koa.png",
  iris: "/images/banks/iris.png",
};

function getLogo(entidad: { nombre_normalizado: string; logo_url?: string | null }): string | null {
  if (entidad.logo_url) return entidad.logo_url;
  const norm = entidad.nombre_normalizado.toLowerCase();
  if (BANK_LOGOS[norm]) return BANK_LOGOS[norm];
  for (const [key, path] of Object.entries(BANK_LOGOS)) {
    if (norm.includes(key) || key.includes(norm)) return path;
  }
  return null;
}

export function ComparisonDialog({
  productos,
  isOpen,
  onClose,
  loanAmount,
  termMonths,
  simMap,
  promedioLote,
  onRemove,
}: ComparisonDialogProps) {
  if (productos.length === 0) return null;

  // Calcular cuotas para destacar la mejor
  const cuotas = productos.map((p) => simMap.get(p.id)?.cuota_mensual ?? Infinity);
  const minCuota = Math.min(...cuotas);

  const rows: { label: string; getValue: (p: ProductoCredito, i: number) => React.ReactNode }[] = [
    {
      label: "Tasa anual",
      getValue: (p) => {
        const tv = p.tasa_vigente;
        const isUVR = p.denominacion.codigo === "uvr";
        const rate = isUVR && tv?.tasa_final ? Number(tv.tasa_final) : Number(tv?.tasa_valor ?? 0);
        const rl = getRateLevel(rate);
        return (
          <div>
            <span className="font-bold">{rate > 0 ? `${rate.toFixed(2)}%` : "—"}</span>
            {rate > 0 && (
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${rl.cls}`}>
                {rl.label}
              </span>
            )}
          </div>
        );
      },
    },
    {
      label: "Cuota mensual",
      getValue: (p, i) => {
        const r = simMap.get(p.id);
        if (!r) return <span className="text-muted-foreground text-xs">—</span>;
        const isBest = r.cuota_mensual === minCuota;
        return (
          <div className="flex items-center gap-1">
            <span className={`font-bold text-sm ${isBest ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
              {formatCOP(r.cuota_mensual)}
            </span>
            {isBest && <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />}
          </div>
        );
      },
    },
    {
      label: "Total a pagar",
      getValue: (p) => {
        const r = simMap.get(p.id);
        return r ? <span className="text-sm">{formatCOP(r.total_pago)}</span> : "—";
      },
    },
    {
      label: "Total intereses",
      getValue: (p) => {
        const r = simMap.get(p.id);
        return r ? <span className="text-sm">{formatCOP(r.total_intereses)}</span> : "—";
      },
    },
    {
      label: "Denominación",
      getValue: (p) => (
        <span className="text-sm capitalize">{p.denominacion.nombre}</span>
      ),
    },
    {
      label: "Plazo máx.",
      getValue: (p) => {
        const m = p.monto?.plazo_maximo_meses;
        return m ? <span className="text-sm">{Math.floor(Number(m) / 12)} años</span> : "—";
      },
    },
    {
      label: "Monto máx.",
      getValue: (p) => {
        const m = p.monto?.monto_maximo;
        return m ? <span className="text-sm">{formatCOP(Number(m))}</span> : "—";
      },
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Comparando {productos.length} productos
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {formatCOP(loanAmount)} · {termMonths} meses ({Math.floor(termMonths / 12)} años)
          </p>
        </DialogHeader>

        <Separator />

        {/* Tabla de comparación */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {/* Columna de etiquetas */}
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium text-xs w-32 align-bottom">
                  &nbsp;
                </th>
                {/* Columna por producto */}
                {productos.map((p) => {
                  const logo = getLogo(p.entidad);
                  return (
                    <th key={p.id} className="text-center pb-3 px-3 min-w-[140px]">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="relative">
                          {logo ? (
                            <img
                              src={logo}
                              alt={p.entidad.nombre}
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-base font-bold">
                              {p.entidad.nombre.charAt(0)}
                            </div>
                          )}
                          <button
                            onClick={() => onRemove(p.id)}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                          >
                            <X className="w-2.5 h-2.5 text-muted-foreground" />
                          </button>
                        </div>
                        <span className="text-xs font-semibold text-foreground text-center leading-tight">
                          {p.entidad.nombre}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={row.label}
                  className={ri % 2 === 0 ? "bg-muted/20" : ""}
                >
                  <td className="py-2.5 pr-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {row.label}
                  </td>
                  {productos.map((p, pi) => {
                    const r = simMap.get(p.id);
                    const isBestCuota =
                      row.label === "Cuota mensual" &&
                      r?.cuota_mensual === minCuota;
                    return (
                      <td
                        key={p.id}
                        className={`py-2.5 px-3 text-center ${
                          isBestCuota ? "bg-emerald-50/60 dark:bg-emerald-950/20 rounded-lg" : ""
                        }`}
                      >
                        {row.getValue(p, pi)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Separator />

        {/* Botones de solicitar */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          <div className="w-32 shrink-0" />
          {productos.map((p) => {
            const url = p.url_redireccion || p.url_extraccion;
            return (
              <div key={p.id} className="flex-1 min-w-[140px] flex justify-center">
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-[#0466C8] hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Solicitar
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
