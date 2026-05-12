'use client'

import { type MenuCategory } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMenuCategoriesForm } from '../hooks/use-menu-categories-form'

type MenuCategoriesActionDialogProps = {
  currentRow?: MenuCategory
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MenuCategoriesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: MenuCategoriesActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting } = useMenuCategoriesForm({
    currentRow,
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        form.reset()
      }}
      modal
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Update Kategori Menu' : 'Tambah Kategori Menu'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update kategori menu disini.'
              : 'Tambah kategori menu baru untuk Aplikasi Manajerku.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[calc(100vh-200px)] py-4'>
          <div className='px-4'>
            <Form {...form}>
              <form
                id='menu-category-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Kategori</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan nama kategori (huruf kecil tanpa spasi)...'
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
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan tipe (e.g. sidebar, etc.)...'
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
                  name='position'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urutan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan urutan...'
                          autoComplete='off'
                          onChange={(e) => {
                            const value = e.target.valueAsNumber
                            field.onChange(isNaN(value) ? 0 : value)
                          }}
                          type='number'
                          value={field.value || ''}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type='submit' form='menu-category-form' disabled={isSubmitting}>
            {isEdit ? 'Update Kategori' : 'Tambah Kategori'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
