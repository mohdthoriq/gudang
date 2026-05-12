import { createFileRoute } from '@tanstack/react-router'
import CashBankTransactionListPage from '@/features/cash-bank/cash-bank-list/pages/cash-bank-list'

export const Route = createFileRoute('/_authenticated/cash-bank/$accountName')({
  component: CashBankTransactionListPage,
})
