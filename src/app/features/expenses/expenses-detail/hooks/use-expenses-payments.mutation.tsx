import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import type {
  DeleteExpensesFormData,
  ExpensesPaymentsFormData,
  ExpensesPaymentsUpdateFormData,
} from '../types/expenses-payments.schema'

export function useCreateExpensesPaymentMutation(expenseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ExpensesPaymentsFormData) => {
      const response = await apiClient.post(
        `expenses/${expenseId}/payments`,
        data
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Processing payment...', { id: 'expense-payment-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('expense-payment-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EXPENSES] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Pembayaran berhasil dilakukan.')
    },
    onError: () => {
      toast.dismiss('expense-payment-toast')
      toast.error('Gagal melakukan pembayaran.')
    },
  })
}

export function useDeleteExpensesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeleteExpensesFormData) => {
      const response = await apiClient.post(
        `/expenses/bulk-delete`,
        credentials
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'invoice-detail-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('invoice-detail-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.EXPENSES],
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Pengeluaran berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('invoice-detail-toast')
      toast.error('Pengeluaran gagal dihapus.')
    },
  })
}

export function useUpdateExpensesPaymentMutation() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as {
    accountId: string
    transactionId: string
  }
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ExpensesPaymentsUpdateFormData) => {
      const response = await apiClient.patch(`expenses/payments/${data.id}`, data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Processing payment...', { id: 'expense-payment-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('expense-payment-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EXPENSES] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Pembayaran berhasil dilakukan.')
      navigate({
        to: '/cash-bank/detail',
        search: {
          accountId: search.accountId,
          transactionId: data.data.id,
        },
      })
    },
    onError: () => {
      toast.dismiss('expense-payment-toast')
      toast.error('Gagal melakukan pembayaran.')
    },
  })
}
