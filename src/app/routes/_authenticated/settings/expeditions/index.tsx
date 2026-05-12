import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Expeditions from '@/features/settings/expeditions'

const expeditionSearchSchema = z.object({
  page: z.coerce.number().min(1).optional().catch(1),
  limit: z.coerce.number().min(1).optional().catch(10),
  search: z.string().optional().catch(''),
  is_active: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/settings/expeditions/')({
  validateSearch: expeditionSearchSchema,
  component: Expeditions,
})
