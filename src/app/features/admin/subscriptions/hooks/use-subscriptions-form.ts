import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Subscription } from '@/types';
import { createSubscriptionSchema, StatusSubscriptions, type CreateSubscriptionFormData, type UpdateSubscriptionFormData } from '../types/subscriptions.schema';
import { useCreateSubscriptionMutation
// useUpdateSubscriptionMutation,
} from './use-subscriptions-mutation';


type useSubscriptionsFormProps = {
  currentRow?: Subscription
}

export function useSubscriptionsForm({
  currentRow,
}: useSubscriptionsFormProps): {
  form: UseFormReturn<CreateSubscriptionFormData>
  onSubmit: (data: CreateSubscriptionFormData) => Promise<void>
  isSubmitting: boolean
} {
  const isEdit = !!currentRow
  const form = useForm<CreateSubscriptionFormData>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: isEdit
      ? {
          company_id: currentRow?.company?.id,
          plan_id: currentRow?.plan_id ?? undefined,
          status: currentRow?.Subscriptions_status,
          start_date: new Date(currentRow?.start_date),
          end_date: currentRow?.end_date
            ? new Date(currentRow?.end_date)
            : null,
        }
      : {
          company_id: '',
          plan_id: '',
          status: StatusSubscriptions.Active,
          start_date: new Date(),
          end_date: null,
        },
  })

  const createMutation = useCreateSubscriptionMutation()
  // const updateMutation = useUpdateSubscriptionMutation()

  const onSubmit = async (data: CreateSubscriptionFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdateSubscriptionFormData = {
        ...data,
      }
      await createMutation.mutateAsync(updateData)
      form.reset()
    } else {
      await createMutation.mutateAsync(data)
      form.reset()
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending,
  }
}