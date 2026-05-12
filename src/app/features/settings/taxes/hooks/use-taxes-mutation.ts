import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Tax } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import { TaxesContext } from '../components/taxes-provider'
import {
  type UpdateTaxStatusFormData,
  type BulkDeleteTaxesFormData,
  type CreateTaxesFormData,
  type UpdateTaxesFormData,
} from '../types/taxes.schema'

export function useCreateTaxMutation(onSuccess?: (data: Tax) => void) {
  const context = useContext(TaxesContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateTaxesFormData) => {
      const response = await apiClient.post(`taxes`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'taxes-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('taxes-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TAXES] })
      toast.success('Pajak berhasil ditambahkan.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('taxes-toast')
      toast.error('Pajak gagal ditambahkan.')
    },
  })
}

export function useUpdateTaxMutation(onSuccess?: (data: Tax) => void) {
  const context = useContext(TaxesContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateTaxesFormData) => {
      const response = await apiClient.patch(
        `taxes/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'taxes-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('taxes-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TAXES] })
      toast.success('Pajak berhasil diubah.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('taxes-toast')
      toast.error('Pajak gagal diubah.')
    },
  })
}

export function useUpdateTaxStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateTaxStatusFormData) => {
      const response = await apiClient.patch(
        `taxes/${data.id}/status`,
        data
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'taxes-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('taxes-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TAXES] })
      toast.success('Status pajak berhasil diubah.')
    },
    onError: () => {
      toast.dismiss('taxes-toast')
      toast.error('Status pajak gagal diubah.')
    },
  })
}

export function useBulkDeleteTaxMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteTaxesFormData) => {
      const response = await apiClient.post('/taxes/bulk-delete', credentials)

      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus data...', { id: 'bulk-delete-taxes-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('bulk-delete-taxes-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TAXES] })
      toast.success('Data pajak berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('bulk-delete-taxes-toast')
      toast.error('Gagal menghapus data pajak.')
    },
  })
}
