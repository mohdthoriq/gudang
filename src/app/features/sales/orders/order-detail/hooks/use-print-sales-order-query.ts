import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'

export function usePrintSalesOrderQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['sales-order-print', id],
    queryFn: async () => {
      if (!id) return null

      const response = await apiClient.get(`/sales-orders/${id}/print`, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      return url
    },
    enabled: false,
    staleTime: 0,
    gcTime: 0,
  })
}
