import { format } from 'date-fns'
// import { useNavigate } from '@tanstack/react-router'
import type { SalesOrder } from '@/types'
import { id } from 'date-fns/locale'
import { Building2, Printer, Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import { formatCurrency, cn, getStatusStyles, orderLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePrintSalesOrderQuery } from '../hooks/use-print-sales-order-query'
import { OrderDetailRowActions } from './order-detail-row-actions'

interface OrderDetailReceiptProps {
  order: SalesOrder
}

export function OrderDetailReceipt({ order }: OrderDetailReceiptProps) {
  const { refetch, isFetching: isPrinting } = usePrintSalesOrderQuery(
    order.id
  )

  const handlePrint = async () => {
    const { data } = await refetch()
    if (data) {
      window.open(data, '_blank')
    }
  }

  // const navigate = useNavigate()

  return (
    <Card className='border-border gap-1 overflow-hidden shadow-none'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-lg font-bold tracking-tight'>
            # {order.order_number}
            <Badge
              variant='outline'
              className={cn(
                'h-5 px-1.5 text-[10px] font-bold tracking-wider uppercase',
                getStatusStyles(order.document_status)
              )}
            >
              {orderLabel[order.document_status] || order.document_status}
            </Badge>
          </CardTitle>
          <div className='flex items-center gap-1.5'>
            <Button
              variant='outline'
              size='sm'
              className='h-7 gap-2 text-xs shadow-sm'
              onClick={handlePrint}
              disabled={isPrinting}
            >
              {isPrinting ? (
                <Loader2 className='h-3 w-3 animate-spin' />
              ) : (
                <Printer className='h-3 w-3' />
              )}
              {isPrinting ? 'Memproses...' : 'Cetak'}
            </Button>
            <OrderDetailRowActions order={order} />
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className='px-4 pt-4'>
        <div className='mb-6 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className=''>
            <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
              Pelanggan:
            </p>
            <div className=''>
              <div>
                <p className='text-md text-primary font-bold'>
                  {order.customer?.name}
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <Building2 className='text-muted-foreground h-3.5 w-3.5' />
                  <p className='text-muted-foreground text-xs'>
                    {order?.customer?.company_name || '-'}
                  </p>
                </div>
              </div>

              <div className='space-y-1.5'>
                <div className='flex items-center gap-2'>
                  <Mail className='text-muted-foreground h-3.5 w-3.5' />
                  <p className='text-muted-foreground text-xs'>
                    {order.customer?.email || '-'}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='text-muted-foreground h-3.5 w-3.5' />
                  <p className='text-muted-foreground text-xs'>
                    {order.customer?.phone || '-'}
                  </p>
                </div>
                <div className='flex items-start gap-2 pt-0.5'>
                  <MapPin className='text-muted-foreground mt-0.5 h-3.5 w-3.5 flex-shrink-0' />
                  <p className='text-muted-foreground max-w-xs text-xs leading-relaxed'>
                    {order.customer?.address || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=''>
            <div>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Nomor Order:
              </p>
              <p className='text-primary text-sm font-semibold'>
                {order.order_number || '-'}
              </p>
            </div>
            <div className='mt-2'>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Referensi:
              </p>
              <p className='text-sm font-semibold'>{order.note || '-'}</p>
            </div>
            <div className='mt-5'>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Detail Waktu:
              </p>
              <div className='mt-1.5 space-y-1.5'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-muted-foreground w-28 text-xs'>
                    Tanggal Order:
                  </span>
                  <span className='text-primary text-xs font-semibold'>
                    {order.order_date
                      ? format(new Date(order.order_date), 'dd MMM yyyy', {
                          locale: id,
                        })
                      : '-'}
                  </span>
                </div>
                <div className='flex items-baseline gap-2'>
                  <span className='text-muted-foreground w-28 text-xs'>
                    Jatuh Tempo:
                  </span>
                  <span className='text-primary text-xs font-semibold'>
                    {order.due_date
                      ? format(new Date(order.due_date), 'dd MMM yyyy', {
                          locale: id,
                        })
                      : '-'}
                  </span>
                </div>
                <div className='flex items-baseline gap-2'>
                  <span className='text-muted-foreground w-28 text-xs'>
                    Termin Pembayaran:
                  </span>
                  <span className='text-primary text-xs font-semibold'>
                    {order.payment_term?.name || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='space-y-1'>
            <div>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Tag
              </p>
              <div className='mt-1.5 flex flex-wrap gap-1.5'>
                {order.tags && order.tags.length > 0 ? (
                  order.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant='secondary'
                      className='h-5 px-1.5 text-[10px] font-medium uppercase'
                    >
                      {typeof tag === 'object' ? tag.name : tag}
                    </Badge>
                  ))
                ) : (
                  <span className='text-muted-foreground text-xs'>-</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className='mb-4' />

        <div className='overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50 hover:bg-transparent'>
                <TableHead className='text-muted-foreground h-8 px-2 py-1 text-[10px] font-bold tracking-wider uppercase'>
                  Item
                </TableHead>
                <TableHead className='text-muted-foreground h-8 px-2 py-1 text-[10px] font-bold tracking-wider uppercase'>
                  Deskripsi
                </TableHead>
                <TableHead className='text-muted-foreground h-8 px-2 py-1 text-[10px] font-bold tracking-wider uppercase'>
                  Harga
                </TableHead>
                <TableHead className='text-muted-foreground h-8 px-2 py-1 text-center text-[10px] font-bold tracking-wider uppercase'>
                  Qty
                </TableHead>
                <TableHead className='text-muted-foreground h-8 px-2 py-1 text-[10px] font-bold tracking-wider uppercase'>
                  Discount
                </TableHead>
                <TableHead className='text-muted-foreground h-8 px-2 py-1 text-[10px] font-bold tracking-wider uppercase'>
                  Pajak
                </TableHead>
                <TableHead className='text-muted-foreground h-8 px-2 py-1 text-right text-[10px] font-bold tracking-wider uppercase'>
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.sales_order_items?.map((item, idx) => (
                <TableRow
                  key={idx}
                  className='hover:bg-muted/40 transition-colors'
                >
                  <TableCell className='px-2 py-1.5 align-top'>
                    <p className='text-primary text-[13px] font-semibold'>
                      {item.product?.name || '-'}
                    </p>
                  </TableCell>
                  <TableCell className='px-2 py-1.5 align-top'>
                    <p className='text-[13px]'>{item.description || '-'}</p>
                  </TableCell>
                  <TableCell className='px-2 py-1.5 align-top'>
                    <p className='text-[13px] font-medium'>
                      {formatCurrency(
                        Number(item.unit_price),
                        order.currency
                      )}
                    </p>
                  </TableCell>
                  <TableCell className='px-2 py-1.5 text-center align-top'>
                    <p className='text-[13px] font-medium'>
                      {item.quantity || '-'}
                    </p>
                  </TableCell>
                  <TableCell className='px-2 py-1.5 align-top'>
                    <p className='text-[13px] font-medium'>
                      {item.discount ? item.discount + '%' : '-'}
                    </p>
                  </TableCell>
                  <TableCell className='px-2 py-1.5 align-top'>
                    <p className='text-muted-foreground text-[13px] font-medium'>
                      {item.tax?.name ?? '-'}
                    </p>
                  </TableCell>
                  <TableCell className='px-2 py-1.5 text-right align-top'>
                    <p className='text-[13px] font-bold'>
                      {formatCurrency(
                        Number(item.line_total),
                        order.currency
                      )}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='mt-6 flex flex-col items-start justify-between gap-6 md:flex-row'>
          <div className='hidden flex-1 md:block'>
          </div>

          <div className='bg-muted/20 w-full space-y-1.5 rounded-lg p-4 md:w-96'>
            <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'>
              <span className='text-muted-foreground'>Subtotal</span>
              <span className='font-medium'>
                {formatCurrency(Number(order.subtotal), order.currency)}
              </span>
            </div>

            {order.sales_order_items?.filter(item => item.tax).length > 0 && 
              Object.entries(
                order.sales_order_items.reduce(
                  (acc, item) => {
                    if (item.tax) {
                      const taxName = item.tax.name
                      const quantity = Number(item.quantity) || 0
                      const unitPrice = Number(item.unit_price) || 0
                      const taxAmount = (quantity * unitPrice * (item.tax.rate || 0)) / 100
                      acc[taxName] = (acc[taxName] || 0) + taxAmount
                    }
                    return acc
                  },
                  {} as Record<string, number>
                )
              ).map(([name, amount]) => (
                <div
                  key={name}
                  className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'
                >
                  <span className='text-muted-foreground'>{name}</span>
                  <span className='font-medium'>
                    {formatCurrency(amount, order.currency)}
                  </span>
                </div>
              ))}

            {Number(order.tax_total) > 0 && order.sales_order_items?.every((item) => !item.tax) && (
              <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm font-medium'>
                <span className='text-muted-foreground'>Pajak</span>
                <span>
                  {formatCurrency(Number(order.tax_total), order.currency)}
                </span>
              </div>
            )}

            <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'>
              <span className='text-muted-foreground font-medium'>Total</span>
              <span className='text-lg font-bold'>
                {formatCurrency(Number(order.total), order.currency)}
              </span>
            </div>

            {Number(order.dp_amount) > 0 && (
              <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'>
                 <span className='text-muted-foreground'>Uang Muka (DP)</span>
                 <span className='font-medium text-primary'>
                   - {formatCurrency(Number(order.dp_amount), order.currency)}
                 </span>
              </div>
            )}

            <div className='flex items-center justify-between pt-1'>
              <span className='text-sm font-bold'>Sisa Tagihan</span>
              <span className='text-primary text-lg font-black'>
                {formatCurrency(Number(order.outstanding), order.currency)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
