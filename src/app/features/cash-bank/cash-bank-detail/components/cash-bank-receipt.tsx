import { format } from 'date-fns'
import { type LinkProps, useNavigate } from '@tanstack/react-router'
import { type CashBankTransactionDetail, TransactionCode } from '@/types'
import { id } from 'date-fns/locale'
import { Printer } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
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
import { CashBankRowActions } from './cash-bank-row-actions'

interface CashBankDetailReceiptProps {
  transaction: CashBankTransactionDetail | null | undefined
}

export function CashBankDetailReceipt({
  transaction,
}: CashBankDetailReceiptProps) {
  const navigate = useNavigate()

  const url: LinkProps['to'] =
    transaction?.transaction_type?.code === TransactionCode.SalesInvoice
      ? `/sales/invoices/detail`
      : transaction?.transaction_type?.code === TransactionCode.PurchaseInvoice
        ? `/purchases/invoices/detail`
        : `/expenses/detail`

  const isNavigate =
    transaction?.transaction_type?.code === TransactionCode.SalesInvoice ||
    transaction?.transaction_type?.code === TransactionCode.PurchaseInvoice ||
    transaction?.transaction_type?.code === TransactionCode.Expense

  return (
    <Card className='gap-3 overflow-hidden py-4 shadow-md'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-3'>
            <CardTitle className='flex items-center gap-2 text-lg font-bold tracking-tight'>
              # {transaction?.reference.number}
            </CardTitle>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='gap-2 shadow-sm'
              onClick={() => window.print()}
            >
              <Printer className='h-4 w-4' /> Cetak
            </Button>
            <CashBankRowActions
              transaction={transaction as CashBankTransactionDetail}
            />
          </div>
        </div>
      </CardHeader>
      <hr />

      <CardContent className='space-y-8 pt-6'>
        {/* Header Info */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <div className='flex flex-col gap-6'>
            <div className='space-y-2'>
              <p className='text-muted-foreground text-[12px] font-semibold tracking-[0.2em]'>
                Kontak
              </p>
              <p className='text-md font-semibold'>
                {transaction?.contact?.name || '-'}
              </p>
            </div>
            <div className='space-y-2'>
              <p className='text-muted-foreground text-[12px] font-semibold tracking-[0.2em]'>
                Tanggal Transaksi
              </p>
              <p className='text-md font-semibold'>
                {transaction?.trans_date
                  ? format(new Date(transaction.trans_date), 'dd MMMM yyyy', {
                      locale: id,
                    })
                  : '-'}
              </p>
            </div>

            <div className='space-y-2'>
              <p className='text-muted-foreground text-sm font-semibold'>
                Akun
              </p>
              <div className='flex items-center gap-2'>
                <span className='text-md font-semibold'>
                  {transaction?.account?.code}
                </span>
                {'-'}
                <span className='text-md font-semibold'>
                  {transaction?.account?.name}
                </span>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <div className='space-y-2'>
              <p className='text-muted-foreground text-[12px] font-semibold tracking-[0.2em]'>
                Nomor
              </p>
              <p className='text-md font-semibold'>
                {transaction?.entry_number ||
                  (typeof transaction?.reference === 'object'
                    ? transaction?.reference?.number
                    : '-')}
              </p>
            </div>
            <div className='space-y-2'>
              <p className='text-muted-foreground text-[12px] font-semibold tracking-[0.2em]'>
                Tag
              </p>
              <div className='flex flex-wrap gap-2'>
                {transaction?.tags && transaction.tags.length > 0 ? (
                  transaction.tags.map((tag, index) => {
                    const tagName = typeof tag === 'object' ? tag.name : tag
                    return (
                      <Badge
                        key={index}
                        variant='outline'
                        className='px-2 py-1 text-[10px]'
                      >
                        {tagName}
                      </Badge>
                    )
                  })
                ) : (
                  <span className='text-md font-semibold'>-</span>
                )}
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <div className='space-y-2'>
              <p className='text-muted-foreground text-[12px] font-semibold tracking-[0.2em]'>
                Referensi
              </p>
              <p className='text-md font-semibold underline-offset-4'>
                {transaction?.note ||
                  (typeof transaction?.reference === 'string'
                    ? transaction?.reference
                    : '-')}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Journal Lines Table */}
        <div className='space-y-4'>
          <div className='rounded-xl border'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50'>
                  <TableHead className='p-4'>Deskripsi</TableHead>
                  <TableHead className='w-[120px] p-4 text-right'>
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction?.items?.map((item) => (
                  <TableRow key={item.id}>
                    {isNavigate ? (
                      <TableCell className='p-4'>
                        {item.desc ? (
                          <span
                            onClick={() =>
                              navigate({
                                to: url,
                                state: {
                                  currentRowId: item?.id,
                                } as Record<string, unknown>,
                              })
                            }
                            className='text-md text-primary cursor-pointer font-medium hover:underline'
                          >
                            {item.desc}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    ) : (
                      <TableCell className='p-4'>
                        {item.desc ? (
                          <span className='text-md font-medium'>
                            {item.desc}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    )}

                    <TableCell className='p-4 text-right'>
                      {item.amount > 0 ? formatCurrency(item.amount) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer: Description & Totals */}
        <div className='flex flex-col gap-8 md:flex-row md:justify-end'>
          <div className='w-full rounded-sm border md:w-80'>
            <div className='bg-muted space-y-3 rounded-lg p-6'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground text-lg font-medium'>
                  Total :
                </span>
                <span className='text-lg font-medium'>
                  {formatCurrency(transaction?.amount_after_tax as number)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
