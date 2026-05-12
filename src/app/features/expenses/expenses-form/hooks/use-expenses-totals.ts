import { useEffect, useMemo } from 'react'
import { useWatch, useFormContext } from 'react-hook-form'
import type { Tax } from '@/types'
import { calculateTotals } from '../lib/calculateTotal'
import type {
  CreateExpenseFormData,
  UpdateExpenseFormData,
} from '../types/expenses-form.schema'

export function useExpensesTotals(taxes: Tax[]) {
  const form = useFormContext<CreateExpenseFormData | UpdateExpenseFormData>()

  const [expenseItems, deductions = [], includeTax] = useWatch({
    control: form.control,
    name: ['expense_items', 'deductions', 'include_tax'],
  })

  // Calculate totals using the current form values
  const totals = useMemo(
    () => calculateTotals(expenseItems, deductions, taxes, !!includeTax),
    [expenseItems, deductions, taxes, includeTax]
  )

  useEffect(() => {
    // Sync subtotal, tax_total and total
    if (form.getValues('subtotal') !== totals.subtotal) {
      form.setValue('subtotal', totals.subtotal)
    }
    if (form.getValues('tax_total') !== totals.taxTotal) {
      form.setValue('tax_total', totals.taxTotal)
    }
    if (form.getValues('total') !== totals.total) {
      form.setValue('total', totals.total)
    }

    // Sync deductions amounts
    const currentDeductions = form.getValues('deductions') || []
    totals.deductions?.forEach((amount, index) => {
      if (index < currentDeductions.length) {
        if (form.getValues(`deductions.${index}.amount`) !== amount) {
          form.setValue(`deductions.${index}.amount`, amount)
        }
      }
    })
  }, [form, totals])

  return totals
}
