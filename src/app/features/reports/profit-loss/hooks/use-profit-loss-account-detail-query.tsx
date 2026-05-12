import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, ProfitLossAccountDetailData } from '@/types'
import apiClient from '@/lib/api-client'
import type { Period } from '@/features/sales/overview/types/sales-overview'

export interface ProfitLossAccountDetailQuery {
  accountId: string
  date_from: Date
  date_to: Date
  period: Period
  page: number
  per_page: number
}
export function useProfitLossAccountDetailQuery(
  params?: ProfitLossAccountDetailQuery
) {
  return useQuery({
    queryKey: [
      'profit-loss-account-detail',
      params?.accountId,
      params?.date_from,
      params?.date_to,
      params?.period,
      params?.page,
      params?.per_page,
    ],
    queryFn: async () => {
      // Don't fetch if no accountId
      if (!params?.accountId) return null

      const queryParams = new URLSearchParams({
        ...(params?.date_from
          ? { date_from: params.date_from.toISOString() }
          : {}),
        ...(params?.date_to ? { date_to: params.date_to.toISOString() } : {}),
        ...(params?.period ? { period: params.period } : {}),
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.per_page ? { per_page: params.per_page.toString() } : {}),
      })

      const url = queryParams.toString()
        ? `/reports/laba-rugi/detail/${params?.accountId}?${queryParams.toString()}`
        : `/reports/laba-rugi/detail/${params?.accountId}`
      const response =
        await apiClient.get<ApiResponse<ProfitLossAccountDetailData>>(url)

      return response.data.data
    },
    enabled: !!params?.accountId, // Only run if accountId is present
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
