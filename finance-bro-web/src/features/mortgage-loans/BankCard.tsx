import { motion } from "framer-motion";
import { Star, ChevronRight, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface BankData {
  id: string;
  name: string;
  logo: string;
  rate: number;
  cat: number;
  monthlyPayment: number;
  minDownPayment: number;
  maxTerm: number;
  rating: number;
  features: string[];
  highlight?: string;
  processingTime: string;
}

interface BankCardProps {
  bank: BankData;
  index: number;
  loanAmount: number;
}

function getRateColor(rate: number): string {
  if (rate <= 12.5) return "text-rate-excellent";
  if (rate <= 13.5) return "text-rate-good";
  if (rate <= 14.5) return "text-rate-average";
  return "text-rate-high";
}

function getRateBadge(rate: number): { label: string; variant: "default" | "secondary" | "outline" } {
  if (rate <= 12.5) return { label: "Excelente", variant: "default" };
  if (rate <= 13.5) return { label: "Buena", variant: "secondary" };
  return { label: "Promedio", variant: "outline" };
}

export function BankCard({ bank, index, loanAmount }: BankCardProps) {
  const rateBadge = getRateBadge(bank.rate);
  
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
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-card rounded-2xl border border-border card-elevated overflow-hidden"
    >
      {/* Highlight Badge */}
      {bank.highlight && (
        <div className="absolute top-0 left-0 right-0 bg-[#FFD60A] text-[#001233] text-xs font-semibold text-center py-1.5">
          {bank.highlight}
        </div>
      )}

      <div className={`p-6 ${bank.highlight ? "pt-10" : ""}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
              {bank.logo ? (
                <img src={bank.logo} alt={bank.name} className="w-full h-full object-contain p-2" />
              ) : (
                bank.name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{bank.name}</h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(bank.rating)
                        ? "text-[#FFD60A] fill-[#FFD60A]"
                        : "text-muted"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  {bank.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <Badge variant={rateBadge.variant}>{rateBadge.label}</Badge>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-muted-foreground">Tasa anual</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tasa de interés anual fija</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className={`text-2xl font-bold ${getRateColor(bank.rate)}`}>
              {bank.rate.toFixed(2)}%
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-muted-foreground">Costo Total</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Costo total anual promedio</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-2xl font-bold text-foreground">{bank.cat.toFixed(1)}%</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">
              Mensualidad
            </span>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(bank.monthlyPayment)}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Enganche mínimo</span>
            <span className="font-medium text-foreground">{bank.minDownPayment}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plazo máximo</span>
            <span className="font-medium text-foreground">{bank.maxTerm} años</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiempo aprox.</span>
            <span className="font-medium text-foreground">{bank.processingTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monto financiado</span>
            <span className="font-medium text-foreground">{formatCurrency(loanAmount)}</span>
          </div>
        </div>

        {/* Features */}
        <div className="py-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Características destacadas</p>
          <div className="flex flex-wrap gap-2">
            {bank.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md text-foreground"
              >
                <Check className="w-3 h-3 text-[#0466C8]" />
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
          >
            Ver detalles
          </Button>
          <Button className="flex-1 bg-[#0466C8] hover:bg-[#0353A4] text-white">
            Solicitar
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
