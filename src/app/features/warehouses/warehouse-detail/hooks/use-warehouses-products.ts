import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, Product } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface WarehouseProductsQueryParams {
  warehouseId: string 
  page?: number
  limit?: number
  search?: string
}

export function useWarehouseProductsQuery(params: WarehouseProductsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.WAREHOUSE,
      'products',
      params.warehouseId,
      params.page,
      params.limit,
      params.search,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params.page ? { page: params.page.toString() } : {}),
        ...(params.limit ? { limit: params.limit.toString() } : {}),
        ...(params.search ? { search: params.search } : {}),
      })

      const queryString = queryParams.toString()
      
      const url = queryString
        ? `/warehouses/${params.warehouseId}/products?${queryString}`
        : `/warehouses/${params.warehouseId}/products`

      const response = await apiClient.get<PaginationApiResponse<Product>>(url)

      return response.data ?? []
    },
    enabled: !!params.warehouseId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
