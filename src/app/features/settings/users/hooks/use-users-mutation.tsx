import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import { useUsers } from '../components/users-provider'
import type {
  CreateUserFormData,
  DeleteUserFormData,
  UpdateUserFormData,
  UpdateUserStatusFormData,
  BulkDeleteUserFormData,
} from '../types/users.schema'

export function useCreateUserMutation() {
  const { setOpen } = useUsers()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateUserFormData) => {
      const response = await apiClient.post(`/users/invite`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'users-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('users-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS] })
      toast.success('Pengguna berhasil diundang.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('users-toast')
      toast.error('Pengguna gagal diundang.')
    },
  })
}

export function useUpdateUserMutation() {
  const { setOpen } = useUsers()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateUserFormData) => {
      const { id, ...data } = payload
      const response = await apiClient.patch(`/users/${id}`, data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'users-update-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('users-update-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS] })
      toast.success('Pengguna berhasil diperbarui.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('users-update-toast')
      toast.error('Gagal memperbarui pengguna.')
    },
  })
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateUserStatusFormData) => {
      const response = await apiClient.patch(`/users/${data.id}/status`, {
        is_active: data.is_active,
      })
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'users-status-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('users-status-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS] })
      toast.success('Status pengguna berhasil diubah.')
    },
    onError: () => {
      toast.dismiss('users-status-toast')
      toast.error('Gagal mengubah status pengguna.')
    },
  })
}

export function useDeleteUserMutation() {
  const { setOpen } = useUsers()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: DeleteUserFormData) => {
      const response = await apiClient.delete(`/users/${data.id}`)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'users-delete-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('users-delete-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS] })
      toast.success('Pengguna berhasil dihapus.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('users-delete-toast')
      toast.error('Gagal menghapus pengguna.')
    },
  })
}

export function useBulkDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: BulkDeleteUserFormData) => {
      const response = await apiClient.post('/users/bulk-delete', data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'users-bulk-delete-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('users-bulk-delete-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS] })
      toast.success('Pengguna berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('users-bulk-delete-toast')
      toast.error('Gagal menghapus pengguna.')
    },
  })
}

export function useResendInviteMutation() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/users/${id}/resend-invite`)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'users-resend-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('users-resend-toast')
      toast.success('Undangan berhasil dikirim ulang.')
    },
    onError: () => {
      toast.dismiss('users-resend-toast')
      toast.error('Gagal mengirim ulang undangan.')
    },
  })
}

