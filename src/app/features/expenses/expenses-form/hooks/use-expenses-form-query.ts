import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, Expense } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

interface ExpensesFormQueryParams {
  id?: string
}

export function useExpensesFormQuery(params?: ExpensesFormQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.EXPENSES, params?.id],
    queryFn: async () => {
      const url = `/expenses/${params?.id}`
      const response = await apiClient.get<ApiResponse<Expense>>(url)

      return response.data.data
    },
    enabled: !!params?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
