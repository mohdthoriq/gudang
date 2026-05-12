import { useWatch, useFormContext } from 'react-hook-form'
import type { Tax } from '@/types'
import { calculateCashBankTotals } from '../lib/cash-bank-calculate'
import type { CashBankFormFormData } from '../types/cash-bank-form.schema'

export function useCashBankTotals(taxes: Tax[]) {
  const form = useFormContext<CashBankFormFormData>()

  const items = useWatch({
    control: form.control,
    name: 'items',
  })

  const withholdings = useWatch({
    control: form.control,
    name: 'withholdings',
  })

  const includeTax = useWatch({
    control: form.control,
    name: 'include_tax',
  })

  return calculateCashBankTotals(form, items, withholdings, taxes, includeTax)
}
