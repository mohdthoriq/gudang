import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Contact } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import {
  type CreateContactFormData,
  type UpdateContactFormData,
  type DeleteContactFormData,
  type BulkDeleteContactFormData,
} from '@/features/contacts/types/contacts.schema'
import { ContactsContext } from '../components/contacts-provider'

export function useCreateContactMutation(onSuccess?: (data: Contact) => void) {
  const context = useContext(ContactsContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateContactFormData) => {
      const response = await apiClient.post(`contacts`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'contacts-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('contacts-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CONTACT] })
      toast.success('Kontak berhasil ditambahkan.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('contacts-toast')
      toast.error('Kontak gagal ditambahkan.')
    },
  })
}

export function useUpdateContactMutation(onSuccess?: (data: Contact) => void) {
  const context = useContext(ContactsContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateContactFormData) => {
      const response = await apiClient.patch(
        `contacts/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'contacts-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('contacts-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CONTACT] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CONTACT_TYPE] })
      toast.success('Kontak berhasil diubah.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('contacts-toast')
      toast.error('Kontak gagal diubah.')
    },
  })
}

export function useDeleteContactMutation() {
  const context = useContext(ContactsContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeleteContactFormData) => {
      const response = await apiClient.delete(`contacts/${credentials.id}`)

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'contacts-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('contacts-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CONTACT] })
      toast.success('Kontak berhasil dihapus.')
      context?.setOpen(null)
    },
    onError: () => {
      toast.dismiss('contacts-toast')
      toast.error('Kontak gagal dihapus.')
    },
  })
}
export function useBulkDeleteContactMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteContactFormData) => {
      const response = await apiClient.post(
        `/contacts/bulk-delete`,
        credentials
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'contacts-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('contacts-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CONTACT],
      })
      toast.success('Kontak berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('contacts-toast')
      toast.error('Kontak gagal dihapus.')
    },
  })
}
