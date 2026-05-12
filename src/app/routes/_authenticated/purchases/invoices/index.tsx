import { createFileRoute } from '@tanstack/react-router'
import InvoiceLists from '@/features/purchases/invoices/invoice-lists'

export const Route = createFileRoute('/_authenticated/purchases/invoices/')({
  component: InvoiceLists,
})
