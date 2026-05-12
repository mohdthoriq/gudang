import { ConfirmDialog } from '@/components/dialog/confirm.dialog'
import { useDeleteMenuCategoryMutation } from '../hooks/use-menu-categories-mutation'
import { MenuCategoriesActionDialog } from './menu-categories-action-dialog'
import { useMenuCategories } from './menu-categories-provider'

export function MenuCategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMenuCategories()

  const { mutate: deleteMenuCategory, isPending } = useDeleteMenuCategoryMutation()

  return (
    <>
      <MenuCategoriesActionDialog
        key='menu-category-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
      />

      {currentRow && (
        <>
          <MenuCategoriesActionDialog
            key={`menu-category-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? 'edit' : null)
              if (!isOpen) {
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key={`menu-category-delete-${currentRow.id}`}
            destructive
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? 'delete' : null)
              if (!isOpen) {
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            handleConfirm={() => {
              deleteMenuCategory({
                id: currentRow.id,
              })
            }}
            disabled={isPending}
            className='max-w-md'
            title={`Hapus kategori menu "${currentRow.name}"?`}
            desc={
              <>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus secara
                permanen kategori menu{' '}
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
