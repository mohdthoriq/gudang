import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, SalesInvoice } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface InvoiceListQueryParams {
  page?: number
  limit?: number
  order?: string
  company_id?: string
  customer_id?: string
  payment_status?: 'unpaid' | 'partially_paid' | 'paid'
  search?: string
  date_from?: Date
  date_to?: Date
  due_date_from?: Date
  due_date_to?: Date
  payment_date_from?: Date
  payment_date_to?: Date
  tags?: string[]
}

export function useInvoiceListQuery(params?: InvoiceListQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.SALES, QUERY_KEY.SALES_INVOICE, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.search
          ? { search: params.search }
          : {}),
        ...(params?.date_from
          ? { date_from: params.date_from.toISOString() }
          : {}),
        ...(params?.date_to ? { date_to: params.date_to.toISOString() } : {}),
        ...(params?.payment_status
          ? { payment_status: params.payment_status }
          : {}),
        ...(params?.customer_id ? { customer_id: params.customer_id } : {}),
        ...(params?.company_id ? { company_id: params.company_id } : {}),
        ...(params?.order ? { order: params.order } : {}),
        ...(params?.due_date_from
          ? { due_date_from: params.due_date_from.toISOString() }
          : {}),
        ...(params?.due_date_to
          ? { due_date_to: params.due_date_to.toISOString() }
          : {}),
        ...(params?.payment_date_from
          ? { payment_date_from: params.payment_date_from.toISOString() }
          : {}),
        ...(params?.payment_date_to
          ? { payment_date_to: params.payment_date_to.toISOString() }
          : {}),
      })

      if (params?.tags) {
        params.tags.forEach((tag) => queryParams.append('tags', tag))
      }

      const url = queryParams.toString()
        ? `/sales-invoices?${queryParams.toString()}`
        : '/sales-invoices'
      const response =
        await apiClient.get<PaginationApiResponse<SalesInvoice>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
