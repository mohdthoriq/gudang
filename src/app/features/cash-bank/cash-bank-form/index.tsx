import { useNavigate } from '@tanstack/react-router'
import { FinanceNumberType } from '@/types'
import { cn } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useDefaultNumberingQuery } from '@/hooks/use-auto-numbering'
import { useHasPermission } from '@/hooks/use-has-permission'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { useCashBankForm } from './hooks/use-cash-bank-form'
import { CashBankFormActions } from './sections/cash-bank-form-actions'
import { CashBankFormHeader } from './sections/cash-bank-form-header'
import { CashBankFormItems } from './sections/cash-bank-form-items'
import { CashBankFormSummary } from './sections/cash-bank-form-summary'
import type { CashBankFormEditData } from './types/cash-bank-form.schema'

type CashBankFormPageProps = {
  type: 'spend' | 'receive'
  currentRow?: CashBankFormEditData
}

export function CashBankFormPage({ type, currentRow }: CashBankFormPageProps) {
  const { data: autoNumbering } = useDefaultNumberingQuery({
    type: FinanceNumberType.bank_transaction,
  })

  const cashBankForm = useCashBankForm({
    type,
    currentRow,
    autoNumbering,
  })
  const navigate = useNavigate()

  const hasPermission = useHasPermission(
    type === 'spend'
      ? PERMISSION_KEY.CASH_BANK_SPEND
      : PERMISSION_KEY.CASH_BANK_RECEIVE
  )

  const title = type === 'spend' ? 'Kirim Dana' : 'Terima Dana'
  const EditTitle = type === 'spend' ? 'Ubah Kirim Dana' : 'Ubah Terima Dana'

  return (
    <Card className='mb-8'>
      <CardHeader>
        <CardTitle>
          <div className='flex items-center justify-between'>
            {currentRow ? EditTitle : title}
            <Button
              variant='link'
              onClick={() => {
                if (currentRow) {
                  history.back()
                } else {
                  navigate({ to: '/cash-bank' })
                }
              }}
            >
              Kembali
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(!hasPermission && 'relative')}>
          <Form {...cashBankForm.form}>
            <form
              onSubmit={cashBankForm.form.handleSubmit((data) =>
                cashBankForm.onSubmit(data)
              )}
              className={cn(
                'space-y-8',
                !hasPermission && 'pointer-events-none blur-[2px]'
              )}
              id='cash-bank-form'
            >
              <CashBankFormHeader type={type} currentRow={currentRow} />
              <div className='bg-border h-px' />
              <CashBankFormItems />
              <div className='bg-border h-px' />
              <CashBankFormSummary />
              <div className='bg-border h-px' />
              <CashBankFormActions
                isSubmitting={cashBankForm.isSubmitting}
                disabled={!hasPermission}
              />
            </form>
          </Form>
          {!hasPermission && <UpgradePlanCard feature={title} />}
        </div>
      </CardContent>
    </Card>
  )
}
