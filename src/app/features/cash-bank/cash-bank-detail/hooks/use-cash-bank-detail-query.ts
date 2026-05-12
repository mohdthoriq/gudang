import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, CashBankTransactionDetail } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

interface CashBankDetailQueryParams {
  accountId?: string
  transactionId?: string
}

export function useCashBankDetailQuery(params?: CashBankDetailQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.CASH_BANK, params?.accountId, params?.transactionId],
    queryFn: async () => {
      const url = `/cash-bank/${params?.accountId}/transactions/${params?.transactionId}`
      const response =
        await apiClient.get<ApiResponse<CashBankTransactionDetail>>(url)

      return response.data.data
    },
    enabled: !!params?.accountId && !!params?.transactionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
