import { useWatch, useFormContext } from 'react-hook-form'
import type { Tax } from '@/types'
import { calculateTotals } from '../lib/calculateTotal'
import type {
  CreateSalesOrderFormData,
  UpdateSalesOrderFormData,
} from '../types/order-form.schema'

export function useOrderTotals(taxes: Tax[]) {
  const form = useFormContext<CreateSalesOrderFormData | UpdateSalesOrderFormData>()

  const [orderItems, additionalDiscounts, transactionFees] =
    useWatch({
      control: form.control,
      name: [
        'sales_order_items',
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
