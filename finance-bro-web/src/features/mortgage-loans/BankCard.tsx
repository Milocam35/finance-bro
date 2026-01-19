import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Check, Info, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductoCredito } from "./types";

interface BankCardProps {
  producto: ProductoCredito;
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

export function BankCard({ producto, index, loanAmount }: BankCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const rate = producto.tasa_vigente.tasa_valor;
  const rateBadge = getRateBadge(rate);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getViviendaBadgeColor = (codigo: string) => {
    switch (codigo) {
      case 'vis': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'no_vis': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'vip': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="group relative bg-card rounded-2xl border border-border card-elevated overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        {/* Highlight Badge */}
        {producto.highlight && (
          <div className="absolute top-0 left-0 right-0 bg-[#FFD60A] text-[#001233] text-xs font-semibold text-center py-1.5 z-10">
            {producto.highlight}
          </div>
        )}

        <div className={`p-6 ${producto.highlight ? "pt-10" : ""}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold text-primary overflow-hidden shrink-0">
                {producto.entidad.logo_url ? (
                  <img src={producto.entidad.logo_url} alt={producto.entidad.nombre} className="w-full h-full object-contain p-2" />
                ) : (
                  producto.entidad.nombre.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-lg truncate">{producto.entidad.nombre}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {producto.tipo_tasa.nombre}
                </p>
              </div>
            </div>
            <Badge variant={rateBadge.variant} className="shrink-0">{rateBadge.label}</Badge>
          </div>

          {/* Property Type & Payment Type */}
          <div className="flex gap-2 mb-4">
            <Badge variant="outline" className={getViviendaBadgeColor(producto.tipo_vivienda.codigo)}>
              {producto.tipo_vivienda.nombre}
            </Badge>
            <Badge variant="outline">
              {producto.tipo_pago.nombre}
            </Badge>
            {producto.denominacion.codigo === 'uvr' && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                UVR
              </Badge>
            )}
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs text-muted-foreground">
                  {producto.tasa_vigente.es_rango ? "Tasa desde" : "Tasa anual"}
                </span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{producto.tipo_tasa.nombre}</p>
                    {producto.tasa_vigente.es_rango && (
                      <p className="text-xs mt-1">
                        Rango: {producto.tasa_vigente.tasa_minima}% - {producto.tasa_vigente.tasa_maxima}%
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className={`text-2xl font-bold ${getRateColor(rate)}`}>
                {producto.tasa_vigente.es_rango && producto.tasa_vigente.tasa_minima
                  ? `${producto.tasa_vigente.tasa_minima.toFixed(2)}%`
                  : `${rate.toFixed(2)}%`}
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
              <p className="text-2xl font-bold text-foreground">
                {producto.cat ? `${producto.cat.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                Mensualidad est.
              </span>
              <p className="text-xl font-bold text-foreground">
                {producto.cuota_mensual_estimada
                  ? formatCurrency(producto.cuota_mensual_estimada)
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 py-4 text-sm">
            {producto.monto.monto_minimo > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto mín.</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(producto.monto.monto_minimo)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto máx.</span>
              <span className="font-medium text-foreground">
                {formatCurrency(producto.monto.monto_maximo)}
              </span>
            </div>
            {producto.monto.plazo_minimo_meses > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plazo mín.</span>
                <span className="font-medium text-foreground">
                  {Math.floor(producto.monto.plazo_minimo_meses / 12)} años
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plazo máx.</span>
              <span className="font-medium text-foreground">
                {Math.floor(producto.monto.plazo_maximo_meses / 12)} años
              </span>
            </div>
            {producto.monto.porcentaje_financiacion_min > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Financiación mín.</span>
                <span className="font-medium text-foreground">
                  {producto.monto.porcentaje_financiacion_min}%
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Financiación máx.</span>
              <span className="font-medium text-foreground">
                {producto.monto.porcentaje_financiacion_max}%
              </span>
            </div>
          </div>

          {/* Benefits Preview */}
          {producto.beneficios.length > 0 && (
            <div className="py-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Beneficios destacados</p>
              <div className="flex flex-wrap gap-2">
                {producto.beneficios.slice(0, 3).map((beneficio) => (
                  <span
                    key={beneficio.id}
                    className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md text-foreground"
                  >
                    <Check className="w-3 h-3 text-[#0466C8]" />
                    {beneficio.descripcion}
                  </span>
                ))}
                {producto.beneficios.length > 3 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{producto.beneficios.length - 3} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
            >
              Ver detalles
            </Button>
            <Button
              className="flex-1 bg-[#0466C8] hover:bg-[#0353A4] text-white"
              onClick={(e) => {
                e.stopPropagation();
                // Aquí iría la lógica de redirección al banco
              }}
            >
              Solicitar
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Modal de Detalles */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
                {producto.entidad.logo_url ? (
                  <img src={producto.entidad.logo_url} alt={producto.entidad.nombre} className="w-full h-full object-contain p-2" />
                ) : (
                  producto.entidad.nombre.charAt(0)
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl">{producto.entidad.nombre}</DialogTitle>
                <DialogDescription>
                  Crédito Hipotecario {producto.tipo_vivienda.nombre}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Descripción */}
            {producto.descripcion && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Descripción del Producto</h3>
                <p className="text-muted-foreground">{producto.descripcion}</p>
              </div>
            )}

            {/* Información de la Tasa */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Información de la Tasa</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Tasa</p>
                  <p className="font-medium">{producto.tipo_tasa.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Denominación</p>
                  <p className="font-medium">{producto.denominacion.nombre.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasa</p>
                  <p className="font-medium text-xl">
                    {producto.tasa_vigente.es_rango
                      ? `${producto.tasa_vigente.tasa_minima}% - ${producto.tasa_vigente.tasa_maxima}%`
                      : `${rate.toFixed(2)}%`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Pago</p>
                  <p className="font-medium">{producto.tipo_pago.nombre}</p>
                </div>
                {producto.tasa_vigente.spread_uvr && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Spread UVR</p>
                    <p className="font-medium">{producto.tasa_vigente.spread_uvr}%</p>
                  </div>
                )}
              </div>
            </div>

            {/* Montos y Plazos */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Montos y Plazos</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Monto mínimo</p>
                  <p className="font-medium text-lg">{formatCurrency(producto.monto.monto_minimo)}</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Monto máximo</p>
                  <p className="font-medium text-lg">{formatCurrency(producto.monto.monto_maximo)}</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Plazo mínimo</p>
                  <p className="font-medium text-lg">{Math.floor(producto.monto.plazo_minimo_meses / 12)} años</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Plazo máximo</p>
                  <p className="font-medium text-lg">{Math.floor(producto.monto.plazo_maximo_meses / 12)} años</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Financiación mínima</p>
                  <p className="font-medium text-lg">{producto.monto.porcentaje_financiacion_min}%</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Financiación máxima</p>
                  <p className="font-medium text-lg">{producto.monto.porcentaje_financiacion_max}%</p>
                </div>
              </div>
            </div>

            {/* Beneficios */}
            {producto.beneficios.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Beneficios</h3>
                <div className="space-y-2">
                  {producto.beneficios.map((beneficio) => (
                    <div key={beneficio.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <Check className="w-5 h-5 text-[#0466C8] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{beneficio.descripcion}</p>
                        {beneficio.valor && (
                          <p className="text-sm text-muted-foreground mt-1">Valor: {beneficio.valor}</p>
                        )}
                        {beneficio.aplica_condicion && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Aplica: {beneficio.aplica_condicion}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requisitos */}
            {producto.requisitos.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Requisitos</h3>
                <div className="space-y-2">
                  {producto.requisitos
                    .sort((a, b) => a.orden - b.orden)
                    .map((requisito) => (
                      <div key={requisito.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <div className="shrink-0 mt-0.5">
                          {requisito.es_obligatorio ? (
                            <span className="text-red-500 font-bold">*</span>
                          ) : (
                            <span className="text-muted-foreground">○</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{requisito.requisito}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {requisito.es_obligatorio ? "Obligatorio" : "Opcional"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Condiciones */}
            {producto.condiciones.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Condiciones</h3>
                <ul className="space-y-2">
                  {producto.condiciones
                    .sort((a, b) => a.orden - b.orden)
                    .map((condicion) => (
                      <li key={condicion.id} className="flex items-start gap-2 text-sm">
                        <span className="text-[#0466C8] mt-1">•</span>
                        <span>{condicion.condicion}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Enlaces */}
            <div className="flex gap-3 pt-4 border-t border-border">
              {producto.url_pagina && (
                <Button variant="outline" className="flex-1" asChild>
                  <a href={producto.url_pagina} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver página oficial
                  </a>
                </Button>
              )}
              {producto.url_pdf && (
                <Button variant="outline" className="flex-1" asChild>
                  <a href={producto.url_pdf} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </a>
                </Button>
              )}
            </div>

            {/* CTA Principal */}
            <Button className="w-full bg-[#0466C8] hover:bg-[#0353A4] text-white text-lg py-6">
              Solicitar este crédito
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
