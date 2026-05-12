import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import type { useInvoiceForm } from '../hooks/use-invoice-form'
import { InvoiceFormActions } from '../sections/form-actions'
import { InvoiceFormHeader } from '../sections/form-header'
import { InvoiceFormItems } from '../sections/form-items-table'
import { InvoiceFormSummary } from '../sections/form-summary'

export function InvoiceFormFallback({
  invoiceForm,
}: {
  invoiceForm: ReturnType<typeof useInvoiceForm>
}) {
  return (
    <div className='relative'>
      <Card className='pointer-events-none mb-8 opacity-100 blur-[2px]'>
        <CardHeader>
          <CardTitle>
            <div className='flex items-center justify-between'>
              {invoiceForm.isEdit
                ? 'Edit Tagihan Pembelian'
                : 'Tambah Tagihan Pembelian'}
              <Button variant='link' onClick={() => history.back()}>
                Kembali
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...invoiceForm.form}>
            <form
              onSubmit={invoiceForm.form.handleSubmit(invoiceForm.onSubmit)}
              className='space-y-8'
              id='invoice-form'
            >
              <InvoiceFormHeader />
              <div className='bg-border h-px' />
              <InvoiceFormItems />
              <InvoiceFormSummary />
              <InvoiceFormActions
                isEdit={invoiceForm.isEdit}
                isSubmitting={invoiceForm.isSubmitting}
                errorMessage={invoiceForm.errorMessage}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      <UpgradePlanCard
        feature={
          invoiceForm.isEdit
            ? 'Edit Tagihan Pembelian'
            : 'Tambah Tagihan Pembelian'
        }
      />
    </div>
  )
}
