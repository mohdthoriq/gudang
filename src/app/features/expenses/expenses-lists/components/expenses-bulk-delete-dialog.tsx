import { useState } from 'react'
import type { Expense } from '@/types'
import { AlertCircle, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/dialog/confirm.dialog'

interface ExpensesBulkDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (ids: string[]) => void
  selectedRows: Expense[]
  isLoading?: boolean
}

export function ExpensesBulkDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedRows,
  isLoading,
}: ExpensesBulkDeleteDialogProps) {
  const [confirmValue, setConfirmValue] = useState('')

  const handleConfirm = () => {
    if (confirmValue === 'DELETE') {
      onConfirm(selectedRows.map((i) => i.id))
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
      title={
        <div className='flex items-center gap-2'>
          <Trash2 className='text-destructive h-5 w-5' />
          <span>Hapus Multiple Biaya</span>
        </div>
      }
      destructive
      disabled={confirmValue !== 'DELETE' || selectedRows.length === 0}
      isLoading={isLoading}
      handleConfirm={handleConfirm}
      confirmText='Hapus Biaya'
      desc={
        <div className='mt-2 space-y-4 text-start'>
          <Alert
            variant='destructive'
            className='bg-destructive/5 border-destructive/20'
          >
            <AlertCircle className='h-4 w-4' />
            <AlertTitle className='text-sm font-semibold'>
              Peringatan
            </AlertTitle>
            <AlertDescription className='text-xs opacity-90'>
              Anda akan menghapus <strong>{selectedRows.length} biaya</strong>.
              Tindakan ini permanen dan tidak dapat dibatalkan.
            </AlertDescription>
          </Alert>

          <div className='bg-muted/30 space-y-3 rounded-lg border p-4 font-medium'>
            <div className='space-y-1.5'>
              <Label
                htmlFor='confirmDelete'
                className='text-muted-foreground text-xs'
              >
                Konfirmasi penghapusan dengan mengetik kata di bawah ini:
              </Label>
              <div className='flex flex-col gap-2'>
                <p className='text-destructive text-xs font-bold tracking-wider uppercase'>
                  DELETE
                </p>
                <Input
                  id='confirmDelete'
                  placeholder='DELETE'
                  value={confirmValue}
                  onChange={(e) => setConfirmValue(e.target.value)}
                  autoComplete='off'
                />
              </div>
            </div>
          </div>
        </div>
      }
    />
  )
}
