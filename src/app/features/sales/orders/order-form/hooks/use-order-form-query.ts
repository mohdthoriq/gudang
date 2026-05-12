import { useQuery } from '@tanstack/react-query'
import type { SalesOrder, ApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

interface OrderFormQueryParams {
  id?: string
}

export function useOrderFormQuery(params?: OrderFormQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.SALES, QUERY_KEY.SALES_ORDER, params?.id],
    queryFn: async () => {
      const url = `/sales-orders/${params?.id}`
      const response = await apiClient.get<ApiResponse<SalesOrder>>(url)
      return response.data.data
    },
    enabled: !!params?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
