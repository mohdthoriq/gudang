import { useQuery } from '@tanstack/react-query'
import type {
  ApiResponse,
  CashBankOverview,
  CashBankTransaction,
} from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function useCashBankOverviewQuery() {
  return useQuery({
    queryKey: [QUERY_KEY.CASH_BANK, QUERY_KEY.CASH_BANK_OVERVIEW],
    queryFn: async () => {
      const url = `/cash-bank`
      const response = await apiClient.get<ApiResponse<CashBankOverview>>(url)

      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export interface CashBankListQueryParams {
  page?: number
  limit?: number
  order?: string
  date_from?: Date
  date_to?: Date
  search?: string
  id?: string
  tag?: string
  reference_type?: string
  total_from?: number
  total_to?: number
}

export function useCashBankListQuery(params?: CashBankListQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.CASH_BANK,
      QUERY_KEY.CASH_BANK_TRANSACTIONS,
      params?.page,
      params?.limit,
      params?.order,
      params?.search,
      params?.date_from,
      params?.date_to,
      params?.id,
      params?.tag,
      params?.reference_type,
      params?.total_from,
      params?.total_to,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.date_from
          ? { date_from: params.date_from.toISOString() }
          : {}),
        ...(params?.date_to ? { date_to: params.date_to.toISOString() } : {}),

        ...(params?.order ? { order: params.order } : {}),

        ...(params?.tag ? { tag: params.tag } : {}),
        ...(params?.reference_type
          ? { reference_type: params.reference_type }
          : {}),
        ...(params?.total_from
          ? { total_from: params.total_from.toString() }
          : {}),
        ...(params?.total_to ? { total_to: params.total_to.toString() } : {}),
      })

      const url = queryParams.toString()
        ? `/cash-bank/${params?.id}/transactions?${queryParams.toString()}`
        : `/cash-bank/${params?.id}/transactions`
      const response =
        await apiClient.get<ApiResponse<CashBankTransaction>>(url)

      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
    enabled: !!params?.id,
  })
}
