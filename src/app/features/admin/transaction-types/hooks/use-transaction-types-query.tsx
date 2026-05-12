import { useQuery } from '@tanstack/react-query'
import type { TransactionType, PaginationApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'

export interface TransactionTypeQueryParams {
  page?: number
  limit?: number
  name?: string
  code?: string
  order?: 'asc' | 'desc'
}

export const useTransactionTypesQuery = (params?: TransactionTypeQueryParams) => {
  return useQuery({
    queryKey: [
      QUERY_KEY_ADMIN.TRANSACTION_TYPES,
      params?.page,
      params?.limit,
      params?.name,
      params?.code,
      params?.order,
    ],
    queryFn: async () => {
      const searchVal = params?.name?.trim().toLowerCase()
      const isSingleWord = searchVal && !searchVal.includes(' ')

      // Strategy: "Pre-emptive By-Code Check"
      // If we have a single word search (likely a code), we try the specific by-code endpoint first.
      // This is the most "correct" way to use a direct identifier endpoint in a search context.
      if (isSingleWord && !params?.code) {
        try {
          const byCodeResponse = await apiClient.get<{ data: TransactionType }>(
            `/transaction-types/by-code/${searchVal}`
          )

          if (byCodeResponse.data?.data) {
            // Found exact match by code! Return it immediately wrapped in the list format.
            return {
              status: 'success',
              code: 200,
              message: 'Transaction type retrieved successfully',
              data: [byCodeResponse.data.data],
              pagination: {
                page: 1,
                limit: 1,
                total: 1,
                total_pages: 1,
              },
            } as PaginationApiResponse<TransactionType>
          }
        } catch (_error) {
          // If 404 or error, we simply proceed to the general name search.
        }
      }

      // Procedural fallback: General List Search
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.name ? { name: params.name } : {}),
        ...(params?.code ? { code: params.code } : {}),
        ...(params?.order ? { order: params.order } : {}),
      })

      const url = queryParams.toString()
        ? `/transaction-types?${queryParams.toString()}`
        : '/transaction-types'

      const response = await apiClient.get<PaginationApiResponse<TransactionType>>(
        url
      )

      let result = response.data

      // Client-side filtering ensures that if the backend ignores 'name' param
      // or returns broad matches, the UI stays relevant to what the user typed.
      if (searchVal && result.data && result.data.length > 0) {
        const filtered = result.data.filter(
          (item) =>
            item.name.toLowerCase().includes(searchVal) ||
            item.code.toLowerCase().includes(searchVal)
        )

        result = {
          ...result,
          data: filtered,
          pagination: result.pagination
            ? {
                ...result.pagination,
                total: filtered.length,
                total_pages: Math.ceil(filtered.length / (params?.limit || 10)),
              }
            : undefined,
        }
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export const useTransactionTypeByCodeQuery = (code?: string) => {
  return useQuery({
    queryKey: [QUERY_KEY_ADMIN.TRANSACTION_TYPES, 'by-code', code],
    queryFn: async () => {
      if (!code) return null
      const response = await apiClient.get<{ data: TransactionType }>(
        `/transaction-types/by-code/${code}`
      )
      return response.data.data
    },
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
  })
}
