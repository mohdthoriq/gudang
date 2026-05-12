import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { AdminDashboard } from '@/features/admin/dashboard'

const dashboardSearchSchema = z.object({
  period: z.enum(['month', 'year']).optional().default('month'),
  year: z.number().optional().default(new Date().getFullYear()),
  month: z.number().min(0).max(12).optional(),
})

export type DashboardSearch = z.infer<typeof dashboardSearchSchema>

export const Route = createFileRoute('/_authenticated/admin/dashboard/')({
  validateSearch: (search) => dashboardSearchSchema.parse(search),
  component: AdminDashboard,
})
