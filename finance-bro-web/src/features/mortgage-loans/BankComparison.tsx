import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ArrowUpDown, AlertCircle, RefreshCw, SearchX, TrendingDown, ShieldCheck, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BankCard } from "./BankCard";
import { CreditFilters, FilterState } from "./CreditFilters";
import { useProductosHipotecarios } from "./useProductosHipotecarios";
import { ComparisonFloatingBar } from "@/features/shared/common/ComparisonFloatingBar";
import { ComparisonDialog } from "@/features/shared/common/ComparisonDialog";
import { simulacionQueries } from "@/lib/query-keys";
import { Button } from "@/components/ui/button";
import type { ProductoCredito } from "./types";

/** Obtiene la tasa comparable para ordenamiento */
function getSortRate(producto: ProductoCredito): number {
  const tv = producto.tasa_vigente;
  if (!tv) return Infinity;
  const isUVR = producto.denominacion.codigo === "uvr";
  if (isUVR && tv.tasa_final != null && tv.tasa_final > 0) return tv.tasa_final;
  if (tv.tasa_valor != null && tv.tasa_valor > 0) return tv.tasa_valor;
  if (tv.tasa_final != null && tv.tasa_final > 0) return tv.tasa_final;
  return Infinity;
}

// Floating particles for atmospheric depth
const floatingParticles = [
  { size: 3, x: "8%", y: "25%", duration: 9, delay: 0 },
  { size: 5, x: "82%", y: "18%", duration: 11, delay: 1.2 },
  { size: 2, x: "65%", y: "65%", duration: 7, delay: 2.5 },
  { size: 4, x: "22%", y: "72%", duration: 10, delay: 0.8 },
  { size: 3, x: "92%", y: "55%", duration: 8, delay: 3 },
  { size: 4, x: "45%", y: "12%", duration: 12, delay: 1.5 },
];

export function BankComparison() {
  const { data: productos, isLoading, isError, error, refetch } = useProductosHipotecarios();

  const [filters, setFilters] = useState<FilterState>({
    amount: 200000000,
    term: 20,
    propertyType: "all",
    housingType: "vis",
    denomination: "all",
    sortBy: "rate",
  });

  // Estado de comparación
  const [selectedForComparison, setSelectedForComparison] = useState<ProductoCredito[]>([]);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);

  const toggleComparison = (producto: ProductoCredito) => {
    setSelectedForComparison((prev) => {
      if (prev.find((p) => p.id === producto.id)) return prev.filter((p) => p.id !== producto.id);
      if (prev.length >= 4) return prev;
      return [...prev, producto];
    });
  };

  // Batch query de simulaciones para todos los productos cargados
  const productoIds = (productos ?? []).map((p) => p.id);
  const { data: simulaciones } = useQuery(
    simulacionQueries.lote(filters.amount, filters.term * 12, productoIds)
  );
  const simMap = new Map(
    simulaciones?.resultados.map((r) => [r.producto_id, r]) ?? []
  );

  // Filtrar productos según los filtros activos
  const filteredProductos = (productos ?? []).filter((producto) => {
    if (filters.housingType && filters.housingType !== "all") {
      if (producto.tipo_vivienda?.codigo === "aplica_ambos") {
        // Si el producto aplica para ambos, siempre se muestra
      } else if (producto.tipo_vivienda?.codigo !== filters.housingType) {
        return false;
      }
    }

    if (filters.denomination && filters.denomination !== "all") {
      if (producto.denominacion?.codigo !== filters.denomination) {
        return false;
      }
    }

    // Filtrar por plazo: solo mostrar productos que acepten el plazo seleccionado
    if (filters.term && producto.monto?.plazo_maximo_meses) {
      const plazoMeses = filters.term * 12;
      if (plazoMeses > producto.monto.plazo_maximo_meses) {
        return false;
      }
    }

    return true;
  });

  // Ordenar productos filtrados
  const sortedProductos = [...filteredProductos].sort((a, b) => {
    switch (filters.sortBy) {
      case "rate":
        return getSortRate(a) - getSortRate(b);
      case "payment":
        return (simMap.get(a.id)?.cuota_mensual ?? Infinity) - (simMap.get(b.id)?.cuota_mensual ?? Infinity);
      case "cat":
        return 0;
      case "rating":
        return 0;
      default:
        return 0;
    }
  });

  const productCount = productos?.length ?? 0;

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Refined Fintech Authority               */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-20 lg:pt-28 lg:pb-28 overflow-hidden">
        {/* === BACKGROUND LAYERS === */}

        {/* L1: Deep base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(145deg,
              hsl(var(--foreground)) 0%,
              hsl(213 97% 12%) 35%,
              hsl(212 95% 18%) 65%,
              hsl(213 97% 14%) 100%)`,
          }}
        />

        {/* L2: Mesh gradient orbs for depth */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary accent orb — top right */}
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{
              background: `radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)`,
            }}
          />
          {/* Accent gold orb — bottom left */}
          <div
            className="absolute -bottom-48 -left-24 w-[600px] h-[600px] rounded-full opacity-[0.05]"
            style={{
              background: `radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)`,
            }}
          />
          {/* Secondary blue orb — center */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
            style={{
              background: `radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 60%)`,
            }}
          />
        </div>

        {/* L3: Geometric grid overlay */}
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

        {/* L4: Diagonal accent line */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 120px,
              hsl(var(--primary-foreground)) 120px,
              hsl(var(--primary-foreground)) 121px
            )`,
          }}
        />

        {/* L5: Floating particles */}
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
            animate={{
              y: [0, -20, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}

        {/* L6: Floating geometric accents */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[12%] w-14 h-14 rounded-xl border opacity-20 hidden lg:block"
          style={{
            borderColor: `hsl(var(--secondary) / 0.3)`,
            backgroundColor: `hsl(var(--secondary) / 0.05)`,
          }}
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-[30%] left-[6%] w-10 h-10 rounded-full border opacity-15 hidden lg:block"
          style={{
            borderColor: `hsl(var(--accent) / 0.3)`,
            backgroundColor: `hsl(var(--accent) / 0.05)`,
          }}
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute top-[35%] left-[15%] w-6 h-6 rounded-md border opacity-10 hidden lg:block"
          style={{
            borderColor: `hsl(var(--primary-foreground) / 0.2)`,
            backgroundColor: `hsl(var(--primary-foreground) / 0.03)`,
          }}
        />

        {/* === CONTENT === */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center py-12 lg:py-16 max-w-4xl mx-auto">
            {/* Pill badge */}
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
                <Building2 className="w-4 h-4" />
                Créditos Hipotecarios
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: `hsl(var(--accent))` }}
                />
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight mb-6"
              style={{ color: `hsl(var(--primary-foreground))` }}
            >
              Crédito Hipotecario {" "}
              <br className="hidden sm:block" />
              <span
                className="relative inline-block"
                style={{ color: `hsl(var(--accent))` }}
              >
                De Vivienda
                {/* Underline accent */}
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

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{ color: `hsl(var(--primary-foreground) / 0.65)` }}
            >
              Tasas actualizadas de los principales bancos colombianos.
              <br className="hidden md:block" />
              Información transparente para que tomes la mejor decisión.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
            >
              {[
                {
                  icon: BarChart3,
                  value: productCount > 0 ? `${productCount}+` : "50+",
                  label: "Productos",
                },
                {
                  icon: Building2,
                  value: "20+",
                  label: "Entidades",
                },
                {
                  icon: TrendingDown,
                  value: "Tiempo real",
                  label: "Actualización",
                },
                {
                  icon: ShieldCheck,
                  value: "100%",
                  label: "Transparente",
                },
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
                  <stat.icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: `hsl(var(--accent) / 0.8)` }}
                  />
                  <div className="text-left">
                    <p
                      className="text-sm font-bold leading-tight"
                      style={{ color: `hsl(var(--primary-foreground) / 0.95)` }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-[11px] leading-tight"
                      style={{ color: `hsl(var(--primary-foreground) / 0.45)` }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom wave transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full block"
            preserveAspectRatio="none"
            style={{ height: '60px' }}
          >
            <path
              d="M0 100L48 93.3C96 86.7 192 73.3 288 66.7C384 60 480 60 576 63.3C672 66.7 768 73.3 864 76.7C960 80 1056 80 1152 76.7C1248 73.3 1344 66.7 1392 63.3L1440 60V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FILTERS & RESULTS SECTION                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-16 lg:pb-24">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 0.5px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          {/* Filters */}
          <div className="mb-10">
            <CreditFilters onFilterChange={setFilters} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl border border-border p-6 animate-pulse"
                >
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
                    <div>
                      <div className="h-3 bg-muted rounded w-16 mb-2" />
                      <div className="h-8 bg-muted rounded w-20" />
                    </div>
                    <div>
                      <div className="h-3 bg-muted rounded w-16 mb-2" />
                      <div className="h-8 bg-muted rounded w-20" />
                    </div>
                    <div>
                      <div className="h-3 bg-muted rounded w-16 mb-2" />
                      <div className="h-8 bg-muted rounded w-20" />
                    </div>
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

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Error al cargar los productos
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {error instanceof Error
                  ? error.message
                  : "No se pudieron cargar los productos hipotecarios. Verifica que el servidor esté funcionando."}
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-secondary hover:bg-primary text-primary-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          )}

          {/* Data loaded */}
          {!isLoading && !isError && (
            <>
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

              {/* Empty State */}
              {sortedProductos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <SearchX className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    No hay productos hipotecarios que coincidan con los filtros seleccionados.
                    Intenta ajustar los filtros para ver más opciones.
                  </p>
                </div>
              )}

              {/* Bank Cards Grid */}
              <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${selectedForComparison.length >= 2 ? "pb-20" : ""}`}>
                {sortedProductos.map((producto, index) => (
                  <BankCard
                    key={producto.id}
                    producto={producto}
                    index={index}
                    loanAmount={filters.amount}
                    termMonths={filters.term * 12}
                    simulacionResult={simMap.get(producto.id)}
                    promedioLote={simulaciones?.promedio_cuota_mensual}
                    allProducts={sortedProductos}
                    onToggleComparison={() => toggleComparison(producto)}
                    isInComparison={!!selectedForComparison.find((p) => p.id === producto.id)}
                  />
                ))}
              </div>

              {/* Panel flotante de comparación */}
              <ComparisonFloatingBar
                selectedProducts={selectedForComparison}
                onOpenDialog={() => setIsComparisonDialogOpen(true)}
                onRemove={(id) => setSelectedForComparison((prev) => prev.filter((p) => p.id !== id))}
                onClearAll={() => setSelectedForComparison([])}
              />

              {/* Dialog de comparación */}
              <ComparisonDialog
                productos={selectedForComparison}
                isOpen={isComparisonDialogOpen}
                onClose={() => setIsComparisonDialogOpen(false)}
                loanAmount={filters.amount}
                termMonths={filters.term * 12}
                simMap={simMap}
                promedioLote={simulaciones?.promedio_cuota_mensual}
                onRemove={(id) => setSelectedForComparison((prev) => prev.filter((p) => p.id !== id))}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
