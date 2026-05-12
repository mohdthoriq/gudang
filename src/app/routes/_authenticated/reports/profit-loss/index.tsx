import { createFileRoute } from '@tanstack/react-router'
import ProfitLossPage from '@/features/reports/profit-loss'

export const Route = createFileRoute('/_authenticated/reports/profit-loss/')({
  component: ProfitLossPage,
})
