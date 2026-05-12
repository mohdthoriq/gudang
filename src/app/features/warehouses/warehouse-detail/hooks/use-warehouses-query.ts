import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import type { Warehouse } from '@/types' // Sesuaikan tipe data

export function useWarehouseDetail(id: string | undefined | null) {
  return useQuery({
    queryKey: [QUERY_KEY.WAREHOUSE, id],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Warehouse }>(`/warehouses/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}
