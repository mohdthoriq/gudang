import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import SalesPerProductPage from '@/features/reports/sales-per-products'

const salesPerProductSearchSchema = z.object({
  page: z.number().optional().catch(1),
  limit: z.number().optional().catch(10),
  search: z.string().optional(),
  product_category_id: z.union([z.string(), z.array(z.string())]).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/reports/sales-per-product/'
)({
  validateSearch: (search) => salesPerProductSearchSchema.parse(search),
  component: SalesPerProductPage,
})
