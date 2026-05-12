import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'

export function usePrintBalanceSheetQuery(date: string | undefined) {
  return useQuery({
    queryKey: ['balance-sheet-print', date],
    queryFn: async () => {
      if (!date) return null

      const response = await apiClient.get(`/reports/neraca/print`, {
        params: { date },
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
