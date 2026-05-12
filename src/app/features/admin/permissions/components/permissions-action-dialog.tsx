'use client'

import { type Permission } from '@/types'
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
import { Textarea } from '@/components/ui/textarea'
import { usePermissionsForm } from '../hooks/use-permissions-form'
import { PermissionCombobox } from './permission-combobox'

type PermissionsActionDialogProps = {
  currentRow?: Permission
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PermissionsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: PermissionsActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting } = usePermissionsForm({
    currentRow,
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        form.reset()
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Update Permission' : 'Tambah Permission'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update permission disini.'
              : 'Tambah permission baru untuk Aplikasi Manajerku. '}
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Form {...form}>
            <form
              id='role-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Permission</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan nama permission...'
                        autoComplete='off'
                        {...field}
                        disabled={isEdit}
                        readOnly={isEdit}
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
                        placeholder='Masukkan urutan permission...'
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
                name='parent_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Permission</FormLabel>
                    <FormControl>
                      <PermissionCombobox
                        value={field.value || ''}
                        onValueChange={field.onChange}
                        placeholder='Pilih parent permission...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Masukkan deskripsi permission...'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='role-form' disabled={isSubmitting}>
            {isEdit ? 'Update Permission' : 'Tambah Permission'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
