import { createFileRoute } from '@tanstack/react-router'
import TransactionTypes from '@/features/admin/transaction-types'

export const Route = createFileRoute(
  '/_authenticated/admin/transaction-types/',
)({
  component: TransactionTypes,
})

