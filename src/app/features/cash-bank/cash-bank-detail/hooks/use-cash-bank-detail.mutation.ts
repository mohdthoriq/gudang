import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export function useDeletePaymentTransactionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/payments/${id}`)
      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus transaksi...', { id: 'delete-payment-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('delete-payment-toast')
      // Invalidate overview and list, but NOT the specific detail query to avoid 404
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CASH_BANK, QUERY_KEY.CASH_BANK_OVERVIEW],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CASH_BANK, QUERY_KEY.CASH_BANK_TRANSACTIONS],
      })

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.SALES] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PURCHASES] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EXPENSES] })
      toast.success('Transaksi berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('delete-payment-toast')
      toast.error('Gagal menghapus transaksi.')
    },
  })
}
