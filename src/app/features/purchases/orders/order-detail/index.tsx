import { useLocation, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useOrderFormQuery } from '../order-form/hooks/use-order-form-query'
import { OrderDetailReceipt } from './components/order-detail-receipt'
import { OrderPaymentsCard } from './components/order-payments-card'

export default function OrderDetail() {
  const location = useLocation()
  const navigate = useNavigate()

  const currentRowId = (location.state as { currentRowId?: string })
    ?.currentRowId

  const { data: order, isLoading } = useOrderFormQuery({ id: currentRowId })

  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center font-medium'>
        Memuat data pesanan...
      </div>
    )
  }

  if (!order) {
    return (
      <Card className='flex h-[60vh] flex-col items-center justify-center gap-4'>
        <CardContent>
          <p className='text-muted-foreground'>Data pesanan tidak ditemukan.</p>
          <Button onClick={() => history.back()} variant='outline'>
            <ArrowLeft className='mr-2 h-4 w-4' /> Kembali
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4 font-sans'>
      <Card className='gap-1'>
        <CardHeader className='py-3'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold'>
                Detail Pesanan Pembelian
              </h1>
            </div>
            <div className='mr-4 flex gap-2'>
              <Button
                variant='outline'
                onClick={() => navigate({ to: '/purchases/orders' })}
                className='h-8 gap-2 px-3 text-xs'
              >
                <ArrowLeft className='h-3.5 w-3.5' /> Kembali
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <OrderDetailReceipt order={order} />
          <OrderPaymentsCard order={order} />
        </CardContent>
      </Card>
    </div>
  )
}
