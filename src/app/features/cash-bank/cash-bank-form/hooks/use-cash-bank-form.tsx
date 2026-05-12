import { useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearch } from '@tanstack/react-router'
import {
  type CashBankFormEditData,
  cashBankFormSchema,
  type CashBankFormFormData,
} from '../types/cash-bank-form.schema'
import {
  useCreateSpendMoneyMutation,
  useCreateReceiveMoneyMutation,
  useUpdateSpendMoneyMutation,
  useUpdateReceiveMoneyMutation,
} from './use-cash-bank-form-mutation'
import { FinanceNumberType, type FinanceNumber } from '@/types'
import { useGenerateNextNumber } from '@/hooks/use-auto-numbering'

type UseCashBankFormProps = {
  type: 'spend' | 'receive'
  currentRow?: CashBankFormEditData
}

export function useCashBankForm({
  type,
  currentRow,
  autoNumbering,
}: UseCashBankFormProps & { autoNumbering?: FinanceNumber | null }) {
  const search = useSearch({ strict: false }) as { bank_account_id?: string }

  const defaultValues = useMemo<CashBankFormFormData>(() => {
    if (currentRow) {
      return currentRow
    }
    return {
      bank_account_id: search?.bank_account_id || '',
      transaction_number: autoNumbering?.format || '',
      date: new Date(),
      description: '',
      contact_id: null,
      note: '',
      tags: null,
      include_tax: false,
      tax_total: 0,
      items: [
        {
          account_id: '',
          amount: 0,
          description: '',
          tax_id: null,
        },
      ],
      withholdings: [],
    }
  }, [search?.bank_account_id, currentRow, autoNumbering])

  const form = useForm<CashBankFormFormData>({
    resolver: zodResolver(cashBankFormSchema),
    defaultValues,
  })
 
  useEffect(() => {
    if (currentRow) {
      form.reset(defaultValues)
    } else if (autoNumbering) {
      form.reset(defaultValues)
    }
  }, [currentRow, autoNumbering, form, defaultValues])

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const {
    fields: withholdingFields,
    append: appendWithholding,
    remove: removeWithholding,
  } = useFieldArray({
    control: form.control,
    name: 'withholdings',
  })

  const spendMutation = useCreateSpendMoneyMutation()
  const receiveMutation = useCreateReceiveMoneyMutation()
  const generateNextNumber = useGenerateNextNumber()
  const updateMutation = useUpdateSpendMoneyMutation()
  const updateReceiveMutation = useUpdateReceiveMoneyMutation()

  const isSubmitting =
    spendMutation.isPending ||
    receiveMutation.isPending ||
    updateMutation.isPending ||
    updateReceiveMutation.isPending

  const onSubmit = async (data: CashBankFormFormData) => {
    if (currentRow?.id) {
      const UpdateData = {
        id: currentRow.id,
        ...data,
      }
      if (type === 'spend') {
        await updateMutation.mutateAsync(UpdateData)
      } else {
        await updateReceiveMutation.mutateAsync(UpdateData)
      }
    } else {
      if (type === 'spend') {
        await spendMutation.mutateAsync(data)
      } else {
        await receiveMutation.mutateAsync(data)
      }
      await generateNextNumber.mutateAsync(FinanceNumberType.bank_transaction)
    }
  }

  return {
    form,
    itemFields,
    appendItem,
    removeItem,
    withholdingFields,
    appendWithholding,
    removeWithholding,
    onSubmit,
    isSubmitting,
  }
}
