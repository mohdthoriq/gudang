import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PaymentTerms } from '@/features/settings/payment-terms'

const searchSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  name: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/settings/payment-terms/')(
  {
    component: PaymentTerms,
    validateSearch: (search) => searchSchema.parse(search),
  }
)
