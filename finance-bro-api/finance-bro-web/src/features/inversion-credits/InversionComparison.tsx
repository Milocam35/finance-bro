import { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, ArrowUpDown, AlertCircle, RefreshCw, SearchX, TrendingDown, ShieldCheck, BarChart3, Building2 } from "lucide-react";
import { InversionCard } from "./InversionCard";
import { InversionFilters, InversionFilterState } from "./InversionFilters";
import { useProductosInversion } from "./useProductosInversion";
import { Button } from "@/components/ui/button";
import type { ProductoCredito } from "@/features/mortgage-loans/types";

function getSortRate(producto: ProductoCredito): number {
  const tv = producto.tasa_vigente;
  if (!tv) return Infinity;
  if (tv.tasa_valor != null && tv.tasa_valor > 0) return tv.tasa_valor;
  return Infinity;
}

const floatingParticles = [
  { size: 3, x: "8%", y: "25%", duration: 9, delay: 0 },
  { size: 5, x: "82%", y: "18%", duration: 11, delay: 1.2 },
  { size: 2, x: "65%", y: "65%", duration: 7, delay: 2.5 },
  { size: 4, x: "22%", y: "72%", duration: 10, delay: 0.8 },
  { size: 3, x: "92%", y: "55%", duration: 8, delay: 3 },
  { size: 4, x: "45%", y: "12%", duration: 12, delay: 1.5 },
];

export function InversionComparison() {
  const { data: productos, isLoading, isError, error, refetch } = useProductosInversion();

  const [filters, setFilters] = useState<InversionFilterState>({
    amount: 10000000,
    term: 1,
    sortBy: "rate",
  });

  const filteredProductos = (productos ?? []).filter((producto) => {
    if (filters.term && producto.monto?.plazo_maximo_meses) {
      const plazoMeses = filters.term * 12;
      if (plazoMeses > producto.monto.plazo_maximo_meses) {
        return false;
      }
    }
    return true;
  });

  const sortedProductos = [...filteredProductos].sort((a, b) => {
    switch (filters.sortBy) {
      case "rate":
        return getSortRate(a) - getSortRate(b);
      default:
        return 0;
    }
  });

  const productCount = productos?.length ?? 0;

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 lg:pt-28 lg:pb-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(145deg,
              hsl(var(--foreground)) 0%,
              hsl(25 70% 12%) 35%,
              hsl(22 65% 18%) 65%,
              hsl(25 70% 14%) 100%)`,
          }}
        />

        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: `radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-48 -left-24 w-[600px] h-[600px] rounded-full opacity-[0.05]"
            style={{ background: `radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)` }}
          />
        </div>

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {floatingParticles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.x,
              top: particle.y,
              backgroundColor: `hsl(var(--primary-foreground) / 0.25)`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.4, 0.15] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center py-12 lg:py-16 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium mb-8 border"
                style={{
                  backgroundColor: `hsl(var(--primary-foreground) / 0.08)`,
                  borderColor: `hsl(var(--primary-foreground) / 0.15)`,
                  color: `hsl(var(--primary-foreground) / 0.9)`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Banknote className="w-4 h-4" />
                Libre Inversión
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: `hsl(var(--accent))` }}
                />
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight mb-6"
              style={{ color: `hsl(var(--primary-foreground))` }}
            >
              Crédito de{" "}
              <br className="hidden sm:block" />
              <span
                className="relative inline-block"
                style={{ color: `hsl(var(--accent))` }}
              >
                Libre Inversión
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.3) 100%)`,
                  }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{ color: `hsl(var(--primary-foreground) / 0.65)` }}
            >
              Compara tasas de crédito de libre inversión de los principales bancos colombianos.
              <br className="hidden md:block" />
              Úsalo para lo que necesites: viajes, remodelaciones, deudas y más.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
            >
              {[
                { icon: BarChart3, value: productCount > 0 ? `${productCount}+` : "—", label: "Productos" },
                { icon: Building2, value: "10+", label: "Entidades" },
                { icon: TrendingDown, value: "Tiempo real", label: "Actualización" },
                { icon: ShieldCheck, value: "100%", label: "Transparente" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.08 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border"
                  style={{
                    backgroundColor: `hsl(var(--primary-foreground) / 0.04)`,
                    borderColor: `hsl(var(--primary-foreground) / 0.08)`,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <stat.icon className="w-4 h-4 shrink-0" style={{ color: `hsl(var(--accent) / 0.8)` }} />
                  <div className="text-left">
                    <p className="text-sm font-bold leading-tight" style={{ color: `hsl(var(--primary-foreground) / 0.95)` }}>
                      {stat.value}
                    </p>
                    <p className="text-[11px] leading-tight" style={{ color: `hsl(var(--primary-foreground) / 0.45)` }}>
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: '60px' }}>
            <path d="M0 100L48 93.3C96 86.7 192 73.3 288 66.7C384 60 480 60 576 63.3C672 66.7 768 73.3 864 76.7C960 80 1056 80 1152 76.7C1248 73.3 1344 66.7 1392 63.3L1440 60V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* FILTERS & RESULTS */}
      <section className="relative pt-8 pb-16 lg:pb-24">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 0.5px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-10">
            <InversionFilters onFilterChange={setFilters} />
          </div>

          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-muted" />
                    <div className="flex-1">
                      <div className="h-5 bg-muted rounded w-32 mb-2" />
                      <div className="h-3 bg-muted rounded w-24" />
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-muted rounded w-16" />
                    <div className="h-6 bg-muted rounded w-20" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                    <div><div className="h-3 bg-muted rounded w-16 mb-2" /><div className="h-8 bg-muted rounded w-20" /></div>
                    <div><div className="h-3 bg-muted rounded w-16 mb-2" /><div className="h-8 bg-muted rounded w-20" /></div>
                    <div><div className="h-3 bg-muted rounded w-16 mb-2" /><div className="h-8 bg-muted rounded w-20" /></div>
                  </div>
                  <div className="space-y-3 py-4">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <div className="h-10 bg-muted rounded flex-1" />
                    <div className="h-10 bg-muted rounded flex-1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Error al cargar los productos
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {error instanceof Error
                  ? error.message
                  : "No se pudieron cargar los créditos de libre inversión. Verifica que el servidor esté funcionando."}
              </p>
              <Button onClick={() => refetch()} className="bg-secondary hover:bg-primary text-primary-foreground">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{sortedProductos.length}</span> opciones encontradas
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowUpDown className="w-4 h-4" />
                  Ordenado por: <span className="font-medium text-foreground">
                    {filters.sortBy === "rate" && "Menor tasa"}
                    {filters.sortBy === "payment" && "Menor mensualidad"}
                  </span>
                </div>
              </div>

              {sortedProductos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <SearchX className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    No hay créditos de libre inversión que coincidan con los filtros seleccionados.
                    Intenta ajustar el plazo o el monto para ver más opciones.
                  </p>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedProductos.map((producto, index) => (
                  <InversionCard
                    key={producto.id}
                    producto={producto}
                    index={index}
                    loanAmount={filters.amount}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
