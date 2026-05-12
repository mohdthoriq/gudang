import { useEffect, useMemo } from 'react'
import { type AxiosError } from 'axios'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import {
  type FinanceNumber,
  FinanceNumberType,
  type SalesOrder,
  PaymentStatus,
  DocumentStatus,
  type ApiResponse,
} from '@/types'
import {
  CreateSalesOrderSchema,
  UpdateSalesOrderSchema,
  type CreateSalesOrderFormData,
  type UpdateSalesOrderFormData,
} from '../types/order-form.schema'
import { toast } from 'sonner'
import { useGenerateNextNumber } from '@/hooks/use-auto-numbering'
import { useCreateSalesOrderMutation, useUpdateSalesOrderMutation } from './use-order-form-mutation'

type UseOrderFormProps = {
  currentRow?: SalesOrder
  autoNumbering?: FinanceNumber | null
}

export function useOrderForm({
  currentRow,
  autoNumbering,
}: UseOrderFormProps) {
  const isEdit = !!currentRow
  const navigate = useNavigate()

  const defaultValues = useMemo(
    () =>
      isEdit && currentRow
        ? {
            shift_id: currentRow.shift_id || undefined,
            id: currentRow.id,
            order_number: currentRow.order_number ?? '',
            customer_id: currentRow.customer?.id ?? currentRow.customer_id ?? '',
            payment_term_id: currentRow.payment_term?.id ?? currentRow.payment_term_id ?? undefined,
            payment_status: currentRow.payment_status,
            document_status: currentRow.document_status,
            currency: currentRow.currency ?? 'IDR',
            subtotal: Number(currentRow.subtotal),
            tax_total: Number(currentRow.tax_total),
            total: Number(currentRow.total),
            order_date: currentRow.order_date ? new Date(currentRow.order_date) : new Date(),
            due_date: currentRow.due_date ? new Date(currentRow.due_date) : new Date(),
            sales_order_items: currentRow.sales_order_items?.map((item) => ({
              id: item.id,
              product_id: item.product?.id ?? item.product_id ?? '',
              description: item.description || '',
              quantity: Number(item.quantity) || 1,
              tax_id: item.tax?.id ?? item.tax_id ?? undefined,
              unit_price: Number(item.unit_price) || 0,
              purchase_price: Number(item.purchase_price) || 0,
              discount: Number(item.discount) || undefined,
              line_total: Number(item.line_total) || 0,
            })) || [],
            tags: currentRow.tags?.map((tag: string | { id: string }) => typeof tag === 'object' ? tag.id : tag).filter(Boolean) || [],
            additional_discounts: currentRow.additional_discounts || [],
            transaction_fees: currentRow.transaction_fees || [],
            is_tax_inclusive: !!currentRow.is_tax_inclusive,
            is_pos: !!currentRow.is_pos,
            shipping_fee: Number(currentRow.shipping_fee) || 0,
            shipping_date: currentRow.shipping_date ? new Date(currentRow.shipping_date) : undefined,
            expedition_id: currentRow.expedition_id || undefined,
            tracking_number: currentRow.tracking_number || '',
            dp_type: currentRow.dp_type || 'fixed',
            dp_value: Number(currentRow.dp_value) || 0,
            dp_amount: Number(currentRow.dp_amount) || 0,
            dp_account_id: currentRow.dp_account_id || undefined,
            attachments: currentRow.attachments || [],
            note: currentRow.note || '',
          }
        : {
            shift_id: undefined,
            order_number: autoNumbering?.format || '',
            customer_id: '',
            payment_term_id: undefined,
            currency: 'IDR',
            subtotal: 0,
            tax_total: 0,
            total: 0,
            payment_status: PaymentStatus.unpaid,
            document_status: DocumentStatus.draft,
            order_date: new Date(),
            due_date: new Date(),
            sales_order_items: [
              {
                product_id: '',
                description: '',
                quantity: 1,
                unit_price: 0,
                purchase_price: 0,
                tax_id: '',
                discount: 0,
                line_total: 0,
              },
            ],
            tags: [],
            additional_discounts: [],
            transaction_fees: [],
            is_tax_inclusive: false,
            is_pos: false,
            shipping_fee: 0,
            shipping_date: undefined,
            expedition_id: undefined,
            tracking_number: '',
            dp_type: 'fixed' as const,
            dp_value: 0,
            dp_amount: 0,
            dp_account_id: undefined,
            attachments: [],
            note: '',
          },
    [currentRow, isEdit, autoNumbering]
  )

  const form = useForm<CreateSalesOrderFormData | UpdateSalesOrderFormData>({
    resolver: zodResolver(isEdit ? UpdateSalesOrderSchema : CreateSalesOrderSchema),
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
    name: 'sales_order_items',
  })

  const createMutation = useCreateSalesOrderMutation()
  const generateNextNumber = useGenerateNextNumber()
  const updateMutation = useUpdateSalesOrderMutation()

  const errors = form.formState.errors
  const mutationError = createMutation.error || updateMutation.error
  const firstError = Object.values(errors)[0]
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>).response?.data.message ||
        'Terjadi kesalahan saat menyimpan data'
      : undefined) ||
    (firstError && typeof firstError === 'object' && firstError !== null && 'message' in firstError
      ? (firstError.message as string)
      : undefined)

  const onSubmit = async (data: CreateSalesOrderFormData | UpdateSalesOrderFormData) => {
    try {
      if (isEdit && 'id' in data && data.id) {
        await updateMutation.mutateAsync(data as UpdateSalesOrderFormData)
        navigate({
          to: `/sales/orders`,
        })
      } else {
        await createMutation.mutateAsync(data as CreateSalesOrderFormData)
        await generateNextNumber.mutateAsync(FinanceNumberType.sales_order)
        form.reset()
        navigate({
          to: `/sales/orders`,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem'
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
