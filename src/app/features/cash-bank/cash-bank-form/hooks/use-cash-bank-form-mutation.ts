import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import type {
  CashBankFormEditData,
  CashBankFormFormData,
} from '../types/cash-bank-form.schema'

export function useCreateSpendMoneyMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { bank_account_id?: string }

  return useMutation({
    mutationFn: async (data: CashBankFormFormData) => {
      const response = await apiClient.post('cash-bank/spend', data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Menyimpan transaksi...', { id: 'cash-bank-form-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('cash-bank-form-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Transaksi pengeluaran dana berhasil ditambahkan.')

      // Navigate to detail page with transaction ID and account ID
      navigate({
        to: '/cash-bank/detail',
        search: {
          transactionId: data.data.id,
          accountId: search.bank_account_id,
        },
      })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.dismiss('cash-bank-form-toast')
      const message =
        error.response?.data?.message || 'Transaksi gagal ditambahkan.'
      toast.error(message)
    },
  })
}

export function useCreateReceiveMoneyMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { bank_account_id?: string }

  return useMutation({
    mutationFn: async (data: CashBankFormFormData) => {
      const response = await apiClient.post('cash-bank/receive', data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Menyimpan transaksi...', { id: 'cash-bank-form-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('cash-bank-form-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Transaksi penerimaan dana berhasil ditambahkan.')

      // Navigate to detail page with transaction ID and account ID
      navigate({
        to: '/cash-bank/detail',
        search: {
          transactionId: data.data.id,
          accountId: search.bank_account_id,
        },
      })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.dismiss('cash-bank-form-toast')
      const message =
        error.response?.data?.message || 'Transaksi gagal ditambahkan.'
      toast.error(message)
    },
  })
}
export function useUpdateSpendMoneyMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { accountId?: string }

  return useMutation({
    mutationFn: async (data: CashBankFormEditData) => {
      const response = await apiClient.put(`cash-bank/spend/`, data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Menyimpan transaksi...', { id: 'cash-bank-form-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('cash-bank-form-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Transaksi pengeluaran dana berhasil diperbarui.')

      navigate({
        to: '/cash-bank/detail',
        search: {
          transactionId: data.data.id,
          accountId: search.accountId,
        },
      })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.dismiss('cash-bank-form-toast')
      const message =
        error.response?.data?.message || 'Transaksi gagal diperbarui.'
      toast.error(message)
    },
  })
}

export function useUpdateReceiveMoneyMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { bank_account_id?: string }

  return useMutation({
    mutationFn: async (data: CashBankFormEditData) => {
      const response = await apiClient.put(`cash-bank/receive/`, data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Menyimpan transaksi...', { id: 'cash-bank-form-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('cash-bank-form-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Transaksi penerimaan dana berhasil diperbarui.')

      navigate({
        to: '/cash-bank/detail',
        search: {
          transactionId: data.data.id,
          accountId: search.bank_account_id,
        },
      })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.dismiss('cash-bank-form-toast')
      const message =
        error.response?.data?.message || 'Transaksi gagal diperbarui.'
      toast.error(message)
    },
  })
}
