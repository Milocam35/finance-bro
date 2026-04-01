import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, ChevronRight, Trash2 } from "lucide-react";
import type { ProductoCredito } from "@/features/mortgage-loans/types";

interface ComparisonFloatingBarProps {
  selectedProducts: ProductoCredito[];
  onOpenDialog: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
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

export function ComparisonFloatingBar({
  selectedProducts,
  onOpenDialog,
  onRemove,
  onClearAll,
}: ComparisonFloatingBarProps) {
  return (
    <AnimatePresence>
      {selectedProducts.length >= 2 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border"
          style={{
            background: "hsl(var(--card))",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
          }}
        >
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            {/* Ícono */}
            <Scale className="w-4 h-4 text-[#0466C8] shrink-0" />

            {/* Chips de productos seleccionados */}
            <div className="flex items-center gap-2 flex-1 overflow-x-auto">
              {selectedProducts.map((p) => {
                const logo = getLogo(p.entidad);
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-[#0466C8]/30 bg-[#0466C8]/5 shrink-0"
                  >
                    {logo ? (
                      <img src={logo} alt="" className="w-4 h-4 object-contain rounded-sm" />
                    ) : (
                      <span className="w-4 h-4 rounded-sm bg-muted flex items-center justify-center text-[9px] font-bold text-foreground">
                        {p.entidad.nombre.charAt(0)}
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-foreground max-w-[80px] truncate">
                      {p.entidad.nombre}
                    </span>
                    <button
                      onClick={() => onRemove(p.id)}
                      className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {/* Slot vacío cuando hay menos de 4 */}
              {selectedProducts.length < 4 && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-dashed border-border shrink-0">
                  <span className="text-[11px] text-muted-foreground">
                    + Agrega otro
                  </span>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onClearAll}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Limpiar todos"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenDialog}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0466C8] hover:bg-[#0353A4] text-white text-sm font-semibold transition-colors"
              >
                Comparar {selectedProducts.length}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
