import { type AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FinanceNumberType, type ApiResponse } from '@/types'
import { useGenerateNextNumber } from '@/hooks/use-auto-numbering'
import { toast } from 'sonner'
import { z } from 'zod'
import { useCreatePurchasesOrderPaymentMutation } from './use-order-payments.mutation'

const OrderPaymentSchema = z.object({
  amount: z.number().min(1, 'Jumlah harus lebih dari 0'),
  reference_no: z.string().min(1, 'Nomor referensi wajib diisi'),
  account_id: z.string().min(1, 'Akun wajib dipilih'),
  payment_date: z.date(),
  note: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

type OrderPaymentFormData = z.infer<typeof OrderPaymentSchema>

interface UseOrderPaymentsFormProps {
  orderId: string
  defaultAmount?: number
  defaultNumber?: { format: string } | null
}

export function useOrderPaymentsForm({
  orderId,
  defaultAmount = 0,
  defaultNumber,
}: UseOrderPaymentsFormProps) {
  const form = useForm<OrderPaymentFormData>({
    resolver: zodResolver(OrderPaymentSchema),
    defaultValues: {
      amount: defaultAmount,
      reference_no: defaultNumber?.format || '',
      account_id: '',
      payment_date: new Date(),
      note: '',
      tags: [],
    },
  })

  const createPaymentMutation = useCreatePurchasesOrderPaymentMutation()
  const generateNextNumber = useGenerateNextNumber()

  const onSubmit = async (data: OrderPaymentFormData) => {
    try {
      await createPaymentMutation.mutateAsync({
        id: orderId,
        data,
      })
      await generateNextNumber.mutateAsync(FinanceNumberType.sales_payment)
      form.reset({
        ...form.getValues(),
        amount: 0,
        reference_no: '',
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Gagal menyimpan pembayaran')
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: createPaymentMutation.isPending,
  }
}
