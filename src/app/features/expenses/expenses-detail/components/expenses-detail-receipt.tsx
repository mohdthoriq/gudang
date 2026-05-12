import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import type { Expense } from '@/types/domain/expenses'
import { id } from 'date-fns/locale'
import { Building2, Printer, Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import { formatCurrency, cn, getStatusStyles, invoiceLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { usePrintExpensesQuery } from '../hooks/use-print-expenses-invoice-query'
import { ExpenseDetailRowActions } from './expenses-detail-row-actions'

interface ExpensesDetailReceiptProps {
  expense: Expense
}

export function ExpensesDetailReceipt({ expense }: ExpensesDetailReceiptProps) {
  const { refetch, isFetching: isPrinting } = usePrintExpensesQuery(expense.id)

  const navigate = useNavigate()

  const handlePrint = async () => {
    const { data } = await refetch()
    if (data) {
      window.open(data, '_blank')
    }
  }

  return (
    <Card className='border-border gap-1 overflow-hidden shadow-none'>
      <CardHeader className=''>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-lg font-bold tracking-tight'>
            # {expense.expense_number}
            <Badge
              variant='outline'
              className={cn(
                'h-5 px-1.5 text-[10px] font-bold tracking-wider uppercase',
                getStatusStyles(expense.payment_status)
              )}
            >
              {invoiceLabel[expense.payment_status] || expense.payment_status}
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
            <ExpenseDetailRowActions expense={expense} />
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className='px-4 pt-4'>
        <div className='mb-6 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className=''>
            <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
              Penerima:
            </p>
            <div className=''>
              <div>
                <p className='text-md text-primary font-bold'>
                  {expense.contact?.name}
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <Building2 className='text-muted-foreground h-3.5 w-3.5' />
                  <p className='text-muted-foreground text-xs'>
                    {expense.company?.name || '-'}
                  </p>
                </div>
              </div>

              <div className='space-y-1.5'>
                <div className='flex items-center gap-2'>
                  <Mail className='text-muted-foreground h-3.5 w-3.5' />
                  <p className='text-muted-foreground text-xs'>
                    {expense.contact?.email || '-'}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='text-muted-foreground h-3.5 w-3.5' />
                  <p className='text-muted-foreground text-xs'>
                    {expense.contact?.phone || '-'}
                  </p>
                </div>
                <div className='flex items-start gap-2 pt-0.5'>
                  <MapPin className='text-muted-foreground mt-0.5 h-3.5 w-3.5 flex-shrink-0' />
                  <p className='text-muted-foreground max-w-xs text-xs leading-relaxed'>
                    {expense.contact?.address || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=''>
            <div>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Nomor Biaya:
              </p>
              <p className='text-primary text-sm font-semibold'>
                {expense.expense_number || '-'}
              </p>
            </div>
            <div className='mt-2'>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Referensi:
              </p>
              <p className='text-sm font-semibold'>{expense.note || '-'}</p>
            </div>
            <div className='mt-5'>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Detail Waktu:
              </p>
              <div className='mt-1.5 space-y-1.5'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-muted-foreground w-28 text-xs'>
                    Tanggal Biaya:
                  </span>
                  <span className='text-primary text-xs font-semibold'>
                    {expense.date
                      ? format(new Date(expense.date), 'dd MMM yyyy', {
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
                    {expense.due_date
                      ? format(
                          new Date(expense.due_date as Date),
                          'dd MMM yyyy',
                          {
                            locale: id,
                          }
                        )
                      : '-'}
                  </span>
                </div>
                <div className='flex items-baseline gap-2'>
                  <span className='text-muted-foreground w-28 text-xs'>
                    Termin Pembayaran:
                  </span>
                  <span className='text-primary text-xs font-semibold'>
                    {expense.payment_term?.name || '-'}
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
                {expense.tags && expense.tags.length > 0 ? (
                  expense.tags.map((tag, idx) => (
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

        {/* Expense Items List */}
        <div className='mb-6 flex flex-col overflow-hidden rounded-md border text-[13px]'>
          <div className='bg-muted/50 border-b px-3 py-1.5'>
            <p className='text-muted-foreground text-[10px] font-bold tracking-wider uppercase'>
              Items
            </p>
          </div>
          {expense.expense_items.map((item, _) => (
            <div
              key={item.id}
              className='hover:bg-muted/30 flex items-center justify-between border-b px-3 py-2 transition-colors last:border-0'
            >
              <div className='flex flex-col'>
                <span className='text-primary cursor-pointer text-[13px] font-semibold hover:underline'>
                  {item.account?.code
                    ? item.account?.code + ' - ' + item.account?.name
                    : item.account?.name}
                </span>
                {item.description && (
                  <span className='text-muted-foreground text-[11px]'>
                    {item.description}
                  </span>
                )}
              </div>
              <span className='text-primary text-[13px] font-semibold'>
                {formatCurrency(Number(item.amount), expense.currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals Section */}
        <div className='mt-6 flex flex-col items-start justify-between gap-6 md:flex-row'>
          <div className='hidden flex-1 md:block'></div>
          <div className='bg-muted/20 w-full space-y-1.5 rounded-lg p-4 md:w-96'>
            <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'>
              <span className='text-muted-foreground'>Subtotal</span>
              <span className='font-medium'>
                {formatCurrency(Number(expense.subtotal), expense.currency)}
              </span>
            </div>

            {/* Tax Breakdown */}
            {expense.taxes?.map((tax) => (
              <div
                key={tax.id}
                className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'
              >
                <span className='text-muted-foreground'>
                  {tax.name} ({tax.rate}%)
                </span>
                <span className='font-medium'>
                  {formatCurrency(Number(tax.amount), expense.currency)}
                </span>
              </div>
            ))}

            {/* Fallback if no specific tax list but total exists */}
            {(!expense.taxes || expense.taxes.length === 0) &&
              Number(expense.tax_total) > 0 && (
                <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'>
                  <span className='text-muted-foreground'>Total Pajak</span>
                  <span className='font-medium'>
                    {formatCurrency(
                      Number(expense.tax_total),
                      expense.currency
                    )}
                  </span>
                </div>
              )}

            {/* Deductions */}
            {expense.deductions?.map((deduction) => (
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
                  ({formatCurrency(Number(deduction.amount), expense.currency)})
                </span>
              </div>
            ))}

            <div className='border-muted-foreground/10 flex justify-between border-b pb-1 text-sm'>
              <span className='text-muted-foreground font-bold'>Total</span>
              <span className='text-lg font-bold'>
                {formatCurrency(Number(expense.total), expense.currency)}
              </span>
            </div>

            {expense.payments?.map((payment) => (
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
                <span className='text-muted-foreground text-left text-xs'>
                  Pembayaran {payment.account.name}
                </span>
                <span className='text-xs'>
                  {formatCurrency(Number(payment.amount), expense.currency)}
                </span>
              </div>
            ))}
            <div className='flex items-center justify-between pt-1'>
              <span className='text-sm font-bold'>Sisa Tagihan</span>
              <span className='text-primary text-lg font-black'>
                {formatCurrency(Number(expense.outstanding), expense.currency)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
