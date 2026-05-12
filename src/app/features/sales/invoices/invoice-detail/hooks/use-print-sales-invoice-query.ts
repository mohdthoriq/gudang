import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'

export function usePrintSalesInvoiceQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['sales-invoice-print', id],
    queryFn: async () => {
      if (!id) return null

      const response = await apiClient.get(`/sales-invoices/${id}/print`, {
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
