import { useQuery } from '@tanstack/react-query';
import { productoQueries } from '@/lib/query-keys';

export function useProductosHipotecarios() {
  return useQuery(productoQueries.byTipoCredito('hipotecario'));
}
