import { useExpeditions } from './expeditions-provider'
import { ExpeditionsActionDialog } from './expeditions-action-dialog'

export function ExpeditionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useExpeditions()

  return (
    <>
      <ExpeditionsActionDialog
        key='expedition-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <ExpeditionsActionDialog
          key={`expedition-edit-${currentRow.id}`}
          open={open === 'edit'}
          onOpenChange={() => {
            setOpen('edit')
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
