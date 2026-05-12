import { type Menu } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type MenusDetailDialogProps = {
  currentRow: Menu
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MenusDetailDialog({
  currentRow,
  open,
  onOpenChange,
}: MenusDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detail Menu</DialogTitle>
          <DialogDescription>
            Detail informasi menu yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Menu
            </h4>
            <p className='text-sm font-medium'>{currentRow.name}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Judul Menu
            </h4>
            <p className='text-sm'>{currentRow.title}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Category
            </h4>
            <p className='text-sm'>{currentRow.category?.name || '-'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
