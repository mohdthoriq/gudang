import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Account } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import { AccountsContext, useAccounts } from '../components/account-provider'
import type {
  CreateAccountFormData,
  DeleteAccountFormData,
  UpdateAccountFormData,
  BulkDeleteAccountFormData,
} from '../types/account.schema'

export function useCreateAccountMutation(onSuccess?: (data: Account) => void) {
  const context = useContext(AccountsContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateAccountFormData) => {
      const response = await apiClient.post(`accounts`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'accounts-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('accounts-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      toast.success('Akun berhasil ditambahkan.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('accounts-toast')
      toast.error('Akun gagal ditambahkan.')
    },
  })
}

export function useUpdateAccountMutation(onSuccess?: (data: Account) => void) {
  const context = useContext(AccountsContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateAccountFormData) => {
      const response = await apiClient.patch(
        `accounts/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'accounts-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('accounts-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      toast.success('Akun berhasil diubah.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('accounts-toast')
      toast.error('Akun gagal diubah.')
    },
  })
}

export function useDeleteAccountMutation() {
  const { setOpen } = useAccounts()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeleteAccountFormData) => {
      const response = await apiClient.delete(`accounts/${credentials.id}`)

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'accounts-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('accounts-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ACCOUNT] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      toast.success('Akun berhasil dihapus.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('accounts-toast')
      toast.error('Akun gagal dihapus.')
    },
  })
}

export function useBulkDeleteAccountMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteAccountFormData) => {
      const response = await apiClient.post(
        `/accounts/bulk-delete`,
        credentials
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'accounts-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('accounts-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.ACCOUNT],
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CASH_BANK] })
      toast.success('Akun berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('accounts-toast')
      toast.error('Akun gagal dihapus.')
    },
  })
}
