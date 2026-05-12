import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiResponse, FinanceNumber, FinanceNumberType } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function useGenerateNextNumber() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (type: FinanceNumberType) => {
      const response = await apiClient.post(`auto-numbering/generate/${type}`)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'invoices-form-toast' })
    },
    onSuccess: async (_) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.AUTO_NUMBERING],
      })
      toast.dismiss('invoices-form-toast')
    },
    onError: () => {
      toast.error('Gagal generate nomor seterusnya.')
    },
  })
}

interface AutoNumberingQueryParams {
  type: FinanceNumberType
  enabled?: boolean
}

export function useDefaultNumberingQuery(params: AutoNumberingQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.AUTO_NUMBERING, params.type],
    queryFn: async () => {
      const url = `/auto-numbering/type/${params.type}`
      const response = await apiClient.get<ApiResponse<FinanceNumber>>(url)

      return response.data.data
    },
    staleTime: 1 * 30 * 1000, // 30 seconds
    retry: 1, // optional: retry once only
    enabled: params.enabled !== undefined ? params.enabled : true,
  })
}

interface CheckFinanceNumberParams {
  type: FinanceNumberType
  number: string
}

export interface CheckFinanceNumberResponse {
  exists: boolean
  available: boolean
  message: string
}

export function useCheckFinanceNumberQuery(params: CheckFinanceNumberParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.AUTO_NUMBERING,
      QUERY_KEY.CHECK_FINANCE_NUMBER,
      params.type,
      params.number,
    ],
    queryFn: async () => {
      const response = await apiClient.get<
        ApiResponse<CheckFinanceNumberResponse>
      >('/auto-numbering/check', {
        params: {
          type: params.type,
          number: params.number,
        },
      })
      return response.data.data
    },
    enabled: !!params.number && params.number.length > 3,
  })
}
