import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import type {
  CreatePurchasesOrderFormData,
  UpdatePurchasesOrderFormData,
} from '../types/order-form.schema'

export function useCreatePurchasesOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreatePurchasesOrderFormData) => {
      const response = await apiClient.post(`purchase-orders`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'orders-form-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('orders-form-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SALES],
      })
      toast.success('Pesanan Penjualan berhasil ditambahkan.')
    },
    onError: () => {
      toast.dismiss('orders-form-toast')
      toast.error('Pesanan Penjualan gagal ditambahkan.')
    },
  })
}

export function useUpdatePurchasesOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdatePurchasesOrderFormData) => {
      const response = await apiClient.patch(
        `purchase-orders/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'orders-form-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('orders-form-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SALES],
      })
      toast.success('Pesanan Penjualan berhasil diubah.')
    },
    onError: () => {
      toast.dismiss('orders-form-toast')
      toast.error('Pesanan Penjualan gagal diubah.')
    },
  })
}
