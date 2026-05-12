import { TaxesActionDialog } from './taxes-action-dialog'
import { useTaxes } from './taxes-provider'

export function TaxesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTaxes()

  return (
    <>
      <TaxesActionDialog
        key='tax-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <TaxesActionDialog
            key={`tax-edit-${currentRow.id}`}
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
