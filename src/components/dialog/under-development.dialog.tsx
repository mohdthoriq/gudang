"use client"

import { Construction } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type UnderDevelopmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureName?: string
}

export function UnderDevelopmentDialog({
  open,
  onOpenChange,
  featureName,
}: UnderDevelopmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm text-center' showCloseButton={false}>
        <DialogHeader className='items-center gap-3'>
          <div className='bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full'>
            <Construction className='size-8' />
          </div>
          <DialogTitle className='text-lg font-semibold'>
            Fitur ini sedang dalam proses pengembangan
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm text-center'>
            {featureName ? (
              <>
                Fitur{' '}
                <span className='text-foreground font-medium'>
                  {featureName}
                </span>{' '}
                sedang dalam proses pengembangan dan akan segera tersedia.
              </>
            ) : (
              'Fitur ini sedang dalam proses pengembangan dan akan segera tersedia.'
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-center'>
          <Button
            onClick={() => {
              onOpenChange(false)
              history.back()
            }}
            className='w-full sm:w-auto'
          >
            Mengerti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
