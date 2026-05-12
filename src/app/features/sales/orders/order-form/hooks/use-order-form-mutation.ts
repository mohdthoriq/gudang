import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import type {
  CreateSalesOrderFormData,
  UpdateSalesOrderFormData,
} from '../types/order-form.schema'

export function useCreateSalesOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateSalesOrderFormData) => {
      const response = await apiClient.post(`sales-orders`, credentials)
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

export function useUpdateSalesOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateSalesOrderFormData) => {
      const response = await apiClient.patch(
        `sales-orders/${credentials.id}`,
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
