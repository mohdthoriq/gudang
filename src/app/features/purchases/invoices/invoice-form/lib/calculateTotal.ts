import type { Tax } from '@/types'
import { UnitsType } from '@/features/sales/invoices/invoice-form/types/invoice-form.schema'
import {
  type CreateInvoiceFormData,
  type UpdateInvoiceFormData,
} from '../types/invoice-form.schema'

export const calculateTotals = (
  items: (CreateInvoiceFormData | UpdateInvoiceFormData)['purchase_invoice_items'],
  additionalDiscounts: (
    | CreateInvoiceFormData
    | UpdateInvoiceFormData
  )['additional_discounts'],
  transactionFees: (
    | CreateInvoiceFormData
    | UpdateInvoiceFormData
  )['transaction_fees'],
  deductions: (CreateInvoiceFormData | UpdateInvoiceFormData)['deductions'],
  shippingFee: number,
  taxes: Tax[],
  isTaxInclusive: boolean
) => {
  let newSubtotal = 0
  let newTaxTotal = 0
  const taxBreakdown: Record<string, number> = {}

  items.forEach((item) => {
    const quantity = Number(item.quantity) || 0
    const unitPrice = Number(item.unit_price) || 0
    const discount = Number(item.discount) || 0

    const discountAmount = (quantity * unitPrice * discount) / 100
    const grossLineTotal = quantity * unitPrice - discountAmount

    let lineSubtotal = grossLineTotal
    let lineTax = 0

    if (item.tax_id) {
      const tax = taxes.find((t) => t.id === item.tax_id)
      if (tax) {
        if (isTaxInclusive) {
          lineSubtotal = grossLineTotal / (1 + tax.rate / 100)
          lineTax = grossLineTotal - lineSubtotal
        } else {
          lineSubtotal = grossLineTotal
          lineTax = (lineSubtotal * tax.rate) / 100
        }

        const signedItemTax = tax.is_withholding ? -lineTax : lineTax
        newTaxTotal += signedItemTax

        if (tax.name) {
          taxBreakdown[tax.name] = (taxBreakdown[tax.name] || 0) + signedItemTax
        }
      }
    }

    newSubtotal += lineSubtotal
  })

  let additionalDiscountsTotal = 0
  additionalDiscounts?.forEach((discount) => {
    const value = Number(discount.value) || 0
    const amount =
      discount.type === UnitsType.percent ? (newSubtotal * value) / 100 : value
    additionalDiscountsTotal += amount
  })

  let transactionFeesTotal = 0
  transactionFees?.forEach((fee) => {
    const value = Number(fee.value) || 0
    const amount =
      fee.type === UnitsType.percent ? (newSubtotal * value) / 100 : value
    transactionFeesTotal += amount
  })

  let deductionsTotal = 0
  deductions?.forEach((deduction) => {
    const value = Number(deduction.value) || 0
    const amount =
      deduction.type === UnitsType.percent ? (newSubtotal * value) / 100 : value
    deductionsTotal += amount
  })

  const totalBeforeDeductions =
    newSubtotal -
    additionalDiscountsTotal +
    newTaxTotal +
    transactionFeesTotal +
    Number(shippingFee || 0)

  const newTotal = totalBeforeDeductions - deductionsTotal

  return {
    subtotal: newSubtotal,
    taxTotal: newTaxTotal,
    total: newTotal,
    totalBeforeDeductions,
    taxBreakdown,
    additionalDiscounts: additionalDiscounts?.map((d) => {
      const value = Number(d.value) || 0
      return d.type === UnitsType.percent ? (newSubtotal * value) / 100 : value
    }),
    transactionFees: transactionFees?.map((f) => {
      const value = Number(f.value) || 0
      return f.type === UnitsType.percent ? (newSubtotal * value) / 100 : value
    }),
    deductions: deductions?.map((d) => {
      const value = Number(d.value) || 0
      return d.type === UnitsType.percent ? (newSubtotal * value) / 100 : value
    }),
  }
}
