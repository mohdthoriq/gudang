import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type ExpensesPaymentsFormData,
  expensesPaymentsSchema,
  type ExpensesPaymentsUpdateFormData,
} from '../types/expenses-payments.schema'
import {
  useCreateExpensesPaymentMutation,
  useUpdateExpensesPaymentMutation,
} from './use-expenses-payments.mutation'

type UseExpensesPaymentsFormProps = {
  expenseId: string
  defaultAmount?: number
  currentRow?: ExpensesPaymentsUpdateFormData
}

export function useExpensesPaymentsForm({
  expenseId,
  defaultAmount,
  currentRow,
}: UseExpensesPaymentsFormProps) {
  const isUpdate = !!currentRow
  const form = useForm<ExpensesPaymentsFormData>({
    resolver: zodResolver(
      expensesPaymentsSchema.refine(
        (data) => data.amount <= (defaultAmount || 0),
        {
          message: `Jumlah pembayaran tidak boleh melebihi sisa tagihan (${(
            defaultAmount || 0
          ).toLocaleString()})`,
          path: ['amount'],
        }
      )
    ),
    defaultValues: isUpdate
      ? {
          payment_date: currentRow?.payment_date
            ? new Date(currentRow.payment_date)
            : new Date(),
          amount: currentRow?.amount ?? 0,
          account_id: currentRow?.account_id ?? undefined,
          note: currentRow?.note ?? '',
          tags: currentRow?.tags ?? null,
          expense_id: currentRow?.expense_id ?? expenseId,
        }
      : {
          payment_date: new Date(),
          amount: defaultAmount || 0,
          account_id: undefined,
          note: '',
          tags: [],
          expense_id: expenseId,
        },
  })

  const createMutation = useCreateExpensesPaymentMutation(expenseId)
  const updateMutation = useUpdateExpensesPaymentMutation()

  useEffect(() => {
    if (defaultAmount !== undefined) {
      form.setValue('amount', defaultAmount)
    }
  }, [defaultAmount, form])

  const onSubmit = async (data: ExpensesPaymentsFormData) => {
    if (isUpdate) {
      const UpdateData: ExpensesPaymentsUpdateFormData = {
        id: currentRow?.id,
        ...data,
      }
      await updateMutation.mutateAsync(UpdateData)
    } else {
      await createMutation.mutateAsync(data)
    }
    const remaining = (defaultAmount || 0) - data.amount

    form.reset({
      payment_date: new Date(),
      amount: remaining > 0 ? remaining : 0,
      account_id: undefined,
      note: '',
      tags: [],
      expense_id: expenseId,
    })
  }

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending,
  }
}
