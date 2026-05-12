import { createFileRoute } from '@tanstack/react-router'
import { CashBankFormPage } from '@/features/cash-bank/cash-bank-form'

export const Route = createFileRoute('/_authenticated/cash-bank/spend')({
  component: () => <CashBankFormPage type='spend' />,
})
