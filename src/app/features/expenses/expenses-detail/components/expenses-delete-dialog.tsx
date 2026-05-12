import type { Expense } from '@/types'
import { ConfirmDialog } from '@/components/dialog/confirm.dialog'

interface ExpenseDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  expense: Expense | null
  isLoading?: boolean
}

export function ExpenseDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  expense,
  isLoading,
}: ExpenseDeleteDialogProps) {
  if (!expense) return null

  const isDeletable =
    expense.paid_amount === 0 && expense.payment_status === 'unpaid'

  if (!isDeletable) {
    return (
      <ConfirmDialog
        open={open}
        onOpenChange={onOpenChange}
        title='Invoice Tidak Dapat Dihapus'
        desc={
          <p className='text-muted-foreground text-sm'>
            Biaya <span className='font-bold'>{expense.expense_number}</span>{' '}
            tidak dapat dihapus karena sudah memiliki transaksi pembayaran.
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
      title='Hapus Invoice'
      desc={
        <p className='text-muted-foreground text-sm'>
          Apakah Anda yakin ingin menghapus biaya{' '}
          <span className='font-bold'>{expense.expense_number}</span>? Tindakan
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
