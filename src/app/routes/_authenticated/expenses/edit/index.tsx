import { createFileRoute } from '@tanstack/react-router'
import { ExpensesFormPage } from '@/features/expenses/expenses-form'

export const Route = createFileRoute('/_authenticated/expenses/edit/')({
  component: ExpensesFormPage,
})
