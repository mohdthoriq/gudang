import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { PaymentTerm } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import {
  PaymentTermsContext,
} from '../components/payment-terms-provider'
import {
  type BulkDeletePaymentTermsFormData,
  type CreatePaymentTermsFormData,
  type UpdatePaymentTermsFormData,
} from '../types/payment-terms.schema'

export function useCreatePaymentTermMutation(
  onSuccess?: (data: PaymentTerm) => void
) {
  const context = useContext(PaymentTermsContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreatePaymentTermsFormData) => {
      const response = await apiClient.post(`payment-terms`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'payment-terms-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('payment-terms-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PAYMENT_TERMS],
      })
      toast.success('Termin Pembayaran berhasil ditambahkan.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('payment-terms-toast')
      toast.error('Termin Pembayaran gagal ditambahkan.')
    },
  })
}

export function useUpdatePaymentTermMutation(
  onSuccess?: (data: PaymentTerm) => void
) {
  const context = useContext(PaymentTermsContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdatePaymentTermsFormData) => {
      const response = await apiClient.patch(
        `payment-terms/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'payment-terms-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('payment-terms-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PAYMENT_TERMS],
      })
      toast.success('Termin Pembayaran berhasil diubah.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('payment-terms-toast')
      toast.error('Termin Pembayaran gagal diubah.')
    },
  })
}

export function useBulkDeletePaymentTermMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeletePaymentTermsFormData) => {
      const response = await apiClient.post(
        '/payment-terms/bulk-delete',
        credentials
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus data...', {
        id: 'bulk-delete-payment-terms-toast',
      })
    },
    onSuccess: async (_) => {
      toast.dismiss('bulk-delete-payment-terms-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PAYMENT_TERMS],
      })
      toast.success('Data termin pembayaran berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('bulk-delete-payment-terms-toast')
      toast.error('Gagal menghapus data termin pembayaran.')
    },
  })
}
