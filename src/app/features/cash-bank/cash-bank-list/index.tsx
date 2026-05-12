import { useState, useMemo } from 'react'
import type { CashBankOverview } from '@/types'
import { Plus, Search, X } from 'lucide-react'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PermissionGuard } from '@/components/permission-guard'
import { CashBankOverviewFallback } from './components/cash-bank-overview-fallback'
import { useCashBankOverviewQuery } from './hooks/use-cash-bank-list-query'
import { AccountChartCard } from './pages/account-chart-card'

export default function CashBankOverviewPage() {
  const { openDialog } = useGlobalDialogStore()
  const { data, isLoading } = useCashBankOverviewQuery()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    if (!data) return []
    const accounts = Array.isArray(data) ? data : [data]
    if (!searchQuery) return accounts

    const query = searchQuery.toLowerCase()
    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(query) ||
        account.code.toLowerCase().includes(query)
    )
  }, [data, searchQuery])

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.CASH_BANK_OVERVIEW_VIEW}
      fallback={<CashBankOverviewFallback />}
    >
      <Card className='flex flex-col gap-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Kas & Bank</h1>
            <p className='text-muted-foreground'>
              Kelola saldo dan transaksi kas serta rekening bank Anda.
            </p>
          </div>
          <Button
            className='flex items-center gap-2'
            onClick={() =>
              openDialog('account', {
                data: { is_cash_bank: true },
              })
            }
          >
            <Plus className='h-4 w-4' />
            Tambah Akun
          </Button>
        </div>
        <div className='flex items-center justify-end'>
          <Input
            placeholder='Cari nama atau kode akun...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={<Search className='h-4 w-4' />}
            endAdornment={
              searchQuery && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 rounded-full'
                  onClick={() => setSearchQuery('')}
                >
                  <X className='h-3 w-3' />
                </Button>
              )
            }
          />
        </div>

        <div className='grid grid-cols-1 gap-6'>
          {isLoading ? (
            <div className='flex h-64 items-center justify-center'>
              <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((account: CashBankOverview, index: number) => (
              <AccountChartCard key={index} data={account} />
            ))
          ) : (
            <div className='border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-20 text-center transition-all'>
              <h3 className='text-foreground text-2xl font-bold tracking-tight'>
                {searchQuery ? 'Tidak Ada Hasil' : 'Belum ada akun'}
              </h3>
              <p className='text-muted-foreground mt-2 max-w-sm text-lg'>
                {searchQuery
                  ? `Tidak ada hasil untuk "${searchQuery}". Coba gunakan kata kunci lain atau bersihkan pencarian.`
                  : 'Anda belum menambahkan akun kas atau bank. Tambahkan sekarang untuk mulai melacak keuangan Anda.'}
              </p>
              <div className='mt-10 flex gap-4'>
                {searchQuery ? (
                  <Button
                    variant='outline'
                    size='lg'
                    className='hover:bg-background px-8 shadow-sm transition-all'
                    onClick={() => setSearchQuery('')}
                  >
                    Bersihkan Pencarian
                  </Button>
                ) : (
                  <Button
                    size='lg'
                    className='shadow-primary/20 gap-2 px-8 shadow-lg transition-all hover:scale-105 active:scale-95'
                    onClick={() =>
                      openDialog('account', {
                        data: {
                          is_cash_bank: true,
                        },
                      })
                    }
                  >
                    <Plus className='h-5 w-5' />
                    Tambah Akun Baru
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </PermissionGuard>
  )
}
