import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import { AttachmentCard } from '@/components/forms/attachment-card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import type { useOrderForm } from '../hooks/use-order-form'
import { OrderFormActions } from '../sections/order-form-actions'
import { OrderFormHeader } from '../sections/order-form-header'
import { OrderFormItems } from '../sections/order-form-items-table'
import { OrderFormSummary } from '../sections/order-form-summary'

export function OrderFormFallback({
  orderForm,
}: {
  orderForm: ReturnType<typeof useOrderForm>
}) {
  return (
    <div className='relative'>
      <Card className='pointer-events-none mb-8 opacity-100 blur-[2px]'>
        <CardHeader className='pb-4'>
          <CardTitle>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl font-semibold'>
                {orderForm.isEdit
                  ? 'Edit Pesanan Pembelian'
                  : 'Tambah Pesanan Pembelian'}
              </h1>
              <Button variant='link' onClick={() => history.back()} className='h-auto p-0'>
                Kembali
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...orderForm.form}>
            <form
              onSubmit={orderForm.form.handleSubmit(orderForm.onSubmit)}
              className='space-y-6'
              id='order-form'
            >
              <OrderFormHeader />
              <div className='bg-border h-px' />
              <OrderFormItems />
              <div className='bg-border h-px' />

              <div className='flex flex-col items-start gap-6 md:flex-row'>
                <div className='w-full md:w-1/3'>
                  <FormField
                    control={orderForm.form.control}
                    name='attachments'
                    render={({ field }) => (
                      <AttachmentCard
                        value={field.value as unknown as File[]}
                        onChange={field.onChange}
                        maxFiles={5}
                      />
                    )}
                  />
                </div>
                <div className='ml-auto w-full md:w-2/3'>
                  <OrderFormSummary />
                </div>
              </div>

              <OrderFormActions
                isEdit={orderForm.isEdit}
                isSubmitting={orderForm.isSubmitting}
                errorMessage={orderForm.errorMessage}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      <UpgradePlanCard
        feature={
          orderForm.isEdit
            ? 'Edit Pesanan Pembelian'
            : 'Tambah Pesanan Pembelian'
        }
      />
    </div>
  )
}
