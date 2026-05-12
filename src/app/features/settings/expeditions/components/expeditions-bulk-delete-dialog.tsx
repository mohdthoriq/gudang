import { useMemo, useState } from 'react'
import type { Expedition } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/dialog/confirm.dialog'
import { useBulkDeleteExpeditionMutation } from '../hooks/use-expeditions-mutation'

interface ExpeditionsBulkDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedRows: Expedition[]
  onSuccess?: () => void
}

export function ExpeditionsBulkDeleteDialog({
  open,
  onOpenChange,
  selectedRows,
  onSuccess,
}: ExpeditionsBulkDeleteDialogProps) {
  const [confirmValue, setConfirmValue] = useState('')
  const deleteMutation = useBulkDeleteExpeditionMutation()

  const summary = useMemo(() => {
    // For expeditions we don't have is_deletable, so all are deletable
    const deletableCount = selectedRows.length
    const nonDeletableCount = 0

    return {
      deletableCount,
      nonDeletableCount,
      deletableIds: selectedRows.map((i) => i.id),
    }
  }, [selectedRows])

  const handleConfirm = () => {
    if (confirmValue === 'DELETE') {
      deleteMutation.mutate(
        { ids: summary.deletableIds },
        {
          onSuccess: () => {
            onOpenChange(false)
            onSuccess?.()
          },
        }
      )
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
      title='Hapus Multiple Ekspedisi'
      destructive
      disabled={confirmValue !== 'DELETE' || summary.deletableCount === 0}
      isLoading={deleteMutation.isPending}
      handleConfirm={handleConfirm}
      desc={
        <div className='mt-2 space-y-4 text-start'>
          <p className='text-muted-foreground text-sm'>
            Hapus {selectedRows.length} ekspedisi yang dipilih.
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
              Ketik <span className='text-destructive'>DELETE</span> untuk mengkonfirmasi
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
