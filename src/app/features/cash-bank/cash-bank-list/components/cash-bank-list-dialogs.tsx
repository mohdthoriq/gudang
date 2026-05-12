import { CashBankListActionDialog } from './cash-bank-list-action-dialog'
import { useCashBankLists } from './cash-bank-list-provider'

export function CashBankListDialogs() {
  const { open, setOpen } = useCashBankLists()

  return (
    <>
      <CashBankListActionDialog
        key='cash-bank-list-transfer'
        open={open === 'transfer'}
        onOpenChange={(state) => setOpen(state ? 'transfer' : null)}
      />
    </>
  )
}
