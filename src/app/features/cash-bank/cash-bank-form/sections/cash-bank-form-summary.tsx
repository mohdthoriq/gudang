import { useTaxesQuery } from '@/features/settings/taxes/hooks/use-taxes-query'
import { useCashBankTotals } from '../hooks/use-cash-bank-totals'

export function CashBankFormSummary() {
  const { data: taxes } = useTaxesQuery({ page: 1, limit: 100 })
  const totals = useCashBankTotals(taxes?.data || [])

  return (
    <div className='flex justify-end'>
      <div className='w-full space-y-2 md:w-1/3'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Sub Total</span>
          <span>{totals.subtotal.toLocaleString()}</span>
        </div>

        {/* Tax Breakdown */}
        {Object.entries(totals.taxBreakdown).map(([name, amount]) => (
          <div key={name} className='flex justify-between'>
            <span className='text-muted-foreground'>{name}</span>
            <span>{amount.toLocaleString()}</span>
          </div>
        ))}

        {!Object.keys(totals.taxBreakdown).length && (
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Total Pajak</span>
            <span>{totals.taxTotal.toLocaleString()}</span>
          </div>
        )}

        {/* Withholding Total */}
        {totals.withholdingTotal > 0 && (
          <div className='flex justify-between'>
            <span className='text-destructive'>Pemotongan</span>
            <span className='text-destructive font-medium'>
              -{totals.withholdingTotal.toLocaleString()}
            </span>
          </div>
        )}

        <div className='bg-border my-2 h-px' />

        <div className='flex justify-between text-xl font-bold'>
          <span>Total</span>
          <span className='text-primary'>
            Rp {totals.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
