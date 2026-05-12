'use client'

import type { Subscription } from '@/types'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/forms/date-picker'
import { useSubscriptionsForm } from '../hooks/use-subscriptions-form'
import { StatusSubscriptions } from '../types/subscriptions.schema'
import { SubscriptionsCombobox } from './subscriptions-combobox'

type SubscriptionsActionDialogProps = {
  currentRow?: Subscription
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscriptionsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: SubscriptionsActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting } = useSubscriptionsForm({
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
            {isEdit ? 'Update Subscription' : 'Tambah Subscription'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update subscription disini.'
              : 'Tambah subscription baru untuk Aplikasi Manajerku. '}
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Form {...form}>
            <form
              id='subscription-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='company_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perusahaan</FormLabel>
                    <FormControl>
                      <SubscriptionsCombobox
                        type='company'
                        value={field.value || ''}
                        onValueChange={field.onChange}
                        placeholder='Pilih perusahaan...'
                        initialLabel={currentRow?.company?.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='plan_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan</FormLabel>
                    <FormControl>
                      <SubscriptionsCombobox
                        type='plan'
                        value={field.value || ''}
                        onValueChange={field.onChange}
                        placeholder='Pilih plan...'
                        initialLabel={currentRow?.plan?.name || currentRow?.plan_name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='start_date'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Tanggal Mulai</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                          className='w-full'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='end_date'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Tanggal Berakhir</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                          className='w-full'
                          endMonth={new Date(new Date().getFullYear() + 5, 11)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Pilih status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={StatusSubscriptions.Active}>
                          Aktif
                        </SelectItem>
                        <SelectItem value={StatusSubscriptions.Expired}>
                          Expired
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='subscription-form'
            disabled={isSubmitting}
          >
            {isEdit ? 'Update Subscription' : 'Tambah Subscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
