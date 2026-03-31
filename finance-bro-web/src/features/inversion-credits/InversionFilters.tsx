import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Calendar, ArrowUpDown, Info, RotateCcw, Banknote } from "lucide-react";
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

interface InversionFiltersProps {
  onFilterChange: (filters: InversionFilterState) => void;
}

export interface InversionFilterState {
  amount: number;
  term: number;
  sortBy: string;
}

const MIN_AMOUNT = 1000000;
const MAX_AMOUNT = 100000000;
const MIN_TERM = 1;
const MAX_TERM = 7;

const DEFAULT_FILTERS: InversionFilterState = {
  amount: 10000000,
  term: 1,
  sortBy: "rate",
};

export function InversionFilters({ onFilterChange }: InversionFiltersProps) {
  const { toast } = useToast();
  const [filters, setFilters] = useState<InversionFilterState>(DEFAULT_FILTERS);
  const [amountInput, setAmountInput] = useState<string>("10000000");
  const [termInput, setTermInput] = useState<string>("1");

  const handleChange = (key: keyof InversionFilterState, value: number | string) => {
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
    setAmountInput("10000000");
    setTermInput("1");
    onFilterChange(DEFAULT_FILTERS);
  };

  const isFiltersModified =
    filters.amount !== DEFAULT_FILTERS.amount ||
    filters.term !== DEFAULT_FILTERS.term ||
    filters.sortBy !== DEFAULT_FILTERS.sortBy;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const formatInputCurrency = (value: string) =>
    new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseInt(value) || 0);

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
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center shadow-lg shadow-foreground/20">
              <Banknote className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base tracking-tight">Personaliza tu búsqueda</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Filtra entre las opciones de libre inversión</p>
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

        {/* Sort */}
        <div className="mb-8 max-w-xs">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
            <ArrowUpDown className="w-4 h-4 text-secondary" />
            Ordenar por
          </label>
          <Select value={filters.sortBy} onValueChange={(value) => handleChange("sortBy", value)}>
            <SelectTrigger className="h-[42px] rounded-xl border-border bg-muted hover:bg-border transition-colors text-sm font-medium text-foreground focus:ring-ring/20 focus:border-ring/40">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rate">Menor tasa</SelectItem>
              <SelectItem value="payment">Menor mensualidad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">Simulación</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Amount */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-secondary" />
              </div>
              Monto del crédito
              <Tooltip>
                <TooltipTrigger asChild><div className="cursor-help"><Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-secondary transition-colors" /></div></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p className="text-sm">Valor aproximado del crédito de libre inversión que necesitas.</p></TooltipContent>
              </Tooltip>
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-foreground/[0.02] to-secondary/[0.03] border border-secondary/10">
              <span className="text-secondary/60 text-sm font-medium">$</span>
              <Input
                type="text"
                value={formatInputCurrency(amountInput)}
                onChange={handleAmountInputChange}
                onBlur={handleAmountInputBlur}
                className="border-0 bg-transparent p-0 h-auto text-lg font-bold text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Ingrese el valor"
              />
              <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-md whitespace-nowrap">COP</span>
            </div>
            <div className="px-1">
              <Slider value={[filters.amount]} onValueChange={([v]) => handleSliderChange(v)} min={MIN_AMOUNT} max={MAX_AMOUNT} step={1000000} className="py-2" />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">$1M</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">$100M</span>
              </div>
            </div>
          </div>

          {/* Term */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-secondary" />
              </div>
              Plazo del crédito
              <Tooltip>
                <TooltipTrigger asChild><div className="cursor-help"><Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-secondary transition-colors" /></div></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p className="text-sm">Tiempo en años en que planeas pagar el crédito.</p></TooltipContent>
              </Tooltip>
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-foreground/[0.02] to-secondary/[0.03] border border-secondary/10">
              <Input
                type="text"
                value={termInput}
                onChange={handleTermInputChange}
                onBlur={handleTermInputBlur}
                className="border-0 bg-transparent p-0 h-auto text-lg font-bold text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Plazo en años"
              />
              <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-md whitespace-nowrap">años</span>
            </div>
            <div className="px-1">
              <Slider value={[filters.term]} onValueChange={([v]) => handleTermSliderChange(v)} min={MIN_TERM} max={MAX_TERM} step={1} className="py-2" />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">1 año</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">7 años</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
