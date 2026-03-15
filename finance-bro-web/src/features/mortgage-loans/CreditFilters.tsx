import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Calendar, Home, Banknote, ArrowUpDown, Info, RotateCcw } from "lucide-react";
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

interface CreditFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  amount: number;
  term: number;
  propertyType: string;
  housingType?: string;
  denomination?: string;
  sortBy: string;
}

const MIN_AMOUNT = 20000000;
const MAX_AMOUNT = 10000000000;
const MIN_TERM = 5;
const MAX_TERM = 30;

const DEFAULT_FILTERS: FilterState = {
  amount: 200000000,
  term: 20,
  propertyType: "all",
  housingType: "all",
  denomination: "all",
  sortBy: "rate",
};

export function CreditFilters({ onFilterChange }: CreditFiltersProps) {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [amountInput, setAmountInput] = useState<string>("200000000");
  const [termInput, setTermInput] = useState<string>("20");

  const handleChange = (key: keyof FilterState, value: number | string) => {
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
      toast({ title: "Plazo ajustado", description: `El plazo mínimo es ${MIN_TERM} años.`, variant: "destructive" });
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
    setAmountInput("200000000");
    setTermInput("20");
    onFilterChange(DEFAULT_FILTERS);
  };

  const isFiltersModified =
    filters.housingType !== "all" ||
    filters.denomination !== "all" ||
    filters.amount !== 200000000 ||
    filters.term !== 20;

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
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-40" />

      {/* Subtle background pattern */}
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
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="6" height="2" rx="1" fill="hsl(var(--accent))" />
                  <rect x="2" y="9" width="10" height="2" rx="1" fill="hsl(var(--accent))" opacity="0.7" />
                  <rect x="2" y="14" width="14" height="2" rx="1" fill="hsl(var(--accent))" opacity="0.4" />
                  <circle cx="15" cy="5" r="3" fill="hsl(var(--secondary))" />
                  <circle cx="17" cy="10" r="2" fill="hsl(var(--secondary))" opacity="0.6" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base tracking-tight">
                Personaliza tu búsqueda
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Filtra entre las opciones disponibles
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

        {/* === ROW 1: Quick toggle filters === */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Housing Type - Toggle Pills */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Home className="w-4 h-4 text-secondary" />
              Tipo de vivienda
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-secondary transition-colors" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    <strong>VIS:</strong> Vivienda de Interés Social (hasta 135 SMMLV).<br/>
                    <strong>No VIS:</strong> Vivienda que supera el valor VIS.
                  </p>
                </TooltipContent>
              </Tooltip>
            </label>
            <div className="flex gap-2">
              {[
                { value: "all", label: "Todos" },
                { value: "vis", label: "VIS" },
                { value: "no_vis", label: "No VIS" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChange("housingType", option.value)}
                  className={`
                    flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${filters.housingType === option.value
                      ? "bg-foreground text-primary-foreground shadow-lg shadow-foreground/20 scale-[1.02]"
                      : "bg-muted text-muted-foreground hover:bg-border hover:text-foreground"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Denomination - Toggle Pills */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Banknote className="w-4 h-4 text-secondary" />
              Denominación
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-secondary transition-colors" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    <strong>Pesos:</strong> Cuota fija o variable en COP.<br/>
                    <strong>UVR:</strong> Indexado a inflación, tasa más baja pero cuota variable.
                  </p>
                </TooltipContent>
              </Tooltip>
            </label>
            <div className="flex gap-2">
              {[
                { value: "all", label: "Todos" },
                { value: "pesos", label: "Pesos" },
                { value: "uvr", label: "UVR" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChange("denomination", option.value)}
                  className={`
                    flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${filters.denomination === option.value
                      ? "bg-foreground text-primary-foreground shadow-lg shadow-foreground/20 scale-[1.02]"
                      : "bg-muted text-muted-foreground hover:bg-border hover:text-foreground"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
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
                <SelectItem value="cat">Menor costo total</SelectItem>
                <SelectItem value="rating">Mejor calificación</SelectItem>
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

        {/* === ROW 2: Sliders === */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Amount Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-secondary" />
                </div>
                Monto del crédito
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-secondary transition-colors" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      <strong>VIS:</strong> Típicamente entre $50M - $180M.<br/>
                      <strong>No VIS:</strong> Desde $180M en adelante.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </label>
            </div>

            {/* Amount display + input */}
            <div className="relative">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-foreground/[0.02] to-secondary/[0.03] border border-secondary/10">
                <span className="text-secondary/60 text-sm font-medium">$</span>
                <Input
                  type="text"
                  value={formatInputCurrency(amountInput)}
                  onChange={handleAmountInputChange}
                  onBlur={handleAmountInputBlur}
                  className="border-0 bg-transparent p-0 h-auto text-lg font-bold text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                  placeholder="Ingrese el monto"
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
                step={10000000}
                className="py-2"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">$20M</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">$10.000M</span>
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
                      Plazos cortos (5-10 años): cuotas altas, menos intereses.<br/>
                      Plazos largos (20-30 años): cuotas bajas, más costo total.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </label>
            </div>

            {/* Term display + input */}
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
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">5 años</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">30 años</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
