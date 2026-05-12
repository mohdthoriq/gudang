import { useQuery } from '@tanstack/react-query'
import type { Journal, PaginationApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function useExpenseJournalsQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY.JOURNAL, 'expense', id],
    queryFn: async () => {
      const response = await apiClient.get<PaginationApiResponse<Journal>>(
        `/expenses/${id}/journals`
      )
      return response.data
    },
    enabled: !!id,
  })
}
