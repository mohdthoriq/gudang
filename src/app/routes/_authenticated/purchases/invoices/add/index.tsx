import { createFileRoute } from '@tanstack/react-router'
import { InvoiceFormPage } from '@/features/purchases/invoices/invoice-form'

export const Route = createFileRoute('/_authenticated/purchases/invoices/add/')(
  {
    component: InvoiceFormPage,
  }
)
