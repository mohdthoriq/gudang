import { useQuery } from '@tanstack/react-query'
import type { Plan, ApiResponse, PaginationApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'

export interface PlansQueryParams {
  page?: number
  limit?: number
  name?: string
  order?: 'asc' | 'desc'
  is_active?: boolean
}

export function usePlansQuery(params?: PlansQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY_ADMIN.PLANS,
      params?.page,
      params?.limit,
      params?.name,
      params?.order,
      params?.is_active,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.name ? { name: params.name } : {}),
        ...(params?.order ? { order: params.order } : {}),
        ...(params?.is_active
          ? { is_active: params.is_active.toString() }
          : {}),
      })

      const url = queryParams.toString()
        ? `/subscriptions/plans?${queryParams.toString()}`
        : '/subscriptions/plans'
      const response = await apiClient.get<PaginationApiResponse<Plan>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}

export function usePlanDetailQuery(planId: string) {
  return useQuery({
    queryKey: [QUERY_KEY_ADMIN.PLANS, planId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Plan>>(
        `/subscriptions/plans/${planId}`
      )
      return response.data.data
    },
    enabled: !!planId,
  })
}
