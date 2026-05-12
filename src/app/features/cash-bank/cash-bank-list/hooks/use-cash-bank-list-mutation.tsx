import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import { CashBankListsContext } from '../components/cash-bank-list-provider'
import {
  type UpdateCashBankListFormData,
  type CreateCashBankListFormData,
} from '../types/cash-bank-list.schema'

export function useCreateCashBankListMutation() {
  const context = useContext(CashBankListsContext)
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateCashBankListFormData) => {
      const response = await apiClient.post(`cash-bank/transfer`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'cash-bank-lists-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('cash-bank-lists-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CASH_BANK],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.ACCOUNT],
      })
      toast.success('Transfer dana berhasil ditambahkan')
      context?.setOpen(null)

      // Navigate to detail page with transaction ID and account ID
      navigate({
        to: '/cash-bank/detail',
        search: {
          currentRowId: data.data.id,
          accountId: context?.paginationParams?.id,
        },
      })
    },
    onError: () => {
      toast.dismiss('cash-bank-lists-toast')
      toast.error('Transfer dana gagal ditambahkan')
    },
  })
}
export function useUpdateCashBankListMutation() {
  const context = useContext(CashBankListsContext)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateCashBankListFormData) => {
      const response = await apiClient.put(`cash-bank/transfer`, data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'cash-bank-lists-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('cash-bank-lists-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CASH_BANK],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.ACCOUNT],
      })
      toast.success('Transfer dana berhasil diperbarui')
      context?.setOpen(null)
    },
    onError: () => {
      toast.dismiss('cash-bank-lists-toast')
      toast.error('Transfer dana gagal diperbarui')
    },
  })
}
