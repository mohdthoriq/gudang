import type { CashBankOverview } from '@/types'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { AccountChartCard } from '../pages/account-chart-card'

export function CashBankOverviewFallback() {
  const dummyAccounts: CashBankOverview[] = [
    {
      id: '1',
      name: 'Kas Utama',
      code: '1-10001',
      statement_balance: 1250000,
      closing_balance: 1250000,
      graphic: [
        { date: new Date('2024-01-01'), balance: 1000000 },
        { date: new Date('2024-02-01'), balance: 1250000 },
      ],
    },
    {
      id: '2',
      name: 'Bank BCA',
      code: '1-10002',
      statement_balance: 15400000,
      closing_balance: 15400000,
      graphic: [
        { date: new Date('2024-01-01'), balance: 12000000 },
        { date: new Date('2024-02-01'), balance: 15400000 },
      ],
    },
  ]

  return (
    <Card className='relative flex flex-col gap-6 overflow-hidden p-6'>
      <div className='pointer-events-none opacity-100 blur-[2px] space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Kas & Bank</h1>
            <p className='text-muted-foreground'>
              Kelola saldo dan transaksi kas serta rekening bank Anda.
            </p>
          </div>
          <Button className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Tambah Akun
          </Button>
        </div>
        <div className='flex items-center justify-end'>
          <Input
            placeholder='Cari nama atau kode akun...'
            startAdornment={<Search className='h-4 w-4' />}
            disabled
          />
        </div>

        <div className='grid grid-cols-1 gap-6'>
          {dummyAccounts.map((account) => (
            <AccountChartCard key={account.id} data={account} />
          ))}
        </div>
      </div>
      <UpgradePlanCard feature='Kas & Bank' />
    </Card>
  )
}
