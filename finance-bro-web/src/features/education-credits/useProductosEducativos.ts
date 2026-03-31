import { useQuery } from '@tanstack/react-query';
import { productoQueries } from '@/lib/query-keys';

export function useProductosEducativos() {
  return useQuery(productoQueries.byTipoCredito('educativo'));
}
