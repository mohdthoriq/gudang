import { useQuery } from '@tanstack/react-query'
import type { Warehouse, ApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

interface WarehouseQueryParams {
  id?: string
}

export function useWarehouseQuery(params?: WarehouseQueryParams) {
  return useQuery({
    // Cache key unik untuk detail gudang
    queryKey: [QUERY_KEY.WAREHOUSE, params?.id],
    queryFn: async () => {
      const url = `/warehouses/${params?.id}`
      const response = await apiClient.get<ApiResponse<Warehouse>>(url)

      return response.data.data
    },
    // Query ini HANYA akan berjalan jika params.id ada nilainya (saat mode Edit)
    enabled: !!params?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
