import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { BalanceSheetOverviewWithFilters, BalanceSheetPageContent } from '..'
import { BalanceSheetOverviewProvider } from './balance-sheet-overview-provider'
import { BalanceSheetProvider } from './balance-sheet-provider'

export function BalanceSheetFallback() {
  return (
    <div className='relative'>
      <div className='pointer-events-none flex flex-col gap-10 opacity-100 blur-[2px]'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-semibold tracking-tight'>Neraca</h1>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant={'outline'} onClick={() => history.back()}>
              <ArrowLeft className='h-4 w-4' />
              Kembali
            </Button>
          </div>
        </div>
        <BalanceSheetOverviewProvider defaultDate={new Date()}>
          <BalanceSheetOverviewWithFilters />
        </BalanceSheetOverviewProvider>

        <BalanceSheetProvider defaultDate={new Date()}>
          <BalanceSheetPageContent />
        </BalanceSheetProvider>
      </div>
      <UpgradePlanCard feature='Neraca' />
    </div>
  )
}
