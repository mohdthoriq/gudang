import { useQuery } from '@tanstack/react-query'
import type { Payment, PaginationApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function useOrderPaymentsQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY.SALES, 'order-payments', id],
    queryFn: async () => {
      const response = await apiClient.get<PaginationApiResponse<Payment>>(
        `/purchase-orders/${id}/payments`
      )
      return response.data
    },
    enabled: !!id,
  })
}
