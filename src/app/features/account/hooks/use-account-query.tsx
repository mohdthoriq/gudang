import { useQuery } from '@tanstack/react-query'
import type {
  Account,
  ApiResponse,
  LedgerData,
  PaginationApiResponse,
} from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface AccountQueryParams {
  page?: number
  limit?: number
  search?: string
  category_id?: string
  order?: 'asc' | 'desc'
  is_active?: boolean
  is_parent?: boolean
  transaction_types?: string[]
  code_prefix?: string[]
}

export function useAccountsQuery(params?: AccountQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.ACCOUNT,
      params?.page,
      params?.limit,
      params?.search,
      params?.category_id,
      params?.is_active,
      params?.is_parent,
      params?.transaction_types,
      params?.order,
      params?.code_prefix,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        limit: '1000',
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.category_id ? { category_id: params.category_id } : {}),
        ...(params?.is_active !== undefined
          ? { is_active: params.is_active.toString() }
          : {}),
        ...(params?.is_parent !== undefined
          ? { is_parent: params.is_parent.toString() }
          : {}),
        ...(params?.order ? { order: params.order } : {}),
      })

      if (params?.transaction_types) {
        params.transaction_types.forEach((type) =>
          queryParams.append('transaction_types', type)
        )
      }

      if (params?.code_prefix) {
        params.code_prefix.forEach((prefix) =>
          queryParams.append('code_prefix', prefix)
        )
      }

      const url = queryParams.toString()
        ? `/accounts?${queryParams.toString()}`
        : '/accounts'
      const response = await apiClient.get<PaginationApiResponse<Account>>(url)

      return response.data ?? []
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useAccountLedgerQuery(
  accountId: string,
  from?: string,
  to?: string,
  search?: string,
  order?: 'asc' | 'desc'
) {
  return useQuery({
    queryKey: ['account-ledger', accountId, from, to, search, order],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(from ? { date_from: from } : {}),
        ...(to ? { date_to: to } : {}),
        ...(search ? { search } : {}),
        ...(order ? { order } : {}),
      })
      const url = `/accounts/${accountId}/ledger${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get<ApiResponse<LedgerData>>(url)
      return response.data.data
    },
    enabled: !!accountId,
  })
}
