import type { useForm } from 'react-hook-form'
import type { Tax } from '@/types'
import type { CashBankFormFormData } from '../types/cash-bank-form.schema'

export const calculateCashBankTotals = (
  form: Pick<
    ReturnType<typeof useForm<CashBankFormFormData>>,
    'setValue' | 'getValues'
  >,
  items: CashBankFormFormData['items'],
  withholdings: CashBankFormFormData['withholdings'],
  taxes: Tax[],
  includeTax: boolean
) => {
  let subtotal = 0
  let taxTotal = 0
  const taxBreakdown: Record<string, number> = {}

  items.forEach((item) => {
    const amount = Number(item.amount) || 0
    let lineTax = 0

    if (item.tax_id) {
      const tax = taxes.find((t) => t.id === item.tax_id)
      if (tax) {
        if (includeTax) {
          const netAmount = amount / (1 + tax.rate / 100)
          lineTax = amount - netAmount
          subtotal += netAmount
        } else {
          lineTax = (amount * tax.rate) / 100
          subtotal += amount
        }

        taxTotal += lineTax
        if (tax.name) {
          taxBreakdown[tax.name] = (taxBreakdown[tax.name] || 0) + lineTax
        }
      } else {
        subtotal += amount
      }
    } else {
      subtotal += amount
    }
  })

  let withholdingTotal = 0
  withholdings.forEach((w) => {
    // Note: The UI should handle calculating withholding.amount based on type/value
    // before it gets here, or we can do it here if needed.
    // For now, let's assume it's already calculated in the form state.
    withholdingTotal += Number(w.amount) || 0
  })

  const total = subtotal + taxTotal - withholdingTotal

  // Update form values if they changed
  if (Math.abs(form.getValues('tax_total') - taxTotal) > 0.01) {
    form.setValue('tax_total', taxTotal)
  }

  return {
    subtotal,
    taxTotal,
    withholdingTotal,
    total,
    taxBreakdown,
  }
}
