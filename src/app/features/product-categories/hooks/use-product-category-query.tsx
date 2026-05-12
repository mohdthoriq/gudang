import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, ProductCategory } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface ProductCategoryQueryParams {
  page?: number
  limit?: number
  company_id?: string
  search?: string
}

export function useProductCategoryQuery(params?: ProductCategoryQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT_CATEGORIES, params?.page, params?.limit, params?.search],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.search ? { search: params.search } : {}),
      })

      const url = queryParams.toString()
        ? `/product-categories?${queryParams.toString()}`
        : '/product-categories'
      const response =
        await apiClient.get<PaginationApiResponse<ProductCategory>>(url)

      return response.data ?? []
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
