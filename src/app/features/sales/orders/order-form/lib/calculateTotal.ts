import type { useForm } from 'react-hook-form'
import type { Tax } from '@/types'
import {
  type CreateSalesOrderFormData,
  type UpdateSalesOrderFormData,
} from '../types/order-form.schema'
import { UnitsType } from '@/features/sales/invoices/invoice-form/types/invoice-form.schema'

export const calculateTotals = (
  form: Pick<
    ReturnType<typeof useForm<CreateSalesOrderFormData | UpdateSalesOrderFormData>>,
    'setValue' | 'getValues'
  >,
  items: (CreateSalesOrderFormData | UpdateSalesOrderFormData)['sales_order_items'],
  additionalDiscounts: (
    | CreateSalesOrderFormData
    | UpdateSalesOrderFormData
  )['additional_discounts'],
  transactionFees: (
    | CreateSalesOrderFormData
    | UpdateSalesOrderFormData
  )['transaction_fees'],
  taxes: Tax[]
) => {
  let newSubtotal = 0
  let newTaxTotal = 0
  let newTotal = 0
  const taxBreakdown: Record<string, number> = {}

  items.forEach((item) => {
    const quantity = Number(item.quantity) || 0
    const unitPrice = Number(item.unit_price) || 0
    const discount = Number(item.discount) || 0

    const discountAmount = (quantity * unitPrice * discount) / 100
    const lineTotal = quantity * unitPrice - discountAmount
    newSubtotal += lineTotal

    if (item.tax_id) {
      const tax = taxes.find((t) => t.id === item.tax_id)
      if (tax) {
        const itemTax = (lineTotal * tax.rate) / 100
        const signedItemTax = tax.is_withholding ? -itemTax : itemTax
        newTaxTotal += signedItemTax

        if (tax.name) {
          taxBreakdown[tax.name] = (taxBreakdown[tax.name] || 0) + signedItemTax
        }
      }
    }
  })

  let additionalDiscountsTotal = 0
  additionalDiscounts?.forEach((discount, index) => {
    const value = Number(discount.value) || 0
    const amount =
      discount.type === UnitsType.percent ? (newSubtotal * value) / 100 : value
    additionalDiscountsTotal += amount
    if (discount.amount !== amount) {
      form.setValue(`additional_discounts.${index}.amount`, amount)
    }
  })

  let transactionFeesTotal = 0
  transactionFees?.forEach((fee, index) => {
    const value = Number(fee.value) || 0
    const amount =
      fee.type === UnitsType.percent ? (newSubtotal * value) / 100 : value
    transactionFeesTotal += amount
    if (fee.amount !== amount) {
      form.setValue(`transaction_fees.${index}.amount`, amount)
    }
  })

  newTotal =
    newSubtotal -
    additionalDiscountsTotal +
    newTaxTotal +
    transactionFeesTotal +
    Number(form.getValues('shipping_fee') || 0)

  // Down Payment calculation
  const dpType = form.getValues('dp_type')
  const dpValue = Number(form.getValues('dp_value') || 0)
  let dpAmount = dpValue
  if (dpType === 'percent') {
    dpAmount = (newTotal * dpValue) / 100
  }
  
  if (form.getValues('dp_amount') !== dpAmount) {
     form.setValue('dp_amount', dpAmount)
  }

  if (form.getValues('subtotal') !== newSubtotal)
    form.setValue('subtotal', newSubtotal)
  if (form.getValues('tax_total') !== newTaxTotal)
    form.setValue('tax_total', newTaxTotal)
  if (form.getValues('total') !== newTotal) form.setValue('total', newTotal)

  return {
    subtotal: newSubtotal,
    taxTotal: newTaxTotal,
    total: newTotal,
    dpAmount,
    taxBreakdown,
  }
}
