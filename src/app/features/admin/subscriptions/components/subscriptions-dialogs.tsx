import { ConfirmDialog } from '@/components/dialog/confirm.dialog'
import { useDeleteSubscriptionMutation } from '../hooks/use-subscriptions-mutation'
import { SubscriptionsActionDialog } from './subscriptions-action-dialog'
import { SubscriptionsDetailDialog } from './subscriptions-detail-dialog'
import { useSubscriptions } from './subscriptions-provider'

export function SubscriptionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSubscriptions()

  const { mutate: deleteSubscription, isPending } =
    useDeleteSubscriptionMutation()

  return (
    <>
      <SubscriptionsActionDialog
        key='subscription-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <SubscriptionsActionDialog
            key={`subscription-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <SubscriptionsDetailDialog
            key={`subscription-view-${currentRow.id}`}
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
            key={`subscription-delete-${currentRow.id}`}
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              deleteSubscription({
                id: currentRow.id,
              })
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            disabled={isPending}
            className='max-w-md'
            title={`Hapus berlangganan "${currentRow.company?.name}" ?`}
            desc={
              <>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus secara
                permanen berlangganan{' '}
                <span className='text-foreground font-semibold'>
                  "{currentRow.company?.name}"
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
