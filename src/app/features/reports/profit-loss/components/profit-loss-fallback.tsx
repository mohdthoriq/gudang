import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { ProfitLossPageContent } from '..'
import { ProfitLossProvider } from './profit-loss-provider'

export function ProfitLossFallback() {
  return (
    <div className='relative'>
      <div className='pointer-events-none flex flex-col gap-10 opacity-100 blur-[2px]'>
        <ProfitLossProvider
          defaultDateFrom={new Date()}
          defaultDateTo={new Date()}
        >
          <ProfitLossPageContent />
        </ProfitLossProvider>
      </div>
      <UpgradePlanCard feature='Laba Rugi' />
    </div>
  )
}
