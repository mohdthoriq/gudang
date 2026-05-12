import { useQuery, useMutation } from '@tanstack/react-query'
import type { PurchasesOrder, ApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function usePurchasesOrderNumberQuery(orderNumber?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.SALES, 'order-number', orderNumber],
    queryFn: async () => {
      if (!orderNumber) return null
      const url = `/purchase-orders/number/${orderNumber}`
      const response = await apiClient.get<ApiResponse<PurchasesOrder>>(url)
      return response.data.data
    },
    enabled: !!orderNumber,
    retry: false,
  })
}

export function useCheckPurchasesOrderNumberAvailability() {
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const response = await apiClient.get<{ available: boolean }>(
        `/purchase-orders/check-number/availability`,
        { params: { order_number: orderNumber } }
      )
      return response.data
    },
  })
}
