import { useQuery } from '@tanstack/react-query'
import type { Tax, PaginationApiResponse } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface TaxesQueryParams {
  page?: number
  limit?: number
  search?: string
  company_id?: string
}

export function useTaxesQuery(params?: TaxesQueryParams) {
  const user = useAuthStore((state) => state.auth.user)

  return useQuery({
    queryKey: [
      QUERY_KEY.TAXES,
      params?.page,
      params?.limit,
      params?.search,
      params?.company_id,
      user?.company?.id,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.search ? { search: params.search } : {}),
        company_id: params?.company_id
          ? params.company_id
          : user?.company?.id || '',
      })

      const url = queryParams.toString()
        ? `/taxes?${queryParams.toString()}`
        : '/taxes'
      const response = await apiClient.get<PaginationApiResponse<Tax>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
