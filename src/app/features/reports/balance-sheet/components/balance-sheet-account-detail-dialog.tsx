import { useState, Fragment } from 'react'
import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { id } from 'date-fns/locale'
import { Search, X } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBalanceSheetContext } from '../components/balance-sheet-provider'
import { useBalanceSheetAccountDetailQuery } from '../hooks/use-balance-sheet-account-detail-query'

export function BalanceSheetAccountDetailDialog() {
  const [search, setSearch] = useState('')
  const { selectedAccountId, isOpen, closeDetail, date, period } =
    useBalanceSheetContext()
  const page = 1

  const { data: detailData, isLoading } = useBalanceSheetAccountDetailQuery({
    accountId: selectedAccountId || '',
    date,
    period,
    page,
    per_page: 100,
  })

  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDetail()}>
      <DialogContent className='flex max-h-[90vh] max-w-[calc(100%-2rem)] flex-col p-0 sm:max-w-7xl'>
        <div className='flex flex-1 flex-col space-y-6 overflow-hidden p-6'>
          {/* Header */}
          <div className='flex items-start justify-between'>
            <DialogHeader className='text-left'>
              <DialogTitle className='text-2xl font-bold'>
                Transaksi: {detailData?.account_name?.title || 'Memuat...'}
              </DialogTitle>
              <DialogDescription className='text-lg font-medium'>
                {detailData?.account_name?.code}
              </DialogDescription>
              <p className='text-muted-foreground text-sm'>
                Periode: {format(date, 'MMMM yyyy', { locale: id })}
              </p>
            </DialogHeader>
          </div>

          <hr />

          {/* Controls */}
          <div className='relative w-xs max-w-xs flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Cari...'
              className='pl-10'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table Container */}
          <div className='flex flex-1 flex-col overflow-hidden rounded-md border [&_[data-slot=table-container]]:flex-1 [&_[data-slot=table-container]]:overflow-auto'>
            <Table>
              <TableHeader className='border-b'>
                <TableRow>
                  <TableHead className='h-10 p-4 font-bold'>Tanggal</TableHead>
                  <TableHead className='h-10 p-4 font-bold'>Sumber</TableHead>
                  <TableHead className='h-10 p-4 font-bold'>
                    Deskripsi
                  </TableHead>
                  <TableHead className='h-10 p-4 font-bold'>Nomor</TableHead>
                  <TableHead className='h-10 p-4 text-right font-bold'>
                    Debit
                  </TableHead>
                  <TableHead className='h-10 p-4 text-right font-bold'>
                    Kredit
                  </TableHead>
                  <TableHead className='h-10 p-4 text-right font-bold'>
                    Saldo Berjalan
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Loading State */}
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-20 text-center'>
                      <div className='text-muted-foreground flex flex-col items-center gap-2'>
                        <div className='border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent' />
                        <span>Memuat data detail...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {detailData?.data.map((item) => (
                      <Fragment key={item.id}>
                        {/* Saldo Awal Row */}
                        <TableRow className='font-bold'>
                          <TableCell colSpan={4} className='p-4'>
                            Saldo Awal
                          </TableCell>
                          <TableCell className='p-4 text-right'>
                            {formatNumber(item.opening_debit)}
                          </TableCell>
                          <TableCell className='p-4 text-right'>
                            {formatNumber(item.opening_credit)}
                          </TableCell>
                          <TableCell className='p-4 text-right'>
                            {formatNumber(item.opening_balance)}
                          </TableCell>
                        </TableRow>

                        {/* Transaction Rows */}
                        {item.data
                          .filter(
                            (t) =>
                              t.desc
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              t.source.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              t.reference.number
                                .toLowerCase()
                                .includes(search.toLowerCase())
                          )
                          .map((trans) => (
                            <TableRow key={trans.id} className='border-b'>
                              <TableCell className='p-4 whitespace-nowrap'>
                                {trans.trans_date
                                  ? format(
                                      new Date(trans.trans_date),
                                      'dd/MM/yyyy'
                                    )
                                  : '-'}
                              </TableCell>
                              <TableCell className='p-4'>
                                {trans.source.name}
                              </TableCell>
                              <TableCell
                                onClick={() =>
                                  navigate({
                                    to: '/cash-bank/detail',
                                    search: {
                                      accountId: trans.account.id,
                                      transactionId: trans.reference.id,
                                    },
                                  })
                                }
                                className='text-primary cursor-pointer p-4 break-words hover:underline'
                              >
                                {trans.desc}
                              </TableCell>
                              <TableCell
                                onClick={() =>
                                  navigate({
                                    to: '/cash-bank/detail',
                                    search: {
                                      accountId: trans.account.id,
                                      transactionId: trans.reference.id,
                                    },
                                  })
                                }
                                className='text-primary cursor-pointer p-4 hover:underline'
                              >
                                {trans.reference.number}
                              </TableCell>
                              <TableCell className='p-4 text-right'>
                                {formatNumber(trans.debit)}
                              </TableCell>
                              <TableCell className='p-4 text-right'>
                                {formatNumber(trans.credit)}
                              </TableCell>
                              <TableCell className='p-4 text-right'>
                                {formatNumber(trans.balance)}
                              </TableCell>
                            </TableRow>
                          ))}

                        {/* Saldo Akhir Row */}
                        <TableRow className='font-bold'>
                          <TableCell colSpan={4} className='p-4'>
                            Saldo Akhir
                          </TableCell>
                          <TableCell className='p-4 text-right'>
                            {formatNumber(item.closing_debit)}
                          </TableCell>
                          <TableCell className='p-4 text-right'>
                            {formatNumber(item.closing_credit)}
                          </TableCell>
                          <TableCell className='p-4 text-right'>
                            {formatNumber(item.closing_balance)}
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    ))}

                    {/* Grand Total Row */}
                    {detailData?.journal_total && (
                      <TableRow className='border-t font-bold'>
                        <TableCell colSpan={4} className='p-4'>
                          Total
                        </TableCell>
                        <TableCell className='p-4 text-right'>
                          {formatNumber(detailData.journal_total.total_debit)}
                        </TableCell>
                        <TableCell className='p-4 text-right'>
                          {formatNumber(detailData.journal_total.total_credit)}
                        </TableCell>
                        <TableCell className='p-4' />
                      </TableRow>
                    )}
                  </>
                )}

                {!isLoading &&
                  (!detailData || detailData.data.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className='text-muted-foreground py-10 text-center italic'
                      >
                        Tidak ada detail untuk akun ini.
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className='bg-muted/50 flex justify-end gap-3 border-t p-4'>
          <Button
            variant='outline'
            onClick={() => closeDetail()}
            className='gap-2'
          >
            <X className='h-4 w-4' /> Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
