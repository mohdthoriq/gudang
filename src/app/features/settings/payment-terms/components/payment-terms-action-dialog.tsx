'use client'

import type { PaymentTerm } from '@/types'
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
import { usePaymentTermsForm } from '../hooks/use-payment-terms-form'

type PaymentTermsActionDialogProps = {
  currentRow?: PaymentTerm
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (data: PaymentTerm) => void
}

export function PaymentTermsActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: PaymentTermsActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting, errorMessage } = usePaymentTermsForm({
    currentRow,
    onSuccess,
  })

  const hasPermission = useHasPermission(
    isEdit
      ? PERMISSION_KEY.SETTINGS_PAYMENT_TERM_EDIT
      : PERMISSION_KEY.SETTINGS_PAYMENT_TERM_ADD
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
            {isEdit ? 'Update Termin' : 'Tambah Termin'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui detail termin di sini.'
              : 'Buat termin baru untuk perusahaan Anda.'}{' '}
            Klik simpan setelah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className={cn('py-4', !hasPermission && 'relative')}>
          <Form {...form}>
            <form
              id='payment-term-form'
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
                    <FormLabel>Nama Termin</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan nama termin...'
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
                name='days'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lama (Hari)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan lama termin pembayaran...'
                        autoComplete='off'
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === ''
                              ? undefined
                              : Number(e.target.value)
                          )
                        }}
                        type='number'
                        value={field.value}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        endAdornment={'Days'}
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
              feature={isEdit ? 'Edit Termin' : 'Tambah Termin'}
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
          <Button
            type='submit'
            form='payment-term-form'
            disabled={isSubmitting}
          >
            {isEdit ? 'Update Termin' : 'Tambah Termin'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
