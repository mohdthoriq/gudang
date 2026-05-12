import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, BalanceSheetAccountDetailData } from '@/types'
import apiClient from '@/lib/api-client'
import type { Period } from '@/features/sales/overview/types/sales-overview'

export interface BalanceSheetAccountDetailQuery {
  accountId: string
  date: Date
  period: Period
  page: number
  per_page: number
}
export function useBalanceSheetAccountDetailQuery(
  params?: BalanceSheetAccountDetailQuery
) {
  return useQuery({
    queryKey: [
      'balance-sheet-account-detail',
      params?.accountId,
      params?.date,
      params?.period,
      params?.page,
      params?.per_page,
    ],
    queryFn: async () => {
      // Don't fetch if no accountId
      if (!params?.accountId) return null

      const queryParams = new URLSearchParams({
        ...(params?.date ? { date: params.date.toISOString() } : {}),
        ...(params?.period ? { period: params.period } : {}),
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.per_page ? { per_page: params.per_page.toString() } : {}),
      })

      const url = queryParams.toString()
        ? `/reports/neraca/detail/${params?.accountId}?${queryParams.toString()}`
        : `/reports/neraca/detail/${params?.accountId}`
      const response =
        await apiClient.get<ApiResponse<BalanceSheetAccountDetailData>>(url)

      return response.data.data
    },
    enabled: !!params?.accountId, // Only run if accountId is present
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
