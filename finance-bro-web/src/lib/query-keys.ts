import { queryOptions } from '@tanstack/react-query';
import { apiFetch } from './api';
import type { ProductoCredito, PaginatedResponse } from '@/features/mortgage-loans/types';

// Query Key Factory (qk-factory-pattern)
export const productoKeys = {
  all: ['productos'] as const,
  lists: () => [...productoKeys.all, 'list'] as const,
  byTipoCredito: (tipo: string) => [...productoKeys.lists(), tipo] as const,
  detail: (id: string) => [...productoKeys.all, 'detail', id] as const,
};

// Query Options Factory con staleTime (cache-stale-time)
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
