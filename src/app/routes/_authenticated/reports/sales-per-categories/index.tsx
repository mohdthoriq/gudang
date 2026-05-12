import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import SalesPerCategoryPage from '@/features/reports/sales-per-categories'

const salesPerCategorySearchSchema = z.object({
  page: z.number().optional().catch(1),
  limit: z.number().optional().catch(10),
  search: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/reports/sales-per-categories/'
)({
  validateSearch: (search) => salesPerCategorySearchSchema.parse(search),
  component: SalesPerCategoryPage,
})
