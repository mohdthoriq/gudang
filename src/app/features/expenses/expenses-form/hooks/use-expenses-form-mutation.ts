import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import type {
  CreateExpenseFormData,
  UpdateExpenseFormData,
} from '../types/expenses-form.schema'

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateExpenseFormData) => {
      const response = await apiClient.post(`expenses`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'invoices-form-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('invoices-form-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EXPENSES] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Invoice berhasil ditambahkan.')
    },
    onError: () => {
      toast.dismiss('invoices-form-toast')
      toast.error('Invoice gagal ditambahkan.')
    },
  })
}

export function useUpdateExpenseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateExpenseFormData) => {
      const response = await apiClient.patch(
        `expenses/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'invoices-form-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('invoices-form-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EXPENSES] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Invoice berhasil diubah.')
    },
    onError: () => {
      toast.dismiss('invoices-form-toast')
      toast.error('Invoice gagal diubah.')
    },
  })
}
