import { ConfirmDialog } from '@/components/dialog/confirm.dialog'
import { WarehousesActionDialog } from '../../warehouse-form/components/warehouses-action-dialog'
import { useWarehouses } from './warehouses-provider'
import { useDeleteWarehouseMutation } from '../../warehouse-form/hooks/use-warehouses-mutation'

export function WarehousesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useWarehouses()

  const { mutate: deleteWarehouse, isPending } = useDeleteWarehouseMutation()

  return (
    <>
      <WarehousesActionDialog
        key='warehouse-add'
        open={open === 'add'}
        onOpenChange={(state) => !state && setOpen(null)}
      />

      {currentRow && (
        <>
          <WarehousesActionDialog
            key={`warehouse-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={(state) => {
              if (!state) {
                setOpen(null)
                setTimeout(() => setCurrentRow(null), 200)
              }
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key={`warehouse-delete-${currentRow.id}`}
            destructive
            open={open === 'delete'}
            onOpenChange={(state) => {
              if (!state) {
                setOpen(null)
                setTimeout(() => setCurrentRow(null), 200)
              }
            }}
            handleConfirm={() => {
              deleteWarehouse(
                { id: currentRow.id },
                {
                  onSuccess: () => {
                    setOpen(null)
                    setTimeout(() => setCurrentRow(null), 200)
                  },
                }
              )
            }}
            disabled={isPending}
            className='max-w-md'
            title={`Hapus gudang "${currentRow.name}" ?`}
            desc={
              <>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus secara
                permanen gudang{' '}
                <span className='text-foreground font-semibold'>
                  "{currentRow.name}"
                </span>{' '}
                dari perusahaan Anda.
              </>
            }
            confirmText={`${isPending ? 'Menghapus...' : 'Hapus'}`}
          />
        </>
      )}
    </>
  )
}
