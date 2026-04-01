import { queryOptions } from '@tanstack/react-query';
import { apiFetch } from './api';
import type { ProductoCredito, PaginatedResponse } from '@/features/mortgage-loans/types';

// ── Tipos de simulación ──────────────────────────────────────────────────────

export interface ResultadoSimulacion {
  cuota_mensual: number;
  total_pago: number;
  total_intereses: number;
  tasa_mensual: number;
  tasa_anual_usada: number;
  monto: number;
  plazo_meses: number;
}

export interface ResultadoLoteItem extends ResultadoSimulacion {
  producto_id: string;
  tasa_texto?: string;
}

export interface ResultadoLote {
  resultados: ResultadoLoteItem[];
  promedio_cuota_mensual: number;
}

// Query Key Factory (qk-factory-pattern)
export const productoKeys = {
  all: ['productos'] as const,
  lists: () => [...productoKeys.all, 'list'] as const,
  byTipoCredito: (tipo: string) => [...productoKeys.lists(), tipo] as const,
  detail: (id: string) => [...productoKeys.all, 'detail', id] as const,
};

// ── Simulaciones key factory ─────────────────────────────────────────────────

export const simulacionKeys = {
  all: ['simulaciones'] as const,
  single: (monto: number, plazo: number, tasa: number) =>
    [...simulacionKeys.all, 'single', monto, plazo, tasa] as const,
  lote: (monto: number, plazo: number, ids: string[]) =>
    [...simulacionKeys.all, 'lote', monto, plazo, ...[...ids].sort()] as const,
};

export const simulacionQueries = {
  single: (monto: number, plazoMeses: number, tasaAnual: number) =>
    queryOptions({
      queryKey: simulacionKeys.single(monto, plazoMeses, tasaAnual),
      queryFn: () =>
        apiFetch<ResultadoSimulacion>('/api/simulaciones/calcular', {
          method: 'POST',
          body: JSON.stringify({ monto, plazo_meses: plazoMeses, tasa_anual: tasaAnual }),
        }),
      staleTime: Infinity,
      enabled: monto > 0 && plazoMeses > 0 && tasaAnual > 0,
    }),

  lote: (monto: number, plazoMeses: number, productoIds: string[]) =>
    queryOptions({
      queryKey: simulacionKeys.lote(monto, plazoMeses, productoIds),
      queryFn: () =>
        apiFetch<ResultadoLote>('/api/simulaciones/calcular-lote', {
          method: 'POST',
          body: JSON.stringify({ monto, plazo_meses: plazoMeses, producto_ids: productoIds }),
        }),
      staleTime: 5 * 60 * 1000,
      enabled: productoIds.length > 0 && monto > 0 && plazoMeses > 0,
    }),
};

// ── Productos query factory ───────────────────────────────────────────────────

export const productoQueries = {
  byTipoCredito: (tipo: string) =>
    queryOptions({
      queryKey: productoKeys.byTipoCredito(tipo),
      queryFn: () =>
        apiFetch<PaginatedResponse<ProductoCredito>>(
          `/api/productos/tipo-credito/${tipo}?limit=100`,
        ),
      staleTime: 5 * 60 * 1000, // 5 min - datos de scraping no cambian frecuentemente
      select: (response) => response.data, // perf-select-transform
    }),
};
