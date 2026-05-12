import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'
import { useTransactionTypes } from '../components/transaction-types-provider'
import {
  type TransactionTypeFormValues,
  type BulkDeleteTransactionTypeFormData,
} from '../types/transaction-types.schema'

export function useCreateTransactionTypeMutation() {
  const { setOpen } = useTransactionTypes()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TransactionTypeFormValues) => {
      const response = await apiClient.post('/transaction-types', data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'transaction-types-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('transaction-types-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.TRANSACTION_TYPES],
      })
      toast.success('Tipe Transaksi berhasil ditambahkan.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('transaction-types-toast')
      toast.error('Tipe Transaksi gagal ditambahkan.')
    },
  })
}

export function useUpdateTransactionTypeMutation() {
  const { setOpen } = useTransactionTypes()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: TransactionTypeFormValues
    }) => {
      const response = await apiClient.patch(`/transaction-types/${id}`, data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'transaction-types-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('transaction-types-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.TRANSACTION_TYPES],
      })
      toast.success('Tipe Transaksi berhasil diubah.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('transaction-types-toast')
      toast.error('Tipe Transaksi gagal diubah.')
    },
  })
}

export function useDeleteTransactionTypeMutation() {
  const { setOpen } = useTransactionTypes()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/transaction-types/${id}`)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'transaction-types-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('transaction-types-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.TRANSACTION_TYPES],
      })
      toast.success('Tipe Transaksi berhasil dihapus.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('transaction-types-toast')
      toast.error('Tipe Transaksi gagal dihapus.')
    },
  })
}

export function useBulkDeleteTransactionTypeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BulkDeleteTransactionTypeFormData) => {
      const response = await apiClient.post(
        '/transaction-types/bulk-delete',
        data
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'transaction-types-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('transaction-types-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.TRANSACTION_TYPES],
      })
      toast.success('Tipe Transaksi berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('transaction-types-toast')
      toast.error('Tipe Transaksi gagal dihapus.')
    },
  })
}
