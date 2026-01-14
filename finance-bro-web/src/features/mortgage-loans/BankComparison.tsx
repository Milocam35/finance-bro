import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ArrowUpDown } from "lucide-react";
import { BankCard, BankData } from "./BankCard";
import { CreditFilters, FilterState } from "./CreditFilters";

const banksData: BankData[] = [
  {
    id: "1",
    name: "Bancolombia",
    logo: "",
    rate: 12.49,
    cat: 14.8,
    monthlyPayment: 4850000,
    minDownPayment: 20,
    maxTerm: 20,
    rating: 4.5,
    features: ["Tasa fija", "Sin comisión apertura", "Pagos anticipados sin penalización"],
    highlight: "⭐ Mejor tasa del mercado",
    processingTime: "15-20 días",
  },
  {
    id: "2",
    name: "Davivienda",
    logo: "",
    rate: 12.99,
    cat: 15.3,
    monthlyPayment: 4920000,
    minDownPayment: 20,
    maxTerm: 20,
    rating: 4.4,
    features: ["Tasa fija", "Programa de lealtad", "Seguros incluidos"],
    processingTime: "12-18 días",
  },
  {
    id: "3",
    name: "Banco de Bogotá",
    logo: "",
    rate: 13.25,
    cat: 15.7,
    monthlyPayment: 4985000,
    minDownPayment: 20,
    maxTerm: 20,
    rating: 4.3,
    features: ["Tasa fija", "Bonificación por domiciliación", "App móvil completa"],
    processingTime: "10-15 días",
  },
  {
    id: "4",
    name: "BBVA Colombia",
    logo: "",
    rate: 13.50,
    cat: 16.0,
    monthlyPayment: 5045000,
    minDownPayment: 20,
    maxTerm: 25,
    rating: 4.2,
    features: ["Tasa mixta disponible", "Plazos flexibles", "Servicio premier"],
    highlight: "🏆 Mayor plazo disponible",
    processingTime: "18-25 días",
  },
  {
    id: "5",
    name: "Banco Popular",
    logo: "",
    rate: 13.75,
    cat: 16.3,
    monthlyPayment: 5095000,
    minDownPayment: 25,
    maxTerm: 20,
    rating: 4.1,
    features: ["Tasa fija", "Puntos de fidelidad", "Atención personalizada"],
    processingTime: "15-22 días",
  },
  {
    id: "6",
    name: "Scotiabank Colpatria",
    logo: "",
    rate: 14.20,
    cat: 16.8,
    monthlyPayment: 5185000,
    minDownPayment: 20,
    maxTerm: 20,
    rating: 4.0,
    features: ["Tasa fija", "Crédito constructor", "Financiamiento gastos notariales"],
    processingTime: "12-20 días",
  },
];

export function BankComparison() {
  const [filters, setFilters] = useState<FilterState>({
    amount: 200000000,
    term: 20,
    propertyType: "all",
    sortBy: "rate",
  });

  const sortedBanks = [...banksData].sort((a, b) => {
    switch (filters.sortBy) {
      case "rate":
        return a.rate - b.rate;
      case "payment":
        return a.monthlyPayment - b.monthlyPayment;
      case "cat":
        return a.cat - b.cat;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <>
      {/* Header Section with Blue Background and Waves */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-[#001233]">
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
              Créditos Hipotecarios
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
              <span className="font-semibold text-foreground">{sortedBanks.length}</span> opciones encontradas
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
            {sortedBanks.map((bank, index) => (
              <BankCard
                key={bank.id}
                bank={bank}
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
