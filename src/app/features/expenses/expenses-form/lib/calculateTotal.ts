import type { Tax } from '@/types'
import { UnitsType } from '@/features/sales/invoices/invoice-form/types/invoice-form.schema'
import {
  type CreateExpenseFormData,
  type UpdateExpenseFormData,
} from '../types/expenses-form.schema'

export const calculateTotals = (
  items: (CreateExpenseFormData | UpdateExpenseFormData)['expense_items'],
  deductions: (CreateExpenseFormData | UpdateExpenseFormData)['deductions'],
  taxes: Tax[],
  includeTax: boolean
) => {
  let newSubtotal = 0
  let newTaxTotal = 0
  const taxBreakdown: Record<string, number> = {}

  items.forEach((item) => {
    const itemAmount = Number(item.amount) || 0
    let lineSubtotal = itemAmount
    let lineTax = 0

    if (item.tax_id) {
      const tax = taxes.find((t) => t.id === item.tax_id)
      if (tax) {
        if (includeTax) {
          lineSubtotal = itemAmount / (1 + tax.rate / 100)
          lineTax = itemAmount - lineSubtotal
        } else {
          lineSubtotal = itemAmount
          lineTax = (itemAmount * tax.rate) / 100
        }

        newTaxTotal += lineTax
        if (tax.name) {
          taxBreakdown[tax.name] = (taxBreakdown[tax.name] || 0) + lineTax
        }
      }
    }

    newSubtotal += lineSubtotal
  })

  let deductionsTotal = 0
  deductions?.forEach((deduction) => {
    const value = Number(deduction.value) || 0
    const amount =
      deduction.type === UnitsType.percent ? (newSubtotal * value) / 100 : value
    deductionsTotal += amount
  })

  const totalBeforeDeductions = newSubtotal + newTaxTotal
  const newTotal = totalBeforeDeductions - deductionsTotal

  return {
    subtotal: newSubtotal,
    taxTotal: newTaxTotal,
    total: newTotal,
    totalBeforeDeductions,
    taxBreakdown,
    deductions: deductions?.map((d) => {
      const value = Number(d.value) || 0
      return d.type === UnitsType.percent ? (newSubtotal * value) / 100 : value
    }),
  }
}
