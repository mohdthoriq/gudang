import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, CurrentRatioData } from '@/types'
import apiClient from '@/lib/api-client'
import type { Period } from '@/features/sales/overview/types/sales-overview'

export interface CurrentRatioQuery {
  date?: Date
  date_from?: Date
  date_to?: Date
  period?: Period
  tag_id?: string
}

export function useCurrentRatioQuery(params?: CurrentRatioQuery) {
  return useQuery({
    queryKey: [
      'current-ratio',
      params?.date,
      params?.date_from,
      params?.date_to,
      params?.period,
      params?.tag_id,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date ? { date: params.date.toISOString() } : {}),
        ...(params?.date_from
          ? { date_from: params.date_from.toISOString() }
          : {}),
        ...(params?.date_to ? { date_to: params.date_to.toISOString() } : {}),
        ...(params?.period ? { period: params.period } : {}),
        ...(params?.tag_id ? { tag_id: params.tag_id } : {}),
      })

      const url = queryParams.toString()
        ? `/reports/neraca/widgets/current-ratio?${queryParams.toString()}`
        : `/reports/neraca/widgets/current-ratio`
      const response =
        await apiClient.get<ApiResponse<CurrentRatioData>>(url)

      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
