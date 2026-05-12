import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type CreateCashBankListFormData,
  createCashBankListSchema,
  type UpdateCashBankListFormData,
} from '../types/cash-bank-list.schema'
import {
  useCreateCashBankListMutation,
  useUpdateCashBankListMutation,
} from './use-cash-bank-list-mutation'
import { FinanceNumberType, type FinanceNumber } from '@/types'
import { useGenerateNextNumber } from '@/hooks/use-auto-numbering'

export function useCashBankListForm(
  currentRow?: UpdateCashBankListFormData,
  autoNumbering?: FinanceNumber | null,
  onSuccess?: () => void
) {
  const isEdit = !!currentRow

  const form = useForm<CreateCashBankListFormData>({
    resolver: zodResolver(createCashBankListSchema),
    defaultValues: isEdit
      ? {
          from_account_id: currentRow?.from_account_id || '',
          to_account_id: currentRow?.to_account_id || '',
          transaction_number: currentRow?.transaction_number || '',
          tags: currentRow?.tags || null,
          amount: currentRow?.amount || 0,
          date: currentRow?.date ? new Date(currentRow.date) : new Date(),
          note: currentRow?.note || '',
        }
      : {
          from_account_id: '',
          to_account_id: '',
          transaction_number: autoNumbering?.format || '',
          tags: null,
          amount: 0,
          date: new Date(),
          note: '',
        },
  })
 
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        from_account_id: currentRow?.from_account_id || '',
        to_account_id: currentRow?.to_account_id || '',
        transaction_number: currentRow?.transaction_number || '',
        tags: currentRow?.tags || null,
        amount: currentRow?.amount || 0,
        date: currentRow?.date ? new Date(currentRow.date) : new Date(),
        note: currentRow?.note || '',
      })
    } else if (!isEdit && autoNumbering) {
      form.reset({
        from_account_id: '',
        to_account_id: '',
        transaction_number: autoNumbering?.format || '',
        tags: null,
        amount: 0,
        date: new Date(),
        note: '',
      })
    }
  }, [currentRow, isEdit, autoNumbering, form])

  const createMutation = useCreateCashBankListMutation()
  const generateNextNumber = useGenerateNextNumber()
  const updateMutation = useUpdateCashBankListMutation()

  const onSubmit = async (data: CreateCashBankListFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdateCashBankListFormData = {
        id: currentRow?.id,
        ...data,
      }
      await updateMutation.mutateAsync(updateData)
    } else {
      await createMutation.mutateAsync(data)
      await generateNextNumber.mutateAsync(FinanceNumberType.bank_transfer)
    }
    form.reset()
    onSuccess?.()
  }

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending,
  }
}
