import { useEffect } from 'react'
import { type Expedition } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import { useExpeditionsForm } from '../hooks/use-expeditions-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ExpeditionsActionDialogProps {
  currentRow?: Expedition
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExpeditionsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: ExpeditionsActionDialogProps) {
  const isEdit = !!currentRow
  const company = useAuthStore((state) => state.auth.user?.company)
  const { form, onSubmit, isSubmitting, errorMessage } = useExpeditionsForm({
    currentRow,
    onSuccess: () => onOpenChange(false),
  })

  useEffect(() => {
    if (open) {
      form.reset(
        isEdit
          ? {
              name: currentRow?.name ?? '',
              is_active: currentRow?.is_active ?? true,
              company_id: currentRow?.company_id ?? company?.id ?? '',
            }
          : {
              name: '',
              is_active: true,
              company_id: company?.id ?? '',
            }
      )
    }
  }, [open, currentRow, isEdit, form, company?.id])

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) {
          form.reset()
        }
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Ubah Ekspedisi' : 'Tambah Ekspedisi Baru'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className='-mr-4 max-h-[80vh] w-full pr-4'>
          <Form {...form}>
            <form
              id='expedition-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              {errorMessage && (
                <div className='mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
                  {errorMessage}
                </div>
              )}

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Ekspedisi <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan nama ekspedisi...'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='is_active'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Status Aktif</FormLabel>
                      <div className='text-sm text-muted-foreground'>
                        Tandai apakah ekspedisi ini aktif dan bisa digunakan
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    form.reset()
                    onOpenChange(false)
                  }}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Ekspedisi'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
