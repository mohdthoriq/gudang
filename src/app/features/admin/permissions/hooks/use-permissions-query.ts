import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, Permission } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'

export interface PermissionsQueryParams {
  page?: number
  limit?: number
  company_id?: string
  name?: string
}

export function usePermissionsQuery(params?: PermissionsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY_ADMIN.PERMISSIONS,
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
        ? `/permissions?${queryParams.toString()}`
        : '/permissions'
      const response =
        await apiClient.get<PaginationApiResponse<Permission>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
