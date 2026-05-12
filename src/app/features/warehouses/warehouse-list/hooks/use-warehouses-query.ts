import { useQuery } from '@tanstack/react-query'
import type { Warehouse, PaginationApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface WarehouseQueryParams {
  page?: number
  limit?: number
  company_id?: string
  search?: string
}

export function useWarehousesQuery(params?: WarehouseQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.WAREHOUSE,
      params?.page,
      params?.limit,
      params?.company_id,
      params?.search,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.company_id ? { company_id: params.company_id } : {}),
      })

      const url = queryParams.toString()
        ? `/warehouses?${queryParams.toString()}`
        : '/warehouses'
      const response = await apiClient.get<PaginationApiResponse<Warehouse>>(url)

      return response.data ?? []
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
