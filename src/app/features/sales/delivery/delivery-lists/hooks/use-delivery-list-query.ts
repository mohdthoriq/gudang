import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, SalesDelivery } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface DeliveryListQueryParams {
  page?: number
  limit?: number
  order?: string
  sort_by?: string
  search?: string
  company_id?: string
  customer_id?: string
  document_status?: 'draft' | 'posted' | 'void'
  payment_status?: 'unpaid' | 'partially_paid' | 'paid'
  date_from?: Date
  date_to?: Date
  expedition_id?: string
}

export function useDeliveryListQuery(params?: DeliveryListQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.SALES, QUERY_KEY.SALES_DELIVERY, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.date_from
          ? { date_from: params.date_from.toISOString() }
          : {}),
        ...(params?.date_to
          ? { date_to: params.date_to.toISOString() }
          : {}),
        ...(params?.payment_status
          ? { payment_status: params.payment_status }
          : {}),
        ...(params?.document_status
          ? { document_status: params.document_status }
          : {}),
        ...(params?.customer_id ? { customer_id: params.customer_id } : {}),
        ...(params?.company_id ? { company_id: params.company_id } : {}),
        ...(params?.order ? { order: params.order } : {}),
        ...(params?.sort_by ? { sort_by: params.sort_by } : {}),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.expedition_id
          ? { expedition_id: params.expedition_id }
          : {}),
      })

      const url = queryParams.toString()
        ? `/sales-delivery?${queryParams.toString()}`
        : '/sales-delivery'
      const response =
        await apiClient.get<PaginationApiResponse<SalesDelivery>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

