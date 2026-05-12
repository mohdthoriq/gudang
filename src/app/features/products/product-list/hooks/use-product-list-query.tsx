import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, Product } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface ProductsQueryParams {
  page?: number
  limit?: number
  search?: string
  category_id?: string
  order?: 'asc' | 'desc'
}

export function useProductsQuery(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.PRODUCTS,
      params?.page,
      params?.limit,
      params?.search,
      params?.category_id,
      params?.order,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.category_id ? { category_id: params.category_id } : {}),
        ...(params?.order ? { order: params.order } : {}),
      })

      const url = queryParams.toString()
        ? `/products?${queryParams.toString()}`
        : '/products'
      const response = await apiClient.get<PaginationApiResponse<Product>>(url)

      return response.data ?? []
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
