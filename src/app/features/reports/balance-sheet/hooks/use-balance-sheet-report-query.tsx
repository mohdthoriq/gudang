import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, BalanceSheetData } from '@/types'
import apiClient from '@/lib/api-client'

export interface BalanceSheetReportQuery {
  date: Date
}
export function useBalanceSheetReportQuery(params?: BalanceSheetReportQuery) {
  return useQuery({
    queryKey: ['balance-sheet-report', params?.date],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date ? { date: format(params.date, 'yyyy-MM-dd') } : {}),
      })

      const url = queryParams.toString()
        ? `/reports/neraca?${queryParams.toString()}`
        : `/reports/neraca`
      const response = await apiClient.get<ApiResponse<BalanceSheetData>>(url)

      return response?.data?.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
