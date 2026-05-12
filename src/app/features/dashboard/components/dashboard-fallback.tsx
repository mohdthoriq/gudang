import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { BillsOverview } from './bills-overview'
import { CashOverview } from './cash-overview'
import { ExpenseOverview } from './expense-overview'
import { SalesDashboardOverview } from './sales-overview'

export function DashboardFallback() {
  return (
    <div className='relative'>
      <div className='pointer-events-none mb-10 flex items-center justify-between space-y-2 opacity-100 blur-[2px]'>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' className='gap-2 shadow-sm'>
            <Printer className='h-4 w-4' /> Cetak
          </Button>
        </div>
      </div>
      <div className='pointer-events-none grid gap-x-4 gap-y-6 opacity-100 blur-[2px] sm:grid-cols-1 lg:grid-cols-2'>
        <CashOverview />
        <BillsOverview />
        <SalesDashboardOverview />
        <ExpenseOverview />
      </div>
      <UpgradePlanCard feature='Dashboard' />
    </div>
  )
}
