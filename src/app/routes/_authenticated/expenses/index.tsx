import { createFileRoute } from '@tanstack/react-router'
import ExpensesLists from '@/features/expenses/expenses-lists'

export const Route = createFileRoute('/_authenticated/expenses/')({
  component: ExpensesLists,
})
