import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, Subscription } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'

export interface SubscriptionsQueryParams {
  plan_id?: string
  plan_name?: string
  name?: string
  page?: number
  limit?: number
}

export function useSubscriptionsQuery(params?: SubscriptionsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY_ADMIN.SUBSCRIPTIONS,
      params?.page,
      params?.limit,
      params?.plan_id,
      params?.plan_name,
      params?.name,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.plan_id ? { plan_id: params.plan_id } : {}),
        ...(params?.plan_name ? { plan_name: params.plan_name } : {}),
        ...(params?.name ? { name: params.name } : {}),
      })

      const url = queryParams.toString()
        ? `/subscriptions/active?${queryParams.toString()}`
        : '/subscriptions/active'
      const response =
        await apiClient.get<PaginationApiResponse<Subscription>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
