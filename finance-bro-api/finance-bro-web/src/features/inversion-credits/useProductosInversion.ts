import { useQuery } from '@tanstack/react-query';
import { productoQueries } from '@/lib/query-keys';

export function useProductosInversion() {
  return useQuery(productoQueries.byTipoCredito('libre_inversion'));
}
