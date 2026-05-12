import { useQuery } from '@tanstack/react-query'
import type { PurchaseDelivery } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function usePurchaseDeliveryQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.PURCHASES, QUERY_KEY.PURCHASES_DELIVERY, id],
    queryFn: async () => {
      if (!id) return null

      const response = await apiClient.get<{ data: PurchaseDelivery }>(
        `/purchase-delivery/${id}`
      )

      return response.data.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
