import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, Expedition } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface ExpeditionsQueryParams {
  page?: number
  limit?: number
  search?: string
  is_active?: string
}

export function useExpeditionsQuery(params?: ExpeditionsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.EXPEDITIONS,
      params?.page,
      params?.limit,
      params?.search,
      params?.is_active,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.is_active ? { is_active: params.is_active } : {}),
      })

      const url = queryParams.toString()
        ? `/expeditions?${queryParams.toString()}`
        : '/expeditions'
      const response = await apiClient.get<PaginationApiResponse<Expedition>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}
