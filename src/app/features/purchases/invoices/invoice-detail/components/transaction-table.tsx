import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import type { Payment } from '@/types'
import { id } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils'
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

interface TransactionTableProps {
  payments: Payment[]
  currency: string
}

export function TransactionTable({
  payments,
  currency,
}: TransactionTableProps) {
  const navigate = useNavigate()

  if (!payments || payments.length === 0) return null

  return (
    <Card className='border-border gap-0 shadow-none'>
      <CardHeader className='pb-3 border-none'>
        <CardTitle className='text-base font-semibold'>
          Riwayat Transaksi
        </CardTitle>
      </CardHeader>
      <Separator className='' />
      <CardContent className='pt-4'>
        <div className='border-border overflow-hidden rounded-md border text-[13px]'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50 hover:bg-transparent'>
                <TableHead className='text-muted-foreground h-8 px-4 py-1 text-[10px] font-bold tracking-wider uppercase'>
                  Tanggal
                </TableHead>
                <TableHead className='text-muted-foreground h-8 px-4 py-1 text-[10px] font-bold tracking-wider uppercase'>
                  Nomor
                </TableHead>
                <TableHead className='text-muted-foreground h-8 px-4 py-1 text-[10px] font-bold tracking-wider uppercase'>
                  Referensi
                </TableHead>
                <TableHead className='text-muted-foreground h-8 px-4 py-1 text-[10px] font-bold tracking-wider uppercase'>
                  Akun
                </TableHead>
                <TableHead className='text-muted-foreground h-8 px-4 py-1 text-right text-[10px] font-bold tracking-wider uppercase'>
                  Jumlah
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className='hover:bg-muted/30 transition-colors'
                >
                  <TableCell className='px-4 py-2 text-[13px] font-medium'>
                    {format(new Date(payment.payment_date), 'dd MMM yyyy', {
                      locale: id,
                    })}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      navigate({
                        to: '/cash-bank/detail',
                        search: {
                          accountId: payment.account.id,
                          transactionId: payment.id,
                        },
                      })
                    }
                    className='text-primary cursor-pointer px-4 py-2 text-[13px] hover:underline'
                  >
                    {payment.reference_no || '-'}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      navigate({
                        to: '/cash-bank/detail',
                        search: {
                          accountId: payment.account.id,
                          transactionId: payment.id,
                        },
                      })
                    }
                    className='text-primary cursor-pointer px-4 py-2 text-[13px] hover:underline'
                  >
                    {payment.note || '-'}
                  </TableCell>
                  <TableCell className='px-4 py-2 text-[13px]'>
                    <span className='font-medium'>
                      {payment.account?.name.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell className='px-4 py-2 text-right text-[13px] font-semibold'>
                    {formatCurrency(payment.amount, currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
