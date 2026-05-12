import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { type Account } from '@/types'
import { X, Search } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { cn, formatNumber } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useDebounce } from '@/hooks/use-debounce'
import { useHasPermission } from '@/hooks/use-has-permission'
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
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { DatePickerWithRange } from '../../sales/invoices/invoice-lists/components/date-picker-with-range'
import { useAccountLedgerQuery } from '../hooks/use-account-query'

type AccountLedgerDialogProps = {
  currentRow: Account
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountsLedgerDialog({
  currentRow,
  open,
  onOpenChange,
}: AccountLedgerDialogProps) {
  const [date, setDate] = useState<DateRange | undefined>(() => {
    return {
      from: subDays(new Date(), 30),
      to: new Date(),
    }
  })

  const hasPermission = useHasPermission(PERMISSION_KEY.ACCOUNT_LEDGER)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const navigate = useNavigate()

  const { data: ledger, isLoading } = useAccountLedgerQuery(
    currentRow?.id,
    date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
    date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
    debouncedSearch,
    'asc'
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] max-w-[calc(100%-4rem)] flex-col p-0 sm:max-w-7xl'>
        <div className='flex flex-1 flex-col space-y-6 overflow-hidden p-6'>
          <div className='flex items-start justify-between'>
            <DialogHeader className='text-left'>
              <DialogTitle className='text-2xl font-bold'>
                Transaksi {currentRow?.name}
              </DialogTitle>
              <DialogDescription className='text-lg font-medium'>
                {currentRow?.code}
              </DialogDescription>
            </DialogHeader>
          </div>

          <hr />

          <div className='relative flex flex-1 flex-col space-y-6 overflow-hidden'>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='relative max-w-xs min-w-[200px] flex-1'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  placeholder='Cari...'
                  className='pl-10'
                  value={search}
                  disabled={!hasPermission}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className='ml-auto shrink-0'>
                <DatePickerWithRange
                  date={date}
                  setDate={setDate}
                  disabled={!hasPermission}
                />
              </div>
            </div>

            <div
              className={cn(
                'flex flex-1 flex-col overflow-hidden rounded-md border [&_[data-slot=table-container]]:flex-1 [&_[data-slot=table-container]]:overflow-auto'
              )}
            >
              <Table
                className={cn(
                  !hasPermission && 'pointer-events-none opacity-100 blur-[2px]'
                )}
              >
                <TableHeader className='bg-secondary [&_th]:bg-secondary sticky top-0 z-10 shadow-sm'>
                  <TableRow className='bg-secondary hover:bg-secondary'>
                    <TableHead className='whitespace-wrap font-semibold'>
                      Tanggal
                    </TableHead>
                    <TableHead className='whitespace-wrap font-semibold'>
                      Sumber
                    </TableHead>
                    <TableHead className='whitespace-wrap font-semibold'>
                      Deskripsi
                    </TableHead>
                    <TableHead className='whitespace-wrap font-semibold'>
                      Nomor
                    </TableHead>
                    <TableHead className='whitespace-wrap text-right font-semibold'>
                      Debit
                    </TableHead>
                    <TableHead className='whitespace-wrap text-right font-semibold'>
                      Kredit
                    </TableHead>
                    <TableHead className='whitespace-wrap text-right font-semibold'>
                      Saldo Berjalan
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className='font-medium'>
                    <TableCell colSpan={4}>Saldo Awal</TableCell>
                    <TableCell className='text-right'>0</TableCell>
                    <TableCell className='text-right'>0</TableCell>
                    <TableCell className='text-right'>
                      {formatNumber(ledger?.opening_balance || 0)}
                    </TableCell>
                  </TableRow>

                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className='py-20 text-center'>
                        <div className='text-muted-foreground flex flex-col items-center gap-2'>
                          <div className='border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent' />
                          <span>Memuat data transaksi...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ledger?.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className='text-muted-foreground text-xs whitespace-nowrap'>
                          {format(new Date(entry.date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className='text-muted-foreground whitespace-nowrap'>
                          {entry.source.name}
                        </TableCell>
                        <TableCell
                          onClick={() =>
                            navigate({
                              to: `/cash-bank/detail`,
                              search: {
                                accountId: currentRow?.id,
                                transactionId: entry.reference.id,
                              },
                            })
                          }
                          className='text-primary cursor-pointer py-3 font-medium break-words whitespace-normal hover:underline'
                        >
                          {entry.description}
                        </TableCell>
                        <TableCell
                          onClick={() =>
                            navigate({
                              to: `/cash-bank/detail`,
                              search: {
                                accountId: currentRow?.id,
                                transactionId: entry.reference.id,
                              },
                            })
                          }
                          className='text-primary cursor-pointer py-3 font-medium break-words whitespace-normal hover:underline'
                        >
                          {entry.reference.number}
                        </TableCell>
                        <TableCell className='text-right whitespace-nowrap'>
                          {entry.debit > 0 ? formatNumber(entry.debit) : '0'}
                        </TableCell>
                        <TableCell className='text-right whitespace-nowrap'>
                          {entry.credit > 0 ? formatNumber(entry.credit) : '0'}
                        </TableCell>
                        <TableCell className='text-right font-medium whitespace-nowrap'>
                          {formatNumber(entry.running_balance)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}

                  {!isLoading && ledger?.entries.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className='text-muted-foreground py-10 text-center italic'
                      >
                        Tidak ada transaksi untuk periode ini.
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Statistics Rows */}
                  <TableRow className='bg-muted/50 font-bold'>
                    <TableCell colSpan={4}>Saldo Akhir</TableCell>
                    <TableCell className='text-right'>
                      {formatNumber(ledger?.total_debit || 0)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatNumber(ledger?.total_credit || 0)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatNumber(ledger?.closing_balance || 0)}
                    </TableCell>
                  </TableRow>

                  <TableRow className='h-8 border-none hover:bg-transparent'>
                    <TableCell colSpan={7}></TableCell>
                  </TableRow>

                  <TableRow className='border-t-2 font-bold'>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className='text-right'>
                      {formatNumber(ledger?.total_debit || 0)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatNumber(ledger?.total_credit || 0)}
                    </TableCell>
                    <TableCell className='text-right'></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {!hasPermission && <UpgradePlanCard feature='Buku Besar' />}
          </div>
        </div>

        <div className='bg-muted/50 flex justify-end gap-3 border-t p-4'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='gap-2'
          >
            <X className='h-4 w-4' /> Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
