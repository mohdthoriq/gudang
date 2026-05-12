'use client'

import { type Menu } from '@/types'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMenusForm } from '../hooks/use-menus-form'
import { MenusCombobox } from './menus-combobox'

type MenusActionDialogProps = {
  currentRow?: Menu
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MenusActionDialog({
  currentRow,
  open,
  onOpenChange,
}: MenusActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting } = useMenusForm({
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
          <DialogTitle>{isEdit ? 'Update Menu' : 'Tambah Menu'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update menu disini.'
              : 'Tambah menu baru untuk Aplikasi Manajerku. '}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[calc(100vh-200px)] py-4'>
          <div className='pr-4 pl-2'>
            <Form {...form}>
              <form
                id='menu-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Menu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan judul menu...'
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
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Menu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan nama menu (huruf kecil tanpa spasi)...'
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
                  name='permission_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permission</FormLabel>
                      <FormControl>
                        <MenusCombobox
                          type='permission'
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder='Pilih permission...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='category_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <MenusCombobox
                          type='category'
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder='Pilih category...'
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
                          placeholder='Masukkan urutan menu...'
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

                <FormField
                  control={form.control}
                  name='url'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Menu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan url (relative path)...'
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
                  name='parent_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Menu</FormLabel>
                      <FormControl>
                        <MenusCombobox
                          type='menu'
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder='Pilih parent menu...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='icon'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Menu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan icon menu...'
                          autoComplete='off'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        <span>Silahkan copy nama icon dari sini: </span>
                        <a
                          href='https://lucide.dev/icons/key-round?search=Menu'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary hover:text-primary/80 underline underline-offset-2'
                        >
                          LucideIcon
                        </a>
                        <br />
                        <span>
                          *penting: convert snake-case menjadi PascalCase.
                        </span>
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type='submit' form='menu-form' disabled={isSubmitting}>
            {isEdit ? 'Update Menu' : 'Tambah Menu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
