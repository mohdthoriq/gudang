import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Units from '@/features/settings/units'

const unitSearchSchema = z.object({
  page: z.coerce.number().min(1).optional().catch(1),
  limit: z.coerce.number().min(1).optional().catch(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/settings/units/')({
  validateSearch: unitSearchSchema,
  component: Units,
})
