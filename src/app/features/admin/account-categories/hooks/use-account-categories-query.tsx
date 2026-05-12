import { useQuery } from '@tanstack/react-query'
import type { AccountCategory, PaginationApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'

export interface AccountCategoryQueryParams {
  page?: number
  limit?: number
  name?: string
  type_id?: string
  order?: 'asc' | 'desc'
  is_cash_bank?: boolean
}

export function useAccountCategoriesQuery(params?: AccountCategoryQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY_ADMIN.ACCOUNT_CATEGORIES,
      params?.page,
      params?.limit,
      params?.name,
      params?.type_id,
      params?.order,
      params?.is_cash_bank,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.name ? { name: params.name } : {}),
        ...(params?.type_id ? { type_id: params.type_id } : {}),
        ...(params?.order ? { order: params.order } : {}),
        ...(params?.is_cash_bank
          ? { is_cash_bank: params.is_cash_bank.toString() }
          : {}),
      })

      const url = queryParams.toString()
        ? `/account-categories?${queryParams.toString()}`
        : '/account-categories'
      const response =
        await apiClient.get<PaginationApiResponse<AccountCategory>>(url)

      return response.data ?? []
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
