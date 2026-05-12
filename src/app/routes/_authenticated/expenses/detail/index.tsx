import { createFileRoute } from '@tanstack/react-router'
import { ExpensesDetail } from '@/features/expenses/expenses-detail'

export const Route = createFileRoute('/_authenticated/expenses/detail/')({
  component: ExpensesDetail,
})
