import { PaymentTermsActionDialog } from './payment-terms-action-dialog'
import { usePaymentTerms } from './payment-terms-provider'

export function PaymentTermsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePaymentTerms()

  return (
    <>
      <PaymentTermsActionDialog
        key='payment-term-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <PaymentTermsActionDialog
            key={`payment-term-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
