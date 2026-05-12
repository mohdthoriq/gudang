import { type Subscription } from '@/types'
import { formatDate } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type SubscriptionsDetailDialogProps = {
  currentRow: Subscription
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscriptionsDetailDialog({
  currentRow,
  open,
  onOpenChange,
}: SubscriptionsDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detail Subscription</DialogTitle>
          <DialogDescription>
            Detail informasi subscription yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Perusahaan
            </h4>
            <p className='text-sm font-medium'>{currentRow.company?.name}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Plan
            </h4>
            <p className='text-sm'>{currentRow.plan_name || '-'}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Tanggal Mulai Berlangganan
            </h4>
            <p className='text-sm'>{formatDate(currentRow.start_date)}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Tanggal Berakhir Berlangganan
            </h4>
            <p className='text-sm'>
              {currentRow.end_date ? formatDate(currentRow.end_date) : '-'}
            </p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Status
            </h4>
            <p className='text-sm'>{currentRow.Subscriptions_status || '-'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
