import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Tag } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import { TagsContext } from '../components/tags-provider'
import type {
  BulkDeleteTagFormData,
  CreateTagFormData,
  UpdateTagFormData,
} from '../types/tags.schema'

export function useCreateTagMutation(onSuccess?: (data: Tag) => void) {
  const context = useContext(TagsContext)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateTagFormData) => {
      const response = await apiClient.post(`tags`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'tags-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('tags-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TAGS] })
      toast.success('Tag berhasil ditambahkan.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('tags-toast')
      toast.error('Tag gagal ditambahkan.')
    },
  })
}

export function useUpdateTagMutation(onSuccess?: (data: Tag) => void) {
  const context = useContext(TagsContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateTagFormData) => {
      const response = await apiClient.patch(
        `tags/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'tags-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('tags-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TAGS] })
      toast.success('Tag berhasil diubah.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('tags-toast')
      toast.error('Tag gagal diubah.')
    },
  })
}

export function useBulkDeleteTagMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteTagFormData) => {
      const response = await apiClient.post('/tags/bulk-delete', credentials)

      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus data...', { id: 'bulk-delete-tags-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('bulk-delete-tags-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TAGS] })
      toast.success('Data tag berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('bulk-delete-tags-toast')
      toast.error('Gagal menghapus data tag.')
    },
  })
}
