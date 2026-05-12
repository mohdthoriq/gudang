import { useQuery } from '@tanstack/react-query'
import type { SalesDelivery } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function useSalesDeliveryQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.SALES, QUERY_KEY.SALES_DELIVERY, id],
    queryFn: async () => {
      if (!id) return null

      const response = await apiClient.get<{ data: SalesDelivery }>(
        `/sales-delivery/${id}`
      )

      return response.data.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
