import { useQuery } from '@tanstack/react-query'
import type { Journal, PaginationApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function usePurchaseJournalsQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY.JOURNAL, 'purchase', id],
    queryFn: async () => {
      const response = await apiClient.get<PaginationApiResponse<Journal>>(
        `/purchase-invoices/${id}/journals`
      )
      return response.data
    },
    enabled: !!id,
  })
}
