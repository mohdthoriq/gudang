import { ConfirmDialog } from '@/components/dialog/confirm.dialog'
import { useDeleteTransactionTypeMutation } from '../hooks/use-transaction-types-mutation'
import { TransactionTypesActionDialog } from './transaction-types-action-dialog'
import { TransactionTypesDetailDialog } from './transaction-types-detail-dialog'
import { useTransactionTypes } from './transaction-types-provider'

export function TransactionTypesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTransactionTypes()

  const { mutate: deleteTransactionType, isPending } =
    useDeleteTransactionTypeMutation()

  return (
    <>
      <TransactionTypesActionDialog
        key='transaction-types-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <TransactionTypesActionDialog
            key={`transaction-types-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <TransactionTypesDetailDialog
            key={`transaction-types-view-${currentRow.id}`}
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
            key={`transaction-types-delete-${currentRow.id}`}
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              deleteTransactionType(currentRow.id)
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            disabled={isPending}
            className='max-w-md'
            title={`Hapus tipe transaksi "${currentRow.name}" ?`}
            desc={
              <>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus secara
                permanen tipe transaksi{' '}
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
