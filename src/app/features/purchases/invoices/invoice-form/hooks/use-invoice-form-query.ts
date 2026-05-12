import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, PurchaseInvoice } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

interface InvoiceFormQueryParams {
  id?: string
}

export function useInvoiceFormQuery(params?: InvoiceFormQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.PURCHASES, QUERY_KEY.PURCHASES_INVOICE, params?.id],
    queryFn: async () => {
      const url = `/purchase-invoices/${params?.id}`
      const response = await apiClient.get<ApiResponse<PurchaseInvoice>>(url)

      return response.data.data
    },
    enabled: !!params?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
