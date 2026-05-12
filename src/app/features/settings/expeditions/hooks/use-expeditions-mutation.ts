import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Expedition, PaginationApiResponse } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import {
  type BulkDeleteExpeditionFormData,
  type CreateExpeditionFormData,
  type UpdateExpeditionFormData,
  type ToggleExpeditionStatusFormData,
} from '@/features/settings/expeditions/types/expeditions.schema'
import { ExpeditionsContext } from '../components/expeditions-provider'

export function useCreateExpeditionMutation(onSuccess?: (data: Expedition) => void) {
  const context = useContext(ExpeditionsContext)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateExpeditionFormData) => {
      const response = await apiClient.post(`expeditions`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Menyimpan...', { id: 'expeditions-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('expeditions-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EXPEDITIONS] })
      toast.success('Ekspedisi berhasil ditambahkan.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('expeditions-toast')
      toast.error('Ekspedisi gagal ditambahkan.')
    },
  })
}

export function useUpdateExpeditionMutation(onSuccess?: (data: Expedition) => void) {
  const context = useContext(ExpeditionsContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateExpeditionFormData) => {
      const response = await apiClient.patch(
        `expeditions/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Menyimpan...', { id: 'expeditions-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('expeditions-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EXPEDITIONS] })
      toast.success('Ekspedisi berhasil diubah.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('expeditions-toast')
      toast.error('Ekspedisi gagal diubah.')
    },
  })
}

export function useToggleExpeditionStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: ToggleExpeditionStatusFormData) => {
      const response = await apiClient.patch(
        `expeditions/${credentials.id}/status`,
        { is_active: credentials.is_active }
      )
      return response.data
    },
    onMutate: async (credentials) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.EXPEDITIONS] })

      // Snapshot previous data
      const previousQueries = queryClient.getQueriesData<PaginationApiResponse<Expedition>>({
        queryKey: [QUERY_KEY.EXPEDITIONS],
      })

      // Optimistically update
      queryClient.setQueriesData<PaginationApiResponse<Expedition>>(
        { queryKey: [QUERY_KEY.EXPEDITIONS] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.map((exp: Expedition) =>
              exp.id === credentials.id
                ? { ...exp, is_active: credentials.is_active }
                : exp
            ),
          }
        }
      )

      return { previousQueries }
    },
    onError: (_err, _newStatus, context) => {
      toast.error('Gagal mengubah status ekspedisi.')
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EXPEDITIONS] })
    },
    onSuccess: () => {
      toast.success('Status ekspedisi berhasil diubah.')
    },
  })
}

export function useDeleteExpeditionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/expeditions/${id}`)
      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus data...', { id: 'delete-expedition-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('delete-expedition-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EXPEDITIONS] })
      toast.success('Data ekspedisi berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('delete-expedition-toast')
      toast.error('Gagal menghapus data ekspedisi.')
    },
  })
}

export function useBulkDeleteExpeditionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteExpeditionFormData) => {
      const response = await apiClient.post('/expeditions/bulk-delete', credentials)

      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus data...', { id: 'bulk-delete-expeditions-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('bulk-delete-expeditions-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EXPEDITIONS] })
      toast.success('Data ekspedisi berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('bulk-delete-expeditions-toast')
      toast.error('Gagal menghapus data ekspedisi.')
    },
  })
}
