import { ConfirmDialog } from '@/components/dialog/confirm.dialog'
import { useDeleteMenuMutation } from '../hooks/use-menus-mutation'
import { MenusActionDialog } from './menus-action-dialog'
import { MenusDetailDialog } from './menus-detail-dialog'
import { useMenus } from './menus-provider'

export function MenusDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMenus()

  const { mutate: deleteMenu, isPending } = useDeleteMenuMutation()

  return (
    <>
      <MenusActionDialog
        key='menu-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <MenusActionDialog
            key={`menu-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <MenusDetailDialog
            key={`menu-view-${currentRow.id}`}
            open={open === 'view'}
            onOpenChange={() => {
              setOpen('view')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key={`menu-delete-${currentRow.id}`}
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              deleteMenu({
                id: currentRow.id,
              })
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            disabled={isPending}
            className='max-w-md'
            title={`Hapus menu "${currentRow.name}" ?`}
            desc={
              <>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus secara
                permanen menu{' '}
                <span className='text-foreground font-semibold'>
                  "{currentRow.name}"
                </span>{' '}
                dari Aplikasi Manajerku.
              </>
            }
            confirmText={`${isPending ? 'Deleting...' : 'Delete'}`}
          />
        </>
      )}
    </>
  )
}
