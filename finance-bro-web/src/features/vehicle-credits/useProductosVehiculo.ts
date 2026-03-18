import { useQuery } from '@tanstack/react-query';
import { productoQueries } from '@/lib/query-keys';

export function useProductosVehiculo() {
  return useQuery(productoQueries.byTipoCredito('vehiculo'));
}
