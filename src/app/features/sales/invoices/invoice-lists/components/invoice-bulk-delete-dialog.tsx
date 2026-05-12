import { useMemo, useState } from 'react'
import type { SalesInvoice } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/dialog/confirm.dialog'

interface SalesInvoiceBulkDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (ids: string[]) => void
  selectedRows: SalesInvoice[]
  isLoading?: boolean
}

export function SalesInvoiceBulkDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedRows,
  isLoading,
}: SalesInvoiceBulkDeleteDialogProps) {
  const [confirmValue, setConfirmValue] = useState('')

  const summary = useMemo(() => {
    const deletableCount = selectedRows.filter(
      (invoice) =>
        invoice.payments.length === 0 && invoice.payment_status === 'unpaid'
    ).length
    const nonDeletableCount = selectedRows.length - deletableCount

    return {
      deletableCount,
      nonDeletableCount,
      deletableIds: selectedRows
        .filter(
          (invoice) =>
            invoice.payments.length === 0 && invoice.payment_status === 'unpaid'
        )
        .map((i) => i.id),
    }
  }, [selectedRows])

  const handleConfirm = () => {
    if (confirmValue === 'DELETE') {
      onConfirm(summary.deletableIds)
      setConfirmValue('')
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) setConfirmValue('')
      }}
      title='Hapus Multiple Invoice'
      destructive
      disabled={confirmValue !== 'DELETE' || summary.deletableCount === 0}
      isLoading={isLoading}
      handleConfirm={handleConfirm}
      desc={
        <div className='mt-2 space-y-4 text-start'>
          <p className='text-muted-foreground text-sm'>
            Hapus {selectedRows.length} invoice yang dipilih. Invoice yang sudah
            memiliki transaksi pembayaran tidak dapat dihapus.
          </p>

          <div className='divide-border overflow-hidden rounded-md border text-sm'>
            <div className='bg-muted/50 grid grid-cols-[1fr_100px] border-b font-medium'>
              <div className='p-2 px-3'>Status</div>
              <div className='border-l p-2 text-center'>Jumlah</div>
            </div>
            <div className='grid grid-cols-[1fr_100px] border-b'>
              <div className='p-2 px-3'>Bisa dihapus</div>
              <div className='border-l p-2 text-center'>
                {summary.deletableCount}
              </div>
            </div>
            <div className='grid grid-cols-[1fr_100px]'>
              <div className='p-2 px-3'>Tidak bisa dihapus</div>
              <div className='border-l p-2 text-center'>
                {summary.nonDeletableCount}
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmDelete' className='text-xs font-bold'>
              Ketik <span className='text-destructive'>DELETE</span> untuk
              mengkonfirmasi
            </Label>
            <Input
              id='confirmDelete'
              placeholder='DELETE'
              value={confirmValue}
              onChange={(e) => setConfirmValue(e.target.value)}
            />
          </div>
        </div>
      }
    />
  )
}
