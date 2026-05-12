import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import type { SalesInvoice } from '@/types'
import { id } from 'date-fns/locale'
import { Building2, Printer, Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import { formatCurrency, cn, getStatusStyles, invoiceLabel } from '@/lib/utils'
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
import { usePrintSalesInvoiceQuery } from '../hooks/use-print-sales-invoice-query'
import { InvoiceDetailRowActions } from './invoice-detail-row-actions'

interface InvoiceDetailReceiptProps {
  invoice: SalesInvoice
}

export function InvoiceDetailReceipt({ invoice }: InvoiceDetailReceiptProps) {
  const { refetch, isFetching: isPrinting } = usePrintSalesInvoiceQuery(
    invoice.id
  )

  const handlePrint = async () => {
    const { data } = await refetch()
    if (data) {
      window.open(data, '_blank')
    }
  }

  const navigate = useNavigate()

  return (
    <Card className='border-border gap-1 overflow-hidden shadow-none'>
      <CardHeader className=''>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-lg font-bold tracking-tight'>
            # {invoice.invoice_number}
            <Badge
              variant='outline'
              className={cn(
                'h-5 px-1.5 text-[10px] font-bold tracking-wider uppercase',
                getStatusStyles(invoice.payment_status)
              )}
            >
              {invoiceLabel[invoice.payment_status] || invoice.payment_status}
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
            <InvoiceDetailRowActions invoice={invoice} />
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
                  {invoice.customer?.name}
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <Building2 className='text-muted-foreground h-3.5 w-3.5' />
                  <p className='text-muted-foreground text-xs'>
                    {invoice?.customer?.company_name || '-'}
                  </p>
                </div>
              </div>

              <div className='space-y-1.5'>
                <div className='flex items-center gap-2'>
                  <Mail className='text-muted-foreground h-3.5 w-3.5' />
                  <p className='text-muted-foreground text-xs'>
                    {invoice.customer?.email || '-'}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='text-muted-foreground h-3.5 w-3.5' />
                  <p className='text-muted-foreground text-xs'>
                    {invoice.customer?.phone || '-'}
                  </p>
                </div>
                <div className='flex items-start gap-2 pt-0.5'>
                  <MapPin className='text-muted-foreground mt-0.5 h-3.5 w-3.5 flex-shrink-0' />
                  <p className='text-muted-foreground max-w-xs text-xs leading-relaxed'>
                    {invoice.customer?.address || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=''>
            <div>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Nomor Invoice:
              </p>
              <p className='text-primary text-sm font-semibold'>
                {invoice.invoice_number || '-'}
              </p>
            </div>
            <div className='mt-2'>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Referensi:
              </p>
              <p className='text-sm font-semibold'>{invoice.note || '-'}</p>
            </div>
            <div className='mt-5'>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Detail Waktu:
              </p>
              <div className='mt-1.5 space-y-1.5'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-muted-foreground w-28 text-xs'>
                    Tanggal Invoice:
                  </span>
                  <span className='text-primary text-xs font-semibold'>
                    {invoice.invoice_date
                      ? format(new Date(invoice.invoice_date), 'dd MMM yyyy', {
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
                    {invoice.due_date
                      ? format(new Date(invoice.due_date), 'dd MMM yyyy', {
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
                    {invoice.payment_term?.name || '-'}
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
                {invoice.tags && invoice.tags.length > 0 ? (
                  invoice.tags.map((tag, idx) => (
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

        {/* Invoice Items */}
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
              {invoice.sales_invoice_items.map((item, idx) => (
                <TableRow
                  key={idx}
                  className='hover:bg-muted/40 transition-colors'
                >
                  <TableCell className='px-2 py-1.5 align-top'>
                    <div className='space-y-0.5'>
                      <p className='text-primary text-[13px] font-semibold'>
                        {item.product?.name || '-'}
                      </p>
                      {item.product?.sku && (
                        <p className='text-muted-foreground text-[11px] font-medium'>
                          {item.product.sku}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='px-2 py-1.5 align-top'>
                    <p className='text-[13px]'>{item.description || '-'}</p>
                  </TableCell>
                  <TableCell className='px-2 py-1.5 align-top'>
                    <p className='text-[13px] font-medium'>
                      {formatCurrency(
                        Number(item.unit_price),
                        invoice.currency
                      )}
                    </p>
                  </TableCell>
                  <TableCell className='px-2 py-1.5 text-center align-top'>
                    <p className='text-[13px] font-medium'>
                      {item.quantity}{' '}
                      <span className='text-muted-foreground text-[11px]'>
                        {item.product?.unit?.name}
                      </span>
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
                        invoice.currency
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
            {/* Space for note or signatures if needed */}
          </div>

          <div className='bg-muted/20 w-full space-y-1.5 rounded-lg p-4 md:w-96'>
            <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'>
              <span className='text-muted-foreground'>Subtotal</span>
              <span className='font-medium'>
                {formatCurrency(Number(invoice.subtotal), invoice.currency)}
              </span>
            </div>

            {/* Additional Discounts */}
            {invoice.additional_discounts?.map((discount) => (
              <div
                key={discount.id}
                className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'
              >
                <span className='text-muted-foreground'>{discount.name}</span>
                <span className='font-medium text-red-500'>
                  ({formatCurrency(Number(discount.amount), invoice.currency)})
                </span>
              </div>
            ))}

            {/* Tax Breakdown from API */}
            {invoice.taxes?.map((tax) => (
              <div
                key={tax.id}
                className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'
              >
                <span className='text-muted-foreground'>
                  {tax.name} ({tax.rate}%)
                </span>
                <span className='font-medium'>
                  {formatCurrency(Number(tax.amount), invoice.currency)}
                </span>
              </div>
            ))}

            {/* Fallback if no specific tax list but total exists */}
            {(!invoice.taxes || invoice.taxes.length === 0) &&
              Number(invoice.tax_total) > 0 && (
                <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'>
                  <span className='text-muted-foreground'>Total Pajak</span>
                  <span className='font-medium'>
                    {formatCurrency(
                      Number(invoice.tax_total),
                      invoice.currency
                    )}
                  </span>
                </div>
              )}

            {/* Transaction Fees */}
            {invoice.transaction_fees?.map((fee) => (
              <div
                key={fee.id}
                className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'
              >
                <span className='text-muted-foreground'>{fee.name}</span>
                <span className='font-medium'>
                  {formatCurrency(Number(fee.amount), invoice.currency)}
                </span>
              </div>
            ))}

            {/* Shipping Fee */}
            {Number(invoice.shipping_fee) > 0 && (
              <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'>
                <span className='text-muted-foreground'>Biaya Pengiriman</span>
                <span className='font-medium'>
                  {formatCurrency(Number(invoice.shipping_fee), invoice.currency)}
                </span>
              </div>
            )}

            {/* Deductions */}
            {invoice.deductions?.map((deduction) => (
              <div
                key={deduction.id}
                className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'
              >
                <span className='text-muted-foreground'>
                  {deduction.name}{' '}
                  {deduction.account && (
                    <span className='text-[10px] text-gray-400'>
                      ({deduction.account.name})
                    </span>
                  )}
                </span>
                <span className='font-medium text-red-500'>
                  ({formatCurrency(Number(deduction.amount), invoice.currency)})
                </span>
              </div>
            ))}

            <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'>
              <span className='text-muted-foreground font-medium'>Total</span>
              <span className='text-lg font-bold'>
                {formatCurrency(Number(invoice.total), invoice.currency)}
              </span>
            </div>

            {invoice.payments?.map((payment) => (
              <div
                key={payment.id}
                className='border-muted-foreground/10 hover:text-primary flex cursor-pointer justify-between border-b pb-1 text-sm font-medium transition-colors hover:underline'
                onClick={() =>
                  navigate({
                    to: '/cash-bank/detail',
                    search: {
                      accountId: payment.account.id,
                      transactionId: payment.id,
                    },
                  })
                }
              >
                <span className='text-muted-foreground text-xs'>
                  Pembayaran {payment.account.name}
                </span>
                <span className='text-xs'>
                  {formatCurrency(Number(payment.amount), invoice.currency)}
                </span>
              </div>
            ))}
            <div className='flex items-center justify-between pt-1'>
              <span className='text-sm font-bold'>Sisa Tagihan</span>
              <span className='text-primary text-lg font-black'>
                {formatCurrency(Number(invoice.outstanding), invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
