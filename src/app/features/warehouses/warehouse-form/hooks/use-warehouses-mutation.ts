import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Warehouse } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import {
  type CreateWarehouseFormData,
  type UpdateWarehouseFormData,
  type DeleteWarehouseFormData,
  type BulkDeleteWarehouseFormData,
} from '../types/warehouses.schema'
import { WarehousesContext } from '../../warehouse-list/components/warehouses-provider'

export function useCreateWarehouseMutation(onSuccess?: (data: Warehouse) => void) {
  const context = useContext(WarehousesContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateWarehouseFormData) => {
      const response = await apiClient.post(`/warehouses`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'warehouses-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('warehouses-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.WAREHOUSE] })
      toast.success('Gudang berhasil ditambahkan.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('warehouses-toast')
      toast.error('Gudang gagal ditambahkan.')
    },
  })
}

export function useUpdateWarehouseMutation(onSuccess?: (data: Warehouse) => void) {
  const context = useContext(WarehousesContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateWarehouseFormData) => {
      const response = await apiClient.put(
        `/warehouses/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'warehouses-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('warehouses-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.WAREHOUSE] })
      toast.success('Gudang berhasil diubah.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('warehouses-toast')
      toast.error('Gudang gagal diubah.')
    },
  })
}

export function useDeleteWarehouseMutation() {
  const context = useContext(WarehousesContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeleteWarehouseFormData) => {
      const response = await apiClient.delete(`/warehouses/${credentials.id}`)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'warehouses-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('warehouses-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.WAREHOUSE] })
      toast.success('Gudang berhasil dihapus.')
      context?.setOpen(null)
    },
    onError: () => {
      toast.dismiss('warehouses-toast')
      toast.error('Gudang gagal dihapus.')
    },
  })
}

export function useBulkDeleteWarehouseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteWarehouseFormData) => {
      const response = await apiClient.post(
        `/warehouses/bulk-delete`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'warehouses-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('warehouses-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.WAREHOUSE],
      })
      toast.success('Gudang berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('warehouses-toast')
      toast.error('Gudang gagal dihapus.')
    },
  })
}
