import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'

export function usePrintProfitLossQuery(
  dateFrom: string | undefined,
  dateTo: string | undefined
) {
  return useQuery({
    queryKey: ['profit-loss-print', dateFrom, dateTo],
    queryFn: async () => {
      if (!dateFrom || !dateTo) return null

      const response = await apiClient.get(`/reports/laba-rugi/print`, {
        params: {
          date_from: dateFrom,
          date_to: dateTo,
        },
        responseType: 'blob',
      })

      // Create a URL for the blob
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      return url
    },
    enabled: false,
    staleTime: 0,
    gcTime: 0,
  })
}
