import { createFileRoute } from '@tanstack/react-router'
import { SalesOverview } from '@/features/sales/overview'

export const Route = createFileRoute('/_authenticated/sales/overview/')({
  component: SalesOverview,
})
