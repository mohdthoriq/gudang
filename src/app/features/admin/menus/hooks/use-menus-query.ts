import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, Menu } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'

export interface MenusQueryParams {
  page?: number
  limit?: number
  company_id?: string
  name?: string
}

export function useMenusQuery(params?: MenusQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY_ADMIN.MENUS,
      params?.page,
      params?.limit,
      params?.company_id,
      params?.name,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.name ? { name: params.name } : {}),
        ...(params?.company_id ? { company_id: params.company_id } : {}),
      })

      const url = queryParams.toString()
        ? `/menus?${queryParams.toString()}`
        : '/menus'
      const response = await apiClient.get<PaginationApiResponse<Menu>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
