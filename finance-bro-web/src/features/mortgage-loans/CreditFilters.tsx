import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, DollarSign, Calendar, Percent } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreditFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  amount: number;
  term: number;
  propertyType: string;
  sortBy: string;
}

export function CreditFilters({ onFilterChange }: CreditFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    amount: 200000000,
    term: 20,
    propertyType: "all",
    sortBy: "rate",
  });

  const handleChange = (key: keyof FilterState, value: number | string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl p-6 lg:p-8 card-elevated border border-border"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#0466C8]/10 flex items-center justify-center">
          <SlidersHorizontal className="w-5 h-5 text-[#0466C8]" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Personaliza tu búsqueda</h3>
          <p className="text-sm text-muted-foreground">
            Ajusta los filtros para encontrar el crédito ideal
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Amount Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Monto del crédito
            </label>
            <span className="text-sm font-semibold text-[#0466C8]">
              {formatCurrency(filters.amount)}
            </span>
          </div>
          <Slider
            value={[filters.amount]}
            onValueChange={([value]) => handleChange("amount", value)}
            min={50000000}
            max={1000000000}
            step={10000000}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$50M</span>
            <span>$1.000M</span>
          </div>
        </div>

        {/* Term Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Plazo (años)
            </label>
            <span className="text-sm font-semibold text-[#0466C8]">
              {filters.term} años
            </span>
          </div>
          <Slider
            value={[filters.term]}
            onValueChange={([value]) => handleChange("term", value)}
            min={5}
            max={30}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 años</span>
            <span>30 años</span>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Percent className="w-4 h-4 text-muted-foreground" />
            Tipo de propiedad
          </label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) => handleChange("propertyType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="house">Casa habitación</SelectItem>
              <SelectItem value="apartment">Departamento</SelectItem>
              <SelectItem value="land">Terreno</SelectItem>
              <SelectItem value="commercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Ordenar por</label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleChange("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rate">Menor tasa</SelectItem>
              <SelectItem value="payment">Menor mensualidad</SelectItem>
              <SelectItem value="cat">Menor costo total</SelectItem>
              <SelectItem value="rating">Mejor calificación</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Mensualidad estimada: </span>
          {formatCurrency(
            (filters.amount * (0.12 / 12) * Math.pow(1 + 0.12 / 12, filters.term * 12)) /
              (Math.pow(1 + 0.12 / 12, filters.term * 12) - 1)
          )}
        </p>
        <Button className="bg-[#0466C8] hover:bg-[#0353A4] text-white">
          Aplicar Filtros
        </Button>
      </div>
    </motion.div>
  );
}
