import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, Product } from '@/types'
import apiClient from '@/lib/api-client'

interface ProductsQueryParams {
  id: string
}

export function useProductsByIdQuery(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: ['products', params?.id],
    queryFn: async () => {
      const url = `/products/${params?.id}`
      const response = await apiClient.get<ApiResponse<Product>>(url)

      return response.data.data
    },
    enabled: !!params?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
