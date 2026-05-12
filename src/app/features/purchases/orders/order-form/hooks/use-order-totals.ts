import { useWatch, useFormContext } from 'react-hook-form'
import type { Tax } from '@/types'
import { calculateTotals } from '../lib/calculateTotal'
import type {
  CreatePurchasesOrderFormData,
  UpdatePurchasesOrderFormData,
} from '../types/order-form.schema'

export function useOrderTotals(taxes: Tax[]) {
  const form = useFormContext<CreatePurchasesOrderFormData | UpdatePurchasesOrderFormData>()

  const [orderItems, additionalDiscounts, transactionFees] =
    useWatch({
      control: form.control,
      name: [
        'purchase_order_items',
        'additional_discounts',
        'transaction_fees',
        'dp_type',
        'dp_value',
        'shipping_fee',
      ],
    })

  return calculateTotals(
    form,
    orderItems,
    additionalDiscounts,
    transactionFees,
    taxes
  )
}
