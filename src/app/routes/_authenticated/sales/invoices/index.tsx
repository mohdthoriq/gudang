import { createFileRoute } from '@tanstack/react-router'
import InvoiceLists from '@/features/sales/invoices/invoice-lists'

export const Route = createFileRoute('/_authenticated/sales/invoices/')({
  component: InvoiceLists,
})
