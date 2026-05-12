import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'
import { usePlans } from '../components/plans-provider'
import {
  type CreatePlanFormData,
  type UpdatePlanFormData,
  type DeletePlanFormData,
  type BulkDeletePlanFormData,
} from '../types/plans.schema'

export function useCreatePlanMutation() {
  const { setOpen } = usePlans()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreatePlanFormData) => {
      const response = await apiClient.post(`subscriptions/plans`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'plans-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('plans-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PLANS],
      })
      toast.success('Plan berhasil ditambahkan.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('plans-toast')
      toast.error('Plan gagal ditambahkan.')
    },
  })
}

export function useUpdatePlanMutation() {
  const { setOpen } = usePlans()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdatePlanFormData) => {
      const response = await apiClient.patch(
        `subscriptions/plans/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'plans-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('plans-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PLANS],
      })
      toast.success('Plan berhasil diubah.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('plans-toast')
      toast.error('Plan gagal diubah.')
    },
  })
}

export function useDeletePlanMutation() {
  const { setOpen } = usePlans()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeletePlanFormData) => {
      const response = await apiClient.delete(
        `subscriptions/plans/${credentials.id}`
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'plans-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('plans-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PLANS],
      })
      toast.success('Plan berhasil dihapus.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('plans-toast')
      toast.error('Plan gagal dihapus.')
    },
  })
}

export function useBulkDeletePlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeletePlanFormData) => {
      const response = await apiClient.post(
        `/subscriptions/plans/bulk-delete`,
        credentials
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'plans-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('plans-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PLANS],
      })
      toast.success('Plan berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('plans-toast')
      toast.error('Plan gagal dihapus.')
    },
  })
}
