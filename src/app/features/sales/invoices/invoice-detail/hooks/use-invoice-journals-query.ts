import { useQuery } from '@tanstack/react-query'
import type { Journal, PaginationApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function useInvoiceJournalsQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY.JOURNAL, id],
    queryFn: async () => {
      const response = await apiClient.get<PaginationApiResponse<Journal>>(
        `/sales-invoices/${id}/journals`
      )
      return response.data
    },
    enabled: !!id,
  })
}
