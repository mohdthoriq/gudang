import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import type {
  DeleteSalesInvoiceFormData,
  InvoicePaymentsFormData,
  UpdateInvoicePaymentsFormData,
} from '../types/invoice-payments.schema'

export function useCreateInvoicePaymentMutation(invoiceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: InvoicePaymentsFormData) => {
      const response = await apiClient.post(
        `sales-invoices/${invoiceId}/payments`,
        data
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Processing payment...', { id: 'invoice-payment-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('invoice-payment-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SALES],
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Pembayaran berhasil dilakukan.')
    },
    onError: () => {
      toast.dismiss('invoice-payment-toast')
      toast.error('Gagal melakukan pembayaran.')
    },
  })
}

export function useDeleteSalesInvoiceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeleteSalesInvoiceFormData) => {
      const response = await apiClient.post(
        `/sales-invoices/bulk-delete`,
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
        queryKey: [QUERY_KEY.SALES],
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Tagihan Penjualan berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('invoice-detail-toast')
      toast.error('Tagihan Penjualan gagal dihapus.')
    },
  })
}

export function useUpdateInvoicePaymentMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as {
    accountId: string
  }
  return useMutation({
    mutationFn: async (data: UpdateInvoicePaymentsFormData) => {
      const response = await apiClient.patch(
        `sales-invoices/payments/${data.id}`,
        data
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Processing payment...', { id: 'invoice-payment-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('invoice-payment-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SALES],
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      toast.success('Pembayaran berhasil diupdate.')

      navigate({
        to: '/cash-bank/detail',
        search: {
          accountId: search.accountId,
          transactionId: data.data.id,
        },
      })
    },
    onError: () => {
      toast.dismiss('invoice-payment-toast')
      toast.error('Gagal melakukan update pembayaran.')
    },
  })
}
