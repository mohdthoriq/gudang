import { TagsActionDialog } from './tags-action-dialog'
import { useTags } from './tags-provider'

export function TagsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTags()

  return (
    <>
      <TagsActionDialog
        key='tag-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <TagsActionDialog
            key={`tag-edit-${currentRow.id}`}
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
