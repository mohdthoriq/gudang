import { useQuery, useMutation } from '@tanstack/react-query'
import type { SalesOrder, ApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function useSalesOrderNumberQuery(orderNumber?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.SALES, 'order-number', orderNumber],
    queryFn: async () => {
      if (!orderNumber) return null
      const url = `/sales-orders/number/${orderNumber}`
      const response = await apiClient.get<ApiResponse<SalesOrder>>(url)
      return response.data.data
    },
    enabled: !!orderNumber,
    retry: false,
  })
}

export function useCheckSalesOrderNumberAvailability() {
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const response = await apiClient.get<{ available: boolean }>(
        `/sales-orders/check-number/availability`,
        { params: { order_number: orderNumber } }
      )
      return response.data
    },
  })
}
