import { ConfirmDialog } from '@/components/dialog/confirm.dialog'
import type { CashBankTransactionDetail } from '@/types'

interface CashBankDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  transaction: CashBankTransactionDetail | null
  isLoading?: boolean
}

export function CashBankDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  transaction,
  isLoading,
}: CashBankDeleteDialogProps) {
  if (!transaction) return null

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Hapus Transaksi'
      desc={
        <p className='text-muted-foreground text-sm'>
          Apakah Anda yakin ingin menghapus transaksi{' '}
          <span className='font-bold'>
            {transaction.reference?.number || transaction.entry_number || '-'}
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>
      }
      destructive
      confirmText='Hapus'
      isLoading={isLoading}
      handleConfirm={onConfirm}
    />
  )
}
