import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { CashBankPaymentsCard } from './components/cash-bank-payments-card'
import type { CashBankTransactionDetail } from '@/types'

interface CashBankEditProps {
  transaction: CashBankTransactionDetail
}

export function CashBankEdit({ transaction }: CashBankEditProps) {
  const hasPermission = useHasPermission(PERMISSION_KEY.CASH_BANK_EDIT)

  return (
    <div className='space-y-6'>
      <Card className='relative overflow-hidden'>
        <div className={cn(!hasPermission && 'pointer-events-none blur-[2px]')}>
          <CardHeader>
            <div className='mb-2 flex items-center justify-between'>
              <div>
                <h1 className='text-4xl font-semibold tracking-tight'>
                  Ubah Transaksi {transaction?.entry_number || (typeof transaction?.reference === 'object' ? transaction?.reference?.number : '')}
                </h1>
              </div>
              <div className='mr-4 flex gap-2'>
                <Button
                  variant='outline'
                  onClick={() => history.back()}
                  className='gap-2'
                >
                  <ArrowLeft className='h-4 w-4' /> Kembali
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <CashBankPaymentsCard transaction={transaction} hasPermission={hasPermission}/>
          </CardContent>
        </div>
        {!hasPermission && <UpgradePlanCard feature='Ubah Transaksi' />}
      </Card>
    </div>
  )
}
