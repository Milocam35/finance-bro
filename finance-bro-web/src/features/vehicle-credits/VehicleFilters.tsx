import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Calendar, ArrowUpDown, Info, RotateCcw, Car, Bike } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface VehicleFiltersProps {
  onFilterChange: (filters: VehicleFilterState) => void;
}

export type VehicleType = "all" | "auto" | "moto";

export interface VehicleFilterState {
  amount: number;
  term: number;
  sortBy: string;
  vehicleType: VehicleType;
}

const MIN_AMOUNT = 5000000;
const MAX_AMOUNT = 500000000;
const MIN_TERM = 1;
const MAX_TERM = 8;

const DEFAULT_FILTERS: VehicleFilterState = {
  amount: 50000000,
  term: 5,
  sortBy: "rate",
  vehicleType: "auto",
};

export function VehicleFilters({ onFilterChange }: VehicleFiltersProps) {
  const { toast } = useToast();
  const [filters, setFilters] = useState<VehicleFilterState>(DEFAULT_FILTERS);
  const [amountInput, setAmountInput] = useState<string>("50000000");
  const [termInput, setTermInput] = useState<string>("5");

  const handleChange = (key: keyof VehicleFilterState, value: number | string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmountInput(value);
  };

  const handleAmountInputBlur = () => {
    const numValue = parseInt(amountInput) || MIN_AMOUNT;
    let validatedValue = numValue;

    if (numValue < MIN_AMOUNT) {
      validatedValue = MIN_AMOUNT;
      toast({ title: "Monto ajustado", description: `El monto mínimo es ${formatCurrency(MIN_AMOUNT)}.`, variant: "destructive" });
    } else if (numValue > MAX_AMOUNT) {
      validatedValue = MAX_AMOUNT;
      toast({ title: "Monto ajustado", description: `El monto máximo es ${formatCurrency(MAX_AMOUNT)}.`, variant: "destructive" });
    }

    setAmountInput(validatedValue.toString());
    handleChange("amount", validatedValue);
  };

  const handleSliderChange = (value: number) => {
    setAmountInput(value.toString());
    handleChange("amount", value);
  };

  const handleTermInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setTermInput(value);
  };

  const handleTermInputBlur = () => {
    const numValue = parseInt(termInput) || MIN_TERM;
    let validatedValue = numValue;

    if (numValue < MIN_TERM) {
      validatedValue = MIN_TERM;
      toast({ title: "Plazo ajustado", description: `El plazo mínimo es ${MIN_TERM} año.`, variant: "destructive" });
    } else if (numValue > MAX_TERM) {
      validatedValue = MAX_TERM;
      toast({ title: "Plazo ajustado", description: `El plazo máximo es ${MAX_TERM} años.`, variant: "destructive" });
    }

    setTermInput(validatedValue.toString());
    handleChange("term", validatedValue);
  };

  const handleTermSliderChange = (value: number) => {
    setTermInput(value.toString());
    handleChange("term", value);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setAmountInput("50000000");
    setTermInput("5");
    onFilterChange(DEFAULT_FILTERS);
  };

  const isFiltersModified =
    filters.amount !== 50000000 ||
    filters.term !== 5 ||
    filters.sortBy !== "rate" ||
    filters.vehicleType !== "auto";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatInputCurrency = (value: string) => {
    const num = parseInt(value) || 0;
    return new Intl.NumberFormat("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-secondary/15 bg-gradient-to-br from-card via-card to-secondary/[0.03] shadow-[var(--card-shadow)]"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-40" />

      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--secondary)) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }} />

      <div className="relative p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center shadow-lg shadow-foreground/20">
                <Car className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base tracking-tight">
                Personaliza tu búsqueda
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Filtra entre las opciones de crédito vehicular
              </p>
            </div>
          </div>
          {isFiltersModified && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-secondary transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary/5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer
            </motion.button>
          )}
        </div>

        {/* Sort & Vehicle Type filters */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Tipo de vehículo — izquierda */}
          <div className="space-y-3 lg:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Car className="w-4 h-4 text-secondary" />
              Tipo de vehículo
            </label>
            <div className="flex gap-2">
              {([
                { value: "auto", label: "Automóvil", icon: Car },
                { value: "moto", label: "Motocicleta", icon: Bike },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChange("vehicleType", option.value)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    filters.vehicleType === option.value
                      ? "bg-secondary text-primary-foreground border-secondary shadow-md shadow-secondary/20"
                      : "bg-muted text-foreground border-border hover:bg-border hover:border-border"
                  }`}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ordenar por — derecha */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ArrowUpDown className="w-4 h-4 text-secondary" />
              Ordenar por
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleChange("sortBy", value)}
            >
              <SelectTrigger className="h-[42px] rounded-xl border-border bg-muted hover:bg-border transition-colors text-sm font-medium text-foreground focus:ring-ring/20 focus:border-ring/40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rate">Menor tasa</SelectItem>
                <SelectItem value="payment">Menor mensualidad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
              Simulación
            </span>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Amount Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-secondary" />
                </div>
                Valor del vehículo
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-secondary transition-colors" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Valor comercial del vehículo que deseas financiar.
                      La financiación típica es entre el 70% y 90% del valor.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </label>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-foreground/[0.02] to-secondary/[0.03] border border-secondary/10">
                <span className="text-secondary/60 text-sm font-medium">$</span>
                <Input
                  type="text"
                  value={formatInputCurrency(amountInput)}
                  onChange={handleAmountInputChange}
                  onBlur={handleAmountInputBlur}
                  className="border-0 bg-transparent p-0 h-auto text-lg font-bold text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                  placeholder="Ingrese el valor"
                />
                <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-md whitespace-nowrap">
                  COP
                </span>
              </div>
            </div>

            <div className="px-1">
              <Slider
                value={[filters.amount]}
                onValueChange={([value]) => handleSliderChange(value)}
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                step={5000000}
                className="py-2"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">$5M</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">$500M</span>
              </div>
            </div>
          </div>

          {/* Term Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-secondary" />
                </div>
                Plazo del crédito
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-secondary transition-colors" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Plazos cortos (1-3 años): cuotas altas, menos intereses.<br/>
                      Plazos largos (5-8 años): cuotas bajas, más costo total.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </label>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-foreground/[0.02] to-secondary/[0.03] border border-secondary/10">
                <Input
                  type="text"
                  value={termInput}
                  onChange={handleTermInputChange}
                  onBlur={handleTermInputBlur}
                  className="border-0 bg-transparent p-0 h-auto text-lg font-bold text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                  placeholder="Plazo en años"
                />
                <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-md whitespace-nowrap">
                  años
                </span>
              </div>
            </div>

            <div className="px-1">
              <Slider
                value={[filters.term]}
                onValueChange={([value]) => handleTermSliderChange(value)}
                min={MIN_TERM}
                max={MAX_TERM}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">1 año</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">8 años</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
