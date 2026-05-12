import { format } from 'date-fns'
import type { SalesDelivery } from '@/types'
import { id } from 'date-fns/locale'
import { Building2, Truck, Calendar } from 'lucide-react'
import { cn, getStatusStyles, invoiceLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DeliveryDetailReceiptProps {
  delivery: SalesDelivery
}

export function DeliveryDetailReceipt({ delivery }: DeliveryDetailReceiptProps) {
  return (
    <Card className='border-border overflow-hidden shadow-none'>
      <CardHeader className='border-b bg-muted/30 pb-4'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
              Nomor Pengiriman
            </p>
            <CardTitle className='text-2xl font-bold tracking-tight'>
              {delivery.number}
            </CardTitle>
          </div>
          <Badge
            variant='outline'
            className={cn(
              'h-6 px-3 text-[11px] font-bold tracking-wider uppercase',
              getStatusStyles(delivery.status)
            )}
          >
            {invoiceLabel[delivery.status] || delivery.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {/* Section 1: Customer & Reference */}
          <div className='space-y-6'>
            <div>
              <p className='text-muted-foreground mb-1.5 text-[10px] font-bold tracking-widest uppercase'>
                Pelanggan
              </p>
              <div className='flex items-center gap-2'>
                <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full'>
                  <Building2 className='h-4 w-4' />
                </div>
                <p className='text-md font-bold text-primary'>
                  {typeof delivery.customer === 'string'
                    ? delivery.customer
                    : delivery.customer?.name || '-'}
                </p>
              </div>
            </div>

            <div>
              <p className='text-muted-foreground mb-1.5 text-[10px] font-bold tracking-widest uppercase'>
                Referensi
              </p>
              <p className='text-sm font-medium'>
                {delivery.reference || '-'}
              </p>
            </div>
          </div>

          {/* Section 2: Delivery Details */}
          <div className='space-y-6'>
            <div>
              <p className='text-muted-foreground mb-1.5 text-[10px] font-bold tracking-widest uppercase'>
                Tanggal Pengiriman
              </p>
              <div className='flex items-center gap-2'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <p className='text-sm font-semibold'>
                  {delivery.date
                    ? format(new Date(delivery.date), 'EEEE, dd MMMM yyyy', {
                        locale: id,
                      })
                    : '-'}
                </p>
              </div>
            </div>

            <div>
              <p className='text-muted-foreground mb-1.5 text-[10px] font-bold tracking-widest uppercase'>
                Ekspedisi
              </p>
              <div className='flex items-center gap-2'>
                <Truck className='text-muted-foreground h-4 w-4' />
                <p className='text-sm font-semibold'>
                  {typeof delivery.expedition === 'string'
                    ? delivery.expedition
                    : delivery.expedition?.name || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Tracking */}
          <div className='space-y-6'>
            <div>
              <p className='text-muted-foreground mb-1.5 text-[10px] font-bold tracking-widest uppercase'>
                Nomor Resi (Tracking)
              </p>
              <div className='bg-muted/50 rounded-lg border border-dashed p-3'>
                <p className='text-primary font-mono text-lg font-bold tracking-wider'>
                  {delivery.tracking_number || 'Belum tersedia'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

