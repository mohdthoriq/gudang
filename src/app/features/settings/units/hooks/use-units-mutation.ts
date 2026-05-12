import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Unit } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import {
  type BulkDeleteUnitFormData,
  type CreateUnitFormData,
  type UpdateUnitFormData,
} from '@/features/settings/units/types/units.schema'
import { UnitsContext } from '../components/units-provider'

export function useCreateUnitMutation(onSuccess?: (data: Unit) => void) {
  const context = useContext(UnitsContext)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateUnitFormData) => {
      const response = await apiClient.post(`units`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'units-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('units-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.UNITS] })
      toast.success('Satuan berhasil ditambahkan.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('units-toast')
      toast.error('Satuan gagal ditambahkan.')
    },
  })
}

export function useUpdateUnitMutation(onSuccess?: (data: Unit) => void) {
  const context = useContext(UnitsContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateUnitFormData) => {
      const response = await apiClient.patch(
        `units/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'units-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('units-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.UNITS] })
      toast.success('Satuan berhasil diubah.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('units-toast')
      toast.error('Satuan gagal diubah.')
    },
  })
}

export function useBulkDeleteUnitMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteUnitFormData) => {
      const response = await apiClient.post('/units/bulk-delete', credentials)

      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus data...', { id: 'bulk-delete-units-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('bulk-delete-units-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.UNITS] })
      toast.success('Data satuan berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('bulk-delete-units-toast')
      toast.error('Gagal menghapus data satuan.')
    },
  })
}
