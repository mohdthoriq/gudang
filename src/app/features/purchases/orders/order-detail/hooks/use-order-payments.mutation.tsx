import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function usePurchasesOrderMutation() {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/purchase-orders/${id}`)
      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus Pesanan Pembelian...', { id: 'so-delete-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('so-delete-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SALES] })
      toast.success('Pesanan Pembelian berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('so-delete-toast')
      toast.error('Gagal menghapus Pesanan Pembelian.')
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await apiClient.post(`/purchase-orders/bulk-delete`, { ids })
      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus data...', { id: 'so-bulk-delete-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('so-bulk-delete-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SALES] })
      toast.success('Data berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('so-bulk-delete-toast')
      toast.error('Gagal menghapus data.')
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { document_status: string; payment_status: string; notes?: string } }) => {
      const response = await apiClient.patch(`/purchase-orders/${id}/status`, data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Mengupdate status...', { id: 'so-status-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('so-status-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SALES] })
      toast.success('Status berhasil diupdate.')
    },
    onError: () => {
      toast.dismiss('so-status-toast')
      toast.error('Gagal update status.')
    },
  })

  return {
    deleteMutation,
    bulkDeleteMutation,
    updateStatusMutation,
  }
}

export function useCreatePurchasesOrderPaymentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const response = await apiClient.post(
        `/purchase-orders/${id}/payments`,
        data
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Processing payment...', { id: 'so-payment-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('so-payment-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SALES],
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Pembayaran berhasil dilakukan.')
    },
    onError: () => {
      toast.dismiss('so-payment-toast')
      toast.error('Gagal melakukan pembayaran.')
    },
  })
}

export function useUpdatePurchasesOrderPaymentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ paymentId, data }: { paymentId: string; data: Record<string, unknown> }) => {
      const response = await apiClient.patch(
        `/purchase-orders/payments/${paymentId}`,
        data
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Processing payment...', { id: 'so-payment-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('so-payment-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SALES],
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Pembayaran berhasil diupdate.')
    },
    onError: () => {
      toast.dismiss('so-payment-toast')
      toast.error('Gagal melakukan update pembayaran.')
    },
  })


}
