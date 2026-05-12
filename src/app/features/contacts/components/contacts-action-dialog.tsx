'use client'

import { type Contact } from '@/types'
import { CheckCircle2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { useContactsForm } from '../hooks/use-contacts-form'
import { ContactTypeCombobox } from './contacts-combobox'

type ContactsActionDialogProps = {
  currentRow?: Contact
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (data: unknown) => void
}

export function ContactsActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ContactsActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting, errorMessage } = useContactsForm({
    currentRow,
    onSuccess,
  })

  const hasPermission = useHasPermission(
    isEdit ? PERMISSION_KEY.CONTACT_EDIT : PERMISSION_KEY.CONTACT_ADD
  )

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
            {isEdit ? 'Update Kontak' : 'Tambah Kontak'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update kontak disini.'
              : 'Tambah kontak baru untuk Perusahaan Anda.'}
          </DialogDescription>
        </DialogHeader>
        <div className={cn('py-4', !hasPermission && 'relative')}>
          <Form {...form}>
            <form
              id='contact-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn(
                'space-y-4',
                !hasPermission && 'pointer-events-none opacity-100 blur-[2px]'
              )}
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kontak</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan nama kontak...'
                        autoComplete='off'
                        {...field}
                        disabled={!hasPermission}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Kontak</FormLabel>
                    <FormControl>
                      <ContactTypeCombobox
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder='Pilih tipe kontak...'
                        companyId={currentRow?.company?.id}
                        disabled={!hasPermission}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='company_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perusahaan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan nama perusahaan...'
                        autoComplete='off'
                        {...field}
                        disabled={!hasPermission}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='08123456789'
                        autoComplete='off'
                        {...field}
                        disabled={!hasPermission}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='email@example.com'
                        autoComplete='off'
                        {...field}
                        disabled={!hasPermission}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Jl. Contoh No. 1'
                        autoComplete='off'
                        {...field}
                        disabled={!hasPermission}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          {!hasPermission && (
            <UpgradePlanCard
              type='dialog'
              feature={isEdit ? 'Edit Kontak' : 'Tambah Kontak'}
            />
          )}
        </div>
        {errorMessage && (
          <Alert variant='destructive' className='w-full'>
            <CheckCircle2Icon />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button type='submit' form='contact-form' disabled={isSubmitting}>
            {isEdit ? 'Update Kontak' : 'Tambah Kontak'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
