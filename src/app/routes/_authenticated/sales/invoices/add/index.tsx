import { createFileRoute } from '@tanstack/react-router'
import { InvoiceFormPage } from '@/features/sales/invoices/invoice-form'

export const Route = createFileRoute('/_authenticated/sales/invoices/add/')({
  component: InvoiceFormPage,
})
