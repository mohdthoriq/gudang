import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Taxes } from '@/features/settings/taxes'

const searchSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  name: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/settings/taxes/')({
  component: Taxes,
  validateSearch: (search) => searchSchema.parse(search),
})
