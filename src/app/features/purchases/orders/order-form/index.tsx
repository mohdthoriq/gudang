import { useLocation, useNavigate } from '@tanstack/react-router'
import { FinanceNumberType } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import { AttachmentCard } from '@/components/forms/attachment-card'
import { PERMISSION_KEY } from '@/constants/permissions'
import { PermissionGuard } from '@/components/permission-guard'
import { OrderFormFallback } from './components/order-form-fallback'
import { useOrderForm } from './hooks/use-order-form'
import { useOrderFormQuery } from './hooks/use-order-form-query'
import { OrderFormActions } from './sections/order-form-actions'
import { OrderFormHeader } from './sections/order-form-header'
import { OrderFormItems } from './sections/order-form-items-table'
import { OrderFormSummary } from './sections/order-form-summary'
import { useDefaultNumberingQuery } from '@/hooks/use-auto-numbering'

export default function OrderFormPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const currentRowId = (location.state as { currentRowId?: string })
    ?.currentRowId

  const currentRow = useOrderFormQuery({ id: currentRowId })

  const { data: orderAutoNumbering } = useDefaultNumberingQuery({
    type: FinanceNumberType.purchase_order,
  })

  const orderForm = useOrderForm({
    currentRow: currentRow.data ?? undefined,
    autoNumbering: orderAutoNumbering,
  })

  if (currentRowId && currentRow.isLoading) {
    return (
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Memuat data pesanan...</CardTitle>
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
        orderForm.isEdit
          ? PERMISSION_KEY.PURCHASE_ORDER_EDIT
          : PERMISSION_KEY.PURCHASE_ORDER_ADD
      }
      fallback={<OrderFormFallback orderForm={orderForm} />}
    >
      <Card className='mb-4'>
      <CardHeader className='pb-4'>
        <CardTitle>
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>
              {orderForm.isEdit
                ? 'Edit Pesanan Pembelian'
                : 'Tambah Pesanan Pembelian'}
            </h1>
            <Button
              variant='link'
              className='h-auto p-0'
              onClick={() => {
                if (orderForm.isEdit) {
                  history.back()
                } else {
                  navigate({ to: '/purchases/orders' })
                }
              }}
            >
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
    </PermissionGuard>
  )
}
