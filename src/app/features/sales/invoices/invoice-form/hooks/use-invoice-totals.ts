import { useEffect, useMemo } from 'react'
import { useWatch, useFormContext } from 'react-hook-form'
import type { Tax } from '@/types'
import { calculateTotals } from '../lib/calculateTotal'
import type {
  CreateInvoiceFormData,
  UpdateInvoiceFormData,
} from '../types/invoice-form.schema'

export function useInvoiceTotals(taxes: Tax[]) {
  const form = useFormContext<CreateInvoiceFormData | UpdateInvoiceFormData>()

  const [
    invoiceItems,
    additionalDiscounts,
    transactionFees,
    deductions = [],
    shippingFee,
    isTaxInclusive,
  ] = useWatch({
    control: form.control,
    name: [
      'sales_invoice_items',
      'additional_discounts',
      'transaction_fees',
      'deductions',
      'shipping_fee',
      'is_tax_inclusive',
    ],
  })

  // Calculate totals using the current form values
  // Memoize to prevent unnecessary re-renders and re-calculations
  const totals = useMemo(
    () =>
      calculateTotals(
        invoiceItems,
        additionalDiscounts,
        transactionFees,
        deductions,
        Number(shippingFee || 0),
        taxes,
        !!isTaxInclusive
      ),
    [
      invoiceItems,
      additionalDiscounts,
      transactionFees,
      deductions,
      shippingFee,
      taxes,
      isTaxInclusive,
    ]
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

    // Sync individual item amounts
    const currentDiscounts = form.getValues('additional_discounts') || []
    totals.additionalDiscounts?.forEach((amount, index) => {
      if (index < currentDiscounts.length) {
        if (form.getValues(`additional_discounts.${index}.amount`) !== amount) {
          form.setValue(`additional_discounts.${index}.amount`, amount)
        }
      }
    })

    const currentFees = form.getValues('transaction_fees') || []
    totals.transactionFees?.forEach((amount, index) => {
      if (index < currentFees.length) {
        if (form.getValues(`transaction_fees.${index}.amount`) !== amount) {
          form.setValue(`transaction_fees.${index}.amount`, amount)
        }
      }
    })

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
