import { useLocation, useNavigate } from '@tanstack/react-router'
import { FinanceNumberType } from '@/types'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import { AttachmentCard } from '@/components/forms/attachment-card'
import { PermissionGuard } from '@/components/permission-guard'
import { InvoiceFormFallback } from './components/invoice-form-fallback'
import { useInvoiceForm } from './hooks/use-invoice-form'
import { useInvoiceFormQuery } from './hooks/use-invoice-form-query'
import { InvoiceFormActions } from './sections/form-actions'
import { InvoiceFormHeader } from './sections/form-header'
import { InvoiceFormItems } from './sections/form-items-table'
import { InvoiceFormSummary } from './sections/form-summary'
import { useDefaultNumberingQuery } from '@/hooks/use-auto-numbering'

export function InvoiceFormPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const currentRowId = (location.state as { currentRowId?: string })
    ?.currentRowId

  const currentRow = useInvoiceFormQuery({ id: currentRowId })

  const { data: invoiceAutoNumbering } = useDefaultNumberingQuery({
    type: FinanceNumberType.sales_invoice,
  })

  const invoiceForm = useInvoiceForm({
    currentRow: currentRow.data ?? undefined,
    autoNumbering: invoiceAutoNumbering,
  })

  if (currentRowId && currentRow.isLoading) {
    return (
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Memuat data invoice...</CardTitle>
        </CardHeader>
        <CardContent className='flex h-40 items-center justify-center font-medium'>
          Mohon tunggu sebentar...
        </CardContent>
      </Card>
    )
  }

  return (
    <PermissionGuard
      permission={
        invoiceForm.isEdit
          ? PERMISSION_KEY.SALES_INVOICE_EDIT
          : PERMISSION_KEY.SALES_INVOICE_ADD
      }
      fallback={<InvoiceFormFallback invoiceForm={invoiceForm} />}
    >
      <Card className='mb-4'>
        <CardHeader className='pb-4'>
          <CardTitle>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl font-semibold'>
                {invoiceForm.isEdit
                  ? 'Edit Tagihan Penjualan'
                  : 'Tambah Tagihan Penjualan'}
              </h1>
              <Button
                variant='link'
                className='h-auto p-0'
                onClick={() => {
                  if (invoiceForm.isEdit) {
                    history.back()
                  } else {
                    navigate({ to: '/sales/invoices' })
                  }
                }}
              >
                Kembali
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...invoiceForm.form}>
            <form
              onSubmit={invoiceForm.form.handleSubmit(invoiceForm.onSubmit)}
              className='space-y-6'
              id='invoice-form'
            >
              <InvoiceFormHeader />
              <div className='bg-border h-px' />
              <InvoiceFormItems />
              <div className='bg-border h-px' />

              <div className='flex flex-col items-start gap-6 md:flex-row'>
                <div className='w-full md:w-1/3'>
                  <FormField
                    control={invoiceForm.form.control}
                    name='images'
                    render={({ field }) => (
                      <AttachmentCard
                        value={field.value}
                        onChange={field.onChange}
                        maxFiles={5}
                      />
                    )}
                  />
                </div>
                <div className='ml-auto w-full md:w-2/3'>
                  <InvoiceFormSummary />
                </div>
              </div>

              <InvoiceFormActions
                isEdit={invoiceForm.isEdit}
                isSubmitting={invoiceForm.isSubmitting}
                errorMessage={invoiceForm.errorMessage}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}
