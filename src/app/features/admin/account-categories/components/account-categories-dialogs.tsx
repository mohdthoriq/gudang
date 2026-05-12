import { ConfirmDialog } from '@/components/dialog/confirm.dialog'
import { useDeleteAccountCategoryMutation } from '../hooks/use-account-categories-mutation'
import { AccountCategoriesActionDialog } from './account-categories-action-dialog'
import { AccountCategoriesDetailDialog } from './account-categories-detail-dialog'
import { useAccountCategories } from './account-categories-provider'

export function AccountCategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAccountCategories()

  const { mutate: deleteAccountCategory, isPending } =
    useDeleteAccountCategoryMutation()

  return (
    <>
      <AccountCategoriesActionDialog
        key='account-categories-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <AccountCategoriesActionDialog
            key={`account-categories-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <AccountCategoriesDetailDialog
            key={`account-categories-view-${currentRow.id}`}
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
            key={`account-categories-delete-${currentRow.id}`}
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              deleteAccountCategory({
                id: currentRow.id,
              })
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            disabled={isPending}
            className='max-w-md'
            title={`Hapus kategori akun "${currentRow.name}" ?`}
            desc={
              <>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus secara
                permanen kategori akun{' '}
                <span className='text-foreground font-semibold'>
                  "{currentRow.name}"
                </span>{' '}
                dari perusahaan Anda.
              </>
            }
            confirmText={`${isPending ? 'Deleting...' : 'Delete'}`}
          />
        </>
      )}
    </>
  )
}
