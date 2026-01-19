import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, DollarSign, Calendar, Percent, Info, Home, ArrowUpDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
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
  TooltipProvider,
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
  housingType?: string; // VIS, No VIS, o todos
  denomination?: string; // Pesos, UVR, o todos
  sortBy: string;
}

const MIN_AMOUNT = 20000000; // 20 millones
const MAX_AMOUNT = 10000000000; // 10 mil millones
const MIN_TERM = 5; // 5 años
const MAX_TERM = 30; // 30 años

export function CreditFilters({ onFilterChange }: CreditFiltersProps) {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({
    amount: 200000000,
    term: 20,
    propertyType: "all",
    housingType: "all",
    denomination: "all",
    sortBy: "rate",
  });
  const [amountInput, setAmountInput] = useState<string>("200000000");
  const [termInput, setTermInput] = useState<string>("20");

  const handleChange = (key: keyof FilterState, value: number | string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Solo números
    setAmountInput(value);
  };

  const handleAmountInputBlur = () => {
    const numValue = parseInt(amountInput) || MIN_AMOUNT;

    // Validar rango
    let validatedValue = numValue;
    let showAlert = false;
    let alertMessage = "";

    if (numValue < MIN_AMOUNT) {
      validatedValue = MIN_AMOUNT;
      showAlert = true;
      alertMessage = `El monto mínimo permitido es ${formatCurrency(MIN_AMOUNT)}. Se ajustó automáticamente al mínimo.`;
    } else if (numValue > MAX_AMOUNT) {
      validatedValue = MAX_AMOUNT;
      showAlert = true;
      alertMessage = `El monto máximo permitido es ${formatCurrency(MAX_AMOUNT)}. Se ajustó automáticamente al máximo.`;
    }

    if (showAlert) {
      toast({
        title: "Monto ajustado",
        description: alertMessage,
        variant: "destructive",
      });
    }

    setAmountInput(validatedValue.toString());
    handleChange("amount", validatedValue);
  };

  const handleSliderChange = (value: number) => {
    setAmountInput(value.toString());
    handleChange("amount", value);
  };

  const handleTermInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Solo números
    setTermInput(value);
  };

  const handleTermInputBlur = () => {
    const numValue = parseInt(termInput) || MIN_TERM;

    // Validar rango
    let validatedValue = numValue;
    let showAlert = false;
    let alertMessage = "";

    if (numValue < MIN_TERM) {
      validatedValue = MIN_TERM;
      showAlert = true;
      alertMessage = `El plazo mínimo permitido es ${MIN_TERM} años. Se ajustó automáticamente al mínimo.`;
    } else if (numValue > MAX_TERM) {
      validatedValue = MAX_TERM;
      showAlert = true;
      alertMessage = `El plazo máximo permitido es ${MAX_TERM} años. Se ajustó automáticamente al máximo.`;
    }

    if (showAlert) {
      toast({
        title: "Plazo ajustado",
        description: alertMessage,
        variant: "destructive",
      });
    }

    setTermInput(validatedValue.toString());
    handleChange("term", validatedValue);
  };

  const handleTermSliderChange = (value: number) => {
    setTermInput(value.toString());
    handleChange("term", value);
  };

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

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Amount Slider with Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Monto del crédito
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <Info className="w-4 h-4 text-muted-foreground hover:text-[#0466C8] transition-colors" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      <strong>Monto ideal en Colombia:</strong> Para vivienda VIS (Vivienda de Interés Social),
                      el monto típico está entre $50M y $150M. Para vivienda No VIS, entre $150M y $500M.
                      El rango completo permite desde $20M hasta $10.000M para casos especiales.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <span className="text-sm font-semibold text-[#0466C8]">
              {formatCurrency(filters.amount)}
            </span>
          </div>

          {/* Input de texto editable */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <Input
              type="text"
              value={formatInputCurrency(amountInput)}
              onChange={handleAmountInputChange}
              onBlur={handleAmountInputBlur}
              className="pl-7 text-sm font-medium"
              placeholder="Ingrese el monto"
            />
          </div>

          <Slider
            value={[filters.amount]}
            onValueChange={([value]) => handleSliderChange(value)}
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            step={10000000}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$20M</span>
            <span>$10.000M</span>
          </div>
        </div>

        {/* Term Slider with Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Plazo (años)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <Info className="w-4 h-4 text-muted-foreground hover:text-[#0466C8] transition-colors" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      <strong>Plazo ideal en Colombia:</strong> Los plazos más comunes son entre 10 y 20 años.
                      Plazos más cortos (5-10 años) tienen cuotas más altas pero menos intereses totales.
                      Plazos más largos (20-30 años) reducen la cuota mensual pero aumentan el costo total del crédito.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <span className="text-sm font-semibold text-[#0466C8]">
              {filters.term} años
            </span>
          </div>

          {/* Input de texto editable */}
          <div className="relative">
            <Input
              type="text"
              value={termInput}
              onChange={handleTermInputChange}
              onBlur={handleTermInputBlur}
              className="text-sm font-medium pr-16"
              placeholder="Ingrese el plazo"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              años
            </span>
          </div>

          <Slider
            value={[filters.term]}
            onValueChange={([value]) => handleTermSliderChange(value)}
            min={MIN_TERM}
            max={MAX_TERM}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 años</span>
            <span>30 años</span>
          </div>
        </div>

        {/* Housing Type (VIS/No VIS) */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Home className="w-4 h-4 text-muted-foreground" />
            Tipo de vivienda
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="w-4 h-4 text-muted-foreground hover:text-[#0466C8] transition-colors" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    <strong>VIS:</strong> Vivienda de Interés Social (valor hasta 135 SMMLV, aprox. $180M).<br/>
                    <strong>No VIS:</strong> Vivienda que supera el valor VIS.<br/>
                    <strong>VIP:</strong> Vivienda de Interés Prioritario (valor hasta 70 SMMLV).
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Select
            value={filters.housingType}
            onValueChange={(value) => handleChange("housingType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="vis">VIS</SelectItem>
              <SelectItem value="no_vis">No VIS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Denomination (Pesos/UVR) */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Percent className="w-4 h-4 text-muted-foreground" />
            Denominación
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="w-4 h-4 text-muted-foreground hover:text-[#0466C8] transition-colors" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    <strong>Pesos:</strong> Crédito en pesos colombianos con cuota fija o variable.<br/>
                    <strong>UVR:</strong> Crédito indexado a la Unidad de Valor Real, ajustado por inflación.
                    Cuota en UVR + spread, generalmente con tasas más bajas pero cuota variable.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Select
            value={filters.denomination}
            onValueChange={(value) => handleChange("denomination", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar denominación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pesos">Pesos</SelectItem>
              <SelectItem value="uvr">UVR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            Ordenar por
          </label>
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
        <Button className="bg-[#0466C8] hover:bg-[#0353A4] text-white">
          Aplicar Filtros
        </Button>
      </div>
    </motion.div>
  );
}
