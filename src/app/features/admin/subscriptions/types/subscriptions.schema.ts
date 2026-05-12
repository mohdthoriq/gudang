import { z } from 'zod'

export enum StatusSubscriptions {
  Active = 'active',
  Expired = 'expired',
}

export const createSubscriptionSchema = z.object({
  company_id: z.uuid().min(1, 'Company is required'),
  plan_id: z.uuid().min(1, 'Plan is required'),
  start_date: z.date(),
  end_date: z.date().nullable(),
  status: z.enum(StatusSubscriptions),
})

export type CreateSubscriptionFormData = z.infer<
  typeof createSubscriptionSchema
>

export const updateSubscriptionSchema = z.object({
  company_id: z.uuid().min(1, 'Company is required'),
  plan_id: z.uuid().min(1, 'Plan is required'),
  start_date: z.date(),
  end_date: z.date().nullable(),
  status: z.enum(StatusSubscriptions),
})

export type UpdateSubscriptionFormData = z.infer<
  typeof updateSubscriptionSchema
>

export const deleteSubscriptionSchema = z.object({
  id: z.uuid(),
})

export type DeleteSubscriptionFormData = z.infer<
  typeof deleteSubscriptionSchema
>

export const bulkDeleteSubscriptionSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeleteSubscriptionFormData = z.infer<
  typeof bulkDeleteSubscriptionSchema
>
