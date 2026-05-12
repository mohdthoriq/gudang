'use client'

import type { Tax } from '@/types'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
// import { Textarea } from '@/components/ui/textarea'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { AccountsCombobox } from '@/features/account/components/account-combobox'
import { useTaxesForm } from '../hooks/use-taxes-form'

type TaxesActionDialogProps = {
  currentRow?: Tax
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (data: Tax) => void
}

export function TaxesActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: TaxesActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting, errorMessage } = useTaxesForm({
    currentRow,
    onSuccess,
  })

  const hasPermission = useHasPermission(
    isEdit ? PERMISSION_KEY.SETTINGS_TAX_EDIT : PERMISSION_KEY.SETTINGS_TAX_ADD
  )

  const isWithholding = form.watch('is_withholding')
  const isNotDeletable = isEdit && currentRow?.is_deletable === false

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
          <DialogTitle>{isEdit ? 'Update Pajak' : 'Tambah Pajak'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui detail pajak di sini.'
              : 'Buat pajak baru untuk perusahaan Anda.'}{' '}
            Klik simpan setelah selesai.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[60vh] w-full'>
          <div className={cn('py-4 pr-4 pl-2', !hasPermission && 'relative')}>
            <Form {...form}>
              <form
                id='tax-form'
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
                      <FormLabel>Nama Pajak</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan nama pajak...'
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
                  name='rate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Persentase (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan persentase pajak...'
                          autoComplete='off'
                          onChange={(e) => {
                            field.onChange(
                              e.target.value === ''
                                ? ''
                                : Number(e.target.value)
                            )
                          }}
                          type='number'
                          startAdornment={
                            <span className='text-muted-foreground'>%</span>
                          }
                          value={field.value ?? ''}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          disabled={!hasPermission}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='is_withholding'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                      <div className='grow space-y-0.5'>
                        <FormLabel>Pemotongan</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            const currentBuyAccount =
                              form.getValues('buy_account_id')
                            const currentSellAccount =
                              form.getValues('sell_account_id')
                            form.setValue('sell_account_id', currentBuyAccount)
                            form.setValue('buy_account_id', currentSellAccount)
                          }}
                          disabled={!hasPermission || isNotDeletable}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='sell_account_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Akun Pajak Penjualan</FormLabel>
                      <FormControl>
                        <AccountsCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder='Pilih akun pajak penjualan...'
                          disabled={!hasPermission || isNotDeletable}
                          isParent={false}
                          codePrefixes={isWithholding ? [
                            '1-10',
                            '4-40',
                            '6-60',
                            '7-70',
                            '8-80',
                            '8-81',
                            '9-90',
                          ] : [
                            '2-20',
                            '4-40',
                            '6-60',
                            '7-70',
                            '8-80',
                            '8-81',
                            '9-90',
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='buy_account_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Akun Pajak Pembelian</FormLabel>
                      <FormControl>
                        <AccountsCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder='Pilih akun pajak pembelian...'
                          disabled={!hasPermission || isNotDeletable}
                          isParent={false}
                          codePrefixes={isWithholding ? [
                            '2-20',
                            '4-40',
                            '6-60',
                            '7-70',
                            '8-80',
                            '8-81',
                            '9-90',
                          ] : [
                            '1-10',
                            '4-40',
                            '6-60',
                            '7-70',
                            '8-80',
                            '8-81',
                            '9-90',
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Deskripsikan pajak ini...'
                          className='min-h-[80px] resize-none'
                          {...field}
                          disabled={!hasPermission}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </form>
            </Form>
            {!hasPermission && (
              <UpgradePlanCard
                type='dialog'
                feature={isEdit ? 'Edit Pajak' : 'Tambah Pajak'}
              />
            )}
          </div>
        </ScrollArea>

        {errorMessage && (
          <Alert variant='destructive' className='w-full'>
            <CheckCircle2Icon />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button type='submit' form='tax-form' disabled={isSubmitting}>
            {isEdit ? 'Update Pajak' : 'Tambah Pajak'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
