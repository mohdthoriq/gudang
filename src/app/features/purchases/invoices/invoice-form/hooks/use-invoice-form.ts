import { useEffect, useMemo } from 'react'
import type { AxiosError } from 'axios'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import {
  type FinanceNumber,
  FinanceNumberType,
  type PurchaseInvoice,
  PaymentStatus,
  DocumentStatus,
  type ApiResponse,
} from '@/types'
import { toast } from 'sonner'
import { useGenerateNextNumber } from '@/hooks/use-auto-numbering'
import { useUploadAttachmentsMutation } from '@/hooks/use-upload-attachments-mutation'
import {
  CreateInvoiceSchema,
  UpdateInvoiceSchema,
  type CreateInvoiceFormData,
  type UpdateInvoiceFormData,
} from '../types/invoice-form.schema'
import {
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} from './use-invoice-form-mutation'

type UseInvoiceFormProps = {
  currentRow?: PurchaseInvoice
  autoNumbering?: FinanceNumber | null
}

export function useInvoiceForm({
  currentRow,
  autoNumbering,
}: UseInvoiceFormProps) {
  const isEdit = !!currentRow
  const navigate = useNavigate()

  const defaultValues = useMemo(
    () =>
      isEdit && currentRow
        ? {
            id: currentRow.id,
            invoice_number: currentRow.invoice_number,
            vendor_id: currentRow.vendor?.id ?? '',
            payment_term_id: currentRow.payment_term?.id ?? undefined,
            payment_status: currentRow.payment_status,
            document_status: currentRow.document_status,
            currency: currentRow.currency,
            subtotal: Number(currentRow.subtotal),
            tax_total: Number(currentRow.tax_total),
            total: Number(currentRow.total),
            invoice_date: currentRow.invoice_date
              ? new Date(currentRow.invoice_date)
              : new Date(),
            due_date: currentRow.due_date
              ? new Date(currentRow.due_date)
              : new Date(),
            purchase_invoice_items:
              currentRow.purchase_invoice_items?.map((item) => ({
                id: item.id,
                product_id: item.product?.id ?? undefined,
                description: item.description || undefined,
                quantity: Number(item.quantity) || 1,
                tax_id: item.tax?.id ?? undefined,
                unit_price: Number(item.unit_price) || 0,
                discount: Number(item.discount) || undefined,
                line_total: Number(item.line_total) || 0,
              })) || [],
            tags:
              currentRow.tags?.map((tag: string | { id: string }) =>
                typeof tag === 'object' ? tag.id : tag
              ) || [],
            additional_discounts: currentRow.additional_discounts || [],
            transaction_fees: currentRow.transaction_fees || [],
            deductions: currentRow.deductions || [],
            is_tax_inclusive: currentRow.is_tax_inclusive || false,
            shipping_fee: Number(currentRow.shipping_fee) || 0,
            shipping_date: currentRow.shipping_date
              ? new Date(currentRow.shipping_date)
              : undefined,
            expedition_id: currentRow.expedition_id || undefined,
            tracking_number: currentRow.tracking_number || '',
          }
        : {
            invoice_number: autoNumbering?.format ?? '',
            vendor_id: '',
            payment_term_id: undefined,
            currency: 'IDR',
            subtotal: 0,
            tax_total: 0,
            total: 0,
            payment_status: PaymentStatus.unpaid,
            document_status: DocumentStatus.draft,
            invoice_date: new Date(),
            due_date: new Date(),
            purchase_invoice_items: [
              {
                product_id: '',
                description: '',
                quantity: 1,
                unit_price: 0,
                tax_id: '',
                discount: undefined,
                line_total: 0,
              },
            ],
            tags: [],
            additional_discounts: [],
            transaction_fees: [],
            deductions: [],
            is_tax_inclusive: false,
            shipping_fee: 0,
            shipping_date: undefined,
            expedition_id: undefined,
            tracking_number: '',
          },
    [currentRow, isEdit, autoNumbering]
  )

  const form = useForm<CreateInvoiceFormData | UpdateInvoiceFormData>({
    resolver: zodResolver(isEdit ? UpdateInvoiceSchema : CreateInvoiceSchema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset(defaultValues)
    } else if (!isEdit && autoNumbering) {
      form.reset(defaultValues)
    }
  }, [currentRow, isEdit, autoNumbering, form, defaultValues])

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'purchase_invoice_items',
  })

  const createMutation = useCreateInvoiceMutation()
  const generateNextNumber = useGenerateNextNumber()
  const updateMutation = useUpdateInvoiceMutation()
  const uploadAttachments = useUploadAttachmentsMutation()

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = createMutation.error || updateMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>).response?.data.message ||
        'Terjadi kesalahan saat menyimpan data'
      : undefined) ||
    (firstError
      ? firstError.message || 'Terjadi kesalahan pada input'
      : undefined)

  const onSubmit = async (data: CreateInvoiceFormData) => {
    try {
      let attachmentUrls: string[] = []

      // 1. Upload files first if any
      const filesToUpload = (data.images || []).filter(
        (item) => item instanceof File
      ) as File[]

      if (filesToUpload.length > 0) {
        const uploadResponse = await uploadAttachments.mutateAsync({
          feature: 'purchase-invoices',
          images: filesToUpload,
        })
        attachmentUrls = uploadResponse.data?.urls || []
      }

      // 2. Prepare final payload with uploaded URLs
      const payload = {
        ...data,
        images: attachmentUrls,
      }

      if (isEdit && currentRow) {
        const updateData: UpdateInvoiceFormData = {
          ...payload,
          id: currentRow.id,
        } as unknown as UpdateInvoiceFormData
        const response = await updateMutation.mutateAsync(updateData)

        form.reset(data)
        navigate({
          to: `/purchases/invoices/detail`,
          state: { currentRowId: response.data.id } as Record<string, unknown>,
        })
      } else {
        const response = await createMutation.mutateAsync(
          payload as unknown as CreateInvoiceFormData
        )

        await generateNextNumber.mutateAsync(FinanceNumberType.purchase_invoice)
        form.reset()
        navigate({
          to: `/purchases/invoices/detail`,
          state: { currentRowId: response.data.id } as Record<string, unknown>,
        })
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan sistem'
      toast.error(message)
    }
  }

  return {
    form,
    fields,
    append,
    remove,
    update,
    onSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isEdit,
    errorMessage,
  }
}
