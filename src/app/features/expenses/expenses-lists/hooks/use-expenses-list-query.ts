import { useQuery } from '@tanstack/react-query'
import type { Expense, PaginationApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface ExpenseListQueryParams {
  page?: number
  limit?: number
  order?: string
  company_id?: string
  contact_id?: string
  payment_status?: 'unpaid' | 'partially_paid' | 'paid'
  search?: string
  date_from?: Date
  date_to?: Date
  tags?: string[]
}

export function useExpensesListQuery(params?: ExpenseListQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.EXPENSES, params],
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
        ...(params?.contact_id ? { contact_id: params.contact_id } : {}),
        ...(params?.company_id ? { company_id: params.company_id } : {}),
        ...(params?.order ? { order: params.order } : {}),
        ...(params?.tags ? { tags: params.tags.join(',') } : {}),
      })

      const url = queryParams.toString()
        ? `/expenses?${queryParams.toString()}`
        : '/expenses'
      const response = await apiClient.get<PaginationApiResponse<Expense>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
