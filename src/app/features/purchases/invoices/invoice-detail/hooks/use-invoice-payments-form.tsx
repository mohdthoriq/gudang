import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FinanceNumberType, type FinanceNumber } from '@/types'
import {
  type InvoicePaymentsFormData,
  invoicePaymentsSchema,
  type UpdateInvoicePaymentsFormData,
} from '../types/invoice-payments.schema'
import {
  useCreateInvoicePaymentMutation,
  useUpdateInvoicePaymentMutation,
} from './use-invoice-payments.mutation'
import { useGenerateNextNumber } from '@/hooks/use-auto-numbering'

type UseInvoicePaymentsFormProps = {
  invoiceId: string
  defaultAmount?: number
  defaultNumber?: FinanceNumber | null
  currentRow?: UpdateInvoicePaymentsFormData
}

export function useInvoicePaymentsForm({
  invoiceId,
  defaultAmount,
  defaultNumber,
  currentRow,
}: UseInvoicePaymentsFormProps) {
  const isEdit = !!currentRow

  const form = useForm<InvoicePaymentsFormData>({
    resolver: zodResolver(
      invoicePaymentsSchema.refine(
        (data) => data.amount <= (defaultAmount || 0),
        {
          message: `Jumlah pembayaran tidak boleh melebihi sisa tagihan (${(
            defaultAmount || 0
          ).toLocaleString()})`,
          path: ['amount'],
        }
      )
    ),
    defaultValues: isEdit
      ? {
          payment_date: currentRow?.payment_date
            ? new Date(currentRow.payment_date)
            : new Date(),
          amount: currentRow?.amount ?? 0,
          account_id: currentRow?.account_id ?? undefined,
          reference_no: currentRow?.reference_no ?? '',
          note: currentRow?.note ?? '',
          tags: currentRow?.tags ?? [],
          purchase_invoice_id: currentRow?.purchase_invoice_id ?? invoiceId,
        }
      : {
          payment_date: new Date(),
          amount: defaultAmount || 0,
          account_id: undefined,
          reference_no: defaultNumber?.format || '',
          note: '',
          tags: undefined,
          purchase_invoice_id: invoiceId,
        },
  })

  const createMutation = useCreateInvoicePaymentMutation(invoiceId)
  const generateNextNumber = useGenerateNextNumber()
  const updateMutation = useUpdateInvoicePaymentMutation()

  useEffect(() => {
    if (defaultAmount !== undefined) {
      form.setValue('amount', defaultAmount)
    }
    if (defaultNumber !== undefined) {
      form.setValue('reference_no', defaultNumber?.format || '')
    }
  }, [defaultAmount, defaultNumber, form])

  const onSubmit = async (data: InvoicePaymentsFormData) => {
    if (isEdit) {
      const updateData: UpdateInvoicePaymentsFormData = {
        id: currentRow.id,
        ...data,
      }
      await updateMutation.mutateAsync(updateData)
    } else {
      await createMutation.mutateAsync(data)
    }
    form.reset({
      payment_date: new Date(),
      amount: defaultAmount || 0,
      account_id: undefined,
      reference_no: defaultNumber?.format || '',
      note: '',
      tags: undefined,
      purchase_invoice_id: invoiceId,
    })
    generateNextNumber.mutate(FinanceNumberType.purchase_payment)
  }

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending,
  }
}
