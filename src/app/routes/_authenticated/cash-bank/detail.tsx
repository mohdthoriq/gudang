import { createFileRoute } from '@tanstack/react-router'
import { CashBankDetail } from '@/features/cash-bank/cash-bank-detail'

export const Route = createFileRoute('/_authenticated/cash-bank/detail')({
  component: CashBankDetail,
})
