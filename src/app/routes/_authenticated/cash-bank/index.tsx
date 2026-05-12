import { createFileRoute } from '@tanstack/react-router'
import CashBankOverviewPage from '@/features/cash-bank/cash-bank-list'

export const Route = createFileRoute('/_authenticated/cash-bank/')({
  component: CashBankOverviewPage,
})
