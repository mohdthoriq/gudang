import type { SalesOrder } from '@/types'
import { ConfirmDialog } from '@/components/dialog/confirm.dialog'

interface OrderDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  order: SalesOrder | null
  isLoading?: boolean
}

export function OrderDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  order,
  isLoading,
}: OrderDeleteDialogProps) {
  if (!order) return null

  // For orders, we might have different deletion rules than invoices
  // but for now let's assume it's deletable if it's draft or unpaid
  const isDeletable = order.document_status === 'draft'

  if (!isDeletable) {
    return (
      <ConfirmDialog
        open={open}
        onOpenChange={onOpenChange}
        title='Order Tidak Dapat Dihapus'
        desc={
          <p className='text-muted-foreground text-sm'>
            Order <span className='font-bold'>{order.order_number}</span>{' '}
            hanya dapat dihapus saat status masih <span className='font-bold'>Draft</span>.
          </p>
        }
        confirmText='Mengerti'
        handleConfirm={() => onOpenChange(false)}
      />
    )
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Hapus Sales Order'
      desc={
        <p className='text-muted-foreground text-sm'>
          Apakah Anda yakin ingin menghapus sales order{' '}
          <span className='font-bold'>{order.order_number}</span>? Tindakan
          ini tidak dapat dibatalkan.
        </p>
      }
      destructive
      confirmText='Hapus'
      isLoading={isLoading}
      handleConfirm={onConfirm}
    />
  )
}
