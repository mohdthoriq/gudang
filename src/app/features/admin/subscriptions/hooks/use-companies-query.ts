import { useQuery } from '@tanstack/react-query'
import type { Company, PaginationApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface CompaniesQueryParams {
  name?: string
  page?: number
  limit?: number
  order?: 'asc' | 'desc'
}

export function useCompaniesQuery(params?: CompaniesQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.COMPANY,
      params?.page,
      params?.limit,
      params?.order,
      params?.name,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.order ? { order: params.order } : {}),
        ...(params?.name ? { name: params.name } : {}),
      })

      const url = queryParams.toString()
        ? `/companies?${queryParams.toString()}`
        : '/companies'
      const response = await apiClient.get<PaginationApiResponse<Company>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
