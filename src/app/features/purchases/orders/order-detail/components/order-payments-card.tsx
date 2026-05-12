'use client'

import { format } from 'date-fns'
import { useWatch } from 'react-hook-form'
import { FinanceNumberType, type Tag, type PurchasesOrder } from '@/types'
import { CalendarIcon } from 'lucide-react'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { FormShortcutButton } from '@/components/forms/form-shortcut-button'
import { InputFieldNumberFormat } from '@/components/forms/input-field-number-format'
import { MultiSelectDropdown } from '@/components/forms/multi-select-dropdown'
import { useTagsQuery } from '@/features/settings/tags/hooks/use-tags-query'
import { useOrderPaymentsForm } from '../hooks/use-order-payments-form'
import { AccountsCombobox } from '@/features/account/components/account-combobox'
import { useCheckFinanceNumberQuery, useDefaultNumberingQuery } from '@/hooks/use-auto-numbering'

interface OrderPaymentsCardProps {
  order: PurchasesOrder
}

export function OrderPaymentsCard({ order }: OrderPaymentsCardProps) {
  const { data: orderPaymentsAutoNumbering } = useDefaultNumberingQuery({
    type: FinanceNumberType.sales_payment,
  })

  const openDialog = useGlobalDialogStore((state) => state.openDialog)
  const { data: tags } = useTagsQuery()

  const { form, onSubmit, isSubmitting } = useOrderPaymentsForm({
    orderId: order.id,
    defaultAmount: Number(order.outstanding),
    defaultNumber: orderPaymentsAutoNumbering,
  })

  const { control, formState } = form

  const paymentNumber = useWatch({ control, name: 'reference_no' })
  const debouncedPaymentNumber = useDebounce(paymentNumber, 500)

  const isOriginalNumber =
    !!debouncedPaymentNumber &&
    debouncedPaymentNumber === (formState.defaultValues?.reference_no ?? '')

  const {
    data: checkResult,
    isFetching: isCheckingNumber,
    isError: hasCheckError,
  } = useCheckFinanceNumberQuery({
    type: FinanceNumberType.sales_payment,
    number: debouncedPaymentNumber as string,
  })

  const numberIsTaken =
    !isOriginalNumber &&
    checkResult &&
    (checkResult.exists === true || checkResult.available === false)

  if (order.payment_status === 'paid') return null

  return (
    <Card className='border-border gap-0 shadow-none'>
      <CardHeader className='pb-3 border-none'>
        <CardTitle className='text-base font-semibold'>
          Terima Pembayaran
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className='pt-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 xl:grid-cols-3'>
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='text-xs'>Total Dibayar</FormLabel>
                    <FormControl>
                      <InputFieldNumberFormat
                        value={field.value ?? ''}
                        onValueChange={(value) => field.onChange(value ?? '')}
                        placeholder='0'
                        prefix='Rp'
                        className='h-8 text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='reference_no'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='text-xs'>Nomor Transaksi</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='Contoh: TRF-12345'
                          {...field}
                          className='h-8 text-sm'
                        />
                        {isCheckingNumber && (
                          <div className='absolute top-1/2 right-2 -translate-y-1/2'>
                            <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {numberIsTaken || hasCheckError ? (
                      <p className='text-destructive text-[0.7rem] font-medium'>
                        {checkResult?.message ||
                          (hasCheckError
                            ? 'Gagal memeriksa nomor referensi'
                            : 'Nomor referensi sudah digunakan')}
                      </p>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='account_id'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='text-xs'>Dibayar ke</FormLabel>
                    <AccountsCombobox
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      placeholder='Pilih akun'
                      className='w-full'
                      isParent={false}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='payment_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-1'>
                    <FormLabel className='text-xs'>
                      Tanggal Pembayaran
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'h-8 w-full pl-3 text-left text-sm font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd MMM yyyy')
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className='ml-auto h-3.5 w-3.5 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='text-xs'>
                      Referensi
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Referensi pembayaran...'
                        {...field}
                        className='h-8 text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='tags'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='text-xs'>Tag</FormLabel>
                    <FormControl>
                      <MultiSelectDropdown
                        options={
                          tags?.data.map((tag) => ({
                            label: tag.name,
                            value: tag.id,
                          })) || []
                        }
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder='Pilih tag'
                        action={
                          <FormShortcutButton
                            title='Tambah Tag Baru'
                            onClick={() =>
                              openDialog('tag', {
                                onSuccess: (data: Tag) => {
                                  if (data?.id) {
                                    field.onChange(data.id)
                                  }
                                },
                              })
                            }
                          />
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex justify-end pt-2'>
              <Button
                type='submit'
                size='sm'
                className='h-8 px-4 text-xs'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Simpan Pembayaran'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
