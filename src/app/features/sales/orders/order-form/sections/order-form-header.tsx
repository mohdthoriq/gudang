import { useEffect } from 'react'
import { addDays, format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useFormContext, useWatch } from 'react-hook-form'
import {
  type Contact,
  type Expedition,
  FinanceNumberType,
  type PaymentTerm,
  type Tag,
} from '@/types'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FormShortcutButton } from '@/components/forms/form-shortcut-button'
import { MultiSelectDropdown } from '@/components/forms/multi-select-dropdown'
import { useContactTypesQuery } from '@/features/contacts/hooks/use-contacts-query'
import { useExpeditionsQuery } from '@/features/settings/expeditions/hooks/use-expeditions-query'
import { usePaymentTermsQuery } from '@/features/settings/payment-terms/hooks/use-payment-terms-query'
import { useTagsQuery } from '@/features/settings/tags/hooks/use-tags-query'
import { OrderFormCombobox } from '../components/order-form-combobox'
import type {
  CreateSalesOrderFormData,
  UpdateSalesOrderFormData,
} from '../types/order-form.schema'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCheckFinanceNumberQuery } from '@/hooks/use-auto-numbering'

export function OrderFormHeader() {
  const { control, formState, setValue } = useFormContext<
    CreateSalesOrderFormData | UpdateSalesOrderFormData
  >()
  const { data: paymentTerms } = usePaymentTermsQuery({ page: 1, limit: 100 })
  const { data: tags } = useTagsQuery({ page: 1, limit: 100 })
  const { data: contactTypes } = useContactTypesQuery({ page: 1, limit: 100 })
  const { data: expeditions } = useExpeditionsQuery({ page: 1, limit: 100 })
  const { openDialog } = useGlobalDialogStore()

  const customerTypeId = contactTypes?.data?.find(
    (type) => type.name.toLowerCase() === 'pelanggan'
  )?.id

  const orderNumber = useWatch({ control, name: 'order_number' })
  const paymentTermsValue = useWatch({ control, name: 'payment_term_id' })
  const orderDate = useWatch({ control, name: 'order_date' })
  const debouncedOrderNumber = useDebounce(orderNumber, 500)

  const isOriginalNumber =
    !!debouncedOrderNumber &&
    debouncedOrderNumber === (formState.defaultValues?.order_number ?? '')

  useEffect(() => {
    if (paymentTermsValue && paymentTerms?.data) {
      const selectedTerm = paymentTerms.data.find(
        (term) => term.id === paymentTermsValue
      )
      if (selectedTerm && orderDate) {
        const dueDate = addDays(new Date(orderDate), selectedTerm.days)
        setValue('due_date', dueDate)
      }
    }
  }, [paymentTermsValue, orderDate, paymentTerms, setValue])

  const {
    data: checkResult,
    isFetching: isCheckingNumber,
    isError: hasCheckError,
  } = useCheckFinanceNumberQuery({
    type: FinanceNumberType.sales_order,
    number: debouncedOrderNumber,
  })

  const numberIsTaken =
    !isOriginalNumber &&
    checkResult &&
    (checkResult.exists === true || checkResult.available === false)

  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-3'>
      <div className='col-span-1 md:col-span-2 lg:col-span-1'>
        <FormField
          control={control}
          name='customer_id'
          render={({ field }) => (
            <FormItem className='mb-0 space-y-1'>
              <FormLabel className='text-xs'>Pelanggan</FormLabel>
              <FormControl>
                <OrderFormCombobox
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value)
                  }}
                  placeholder='Pilih Pelanggan'
                  contactTypeId={customerTypeId}
                  action={
                    <FormShortcutButton
                      title='Tambah Pelanggan Baru'
                      onClick={() =>
                        openDialog('contact', {
                          onSuccess: (data: Contact) => {
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

      <FormField
        control={control}
        name='order_number'
        render={({ field }) => (
          <FormItem className='mb-0 space-y-1'>
            <FormLabel className='text-xs'>Nomor Order</FormLabel>
            <FormControl>
              <div className='relative'>
                <Input placeholder='SO-001' {...field} />
                {isCheckingNumber && (
                  <div className='absolute top-1/2 right-2 -translate-y-1/2'>
                    <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
                  </div>
                )}
              </div>
            </FormControl>
            {numberIsTaken || hasCheckError ? (
              <p className='text-destructive text-[0.8rem] font-medium'>
                {checkResult?.message ||
                  (hasCheckError
                    ? 'Gagal memeriksa nomor order'
                    : 'Nomor order sudah digunakan')}
              </p>
            ) : (
              <FormMessage />
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='note'
        render={({ field }) => (
          <FormItem className='mb-0 space-y-1'>
            <FormLabel className='text-xs'>
              Referensi
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className='text-muted-foreground ml-1 text-[10px]'>
                      (?)
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Catatan internal untuk mempermudah pencarian (opsional)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Referensi (opsional)'
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='currency'
        render={({ field }) => (
          <FormItem className='mb-0 space-y-1'>
            <FormLabel className='text-xs'>Mata Uang</FormLabel>
            <FormControl>
              <Input {...field} readOnly />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='order_date'
        render={({ field }) => (
          <FormItem className='mb-0 flex flex-col space-y-1'>
            <FormLabel className='text-xs'>Tanggal Order</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'dd MMMM yyyy', { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                  disabled={(date) => date < new Date('1900-01-01')}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='due_date'
        render={({ field }) => (
          <FormItem className='mb-0 flex flex-col space-y-1'>
            <FormLabel className='text-xs'>Jatuh Tempo</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'dd MMMM yyyy', { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                  disabled={(date) => date < new Date('1900-01-01')}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='payment_term_id'
        render={({ field }) => (
          <FormItem className='mb-0 space-y-1'>
            <FormLabel className='text-xs'>Termin Pembayaran</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? undefined}>
              <FormControl>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Pilih termin pembayaran' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {paymentTerms?.data.length === 0 ? (
                  <div className='text-muted-foreground p-2 text-center text-sm'>
                    Tidak ada termin pembayaran
                  </div>
                ) : (
                  paymentTerms?.data.map((term) => (
                    <SelectItem key={term.id} value={term.id}>
                      {term.name}
                    </SelectItem>
                  ))
                )}
                <SelectSeparator />
                <FormShortcutButton
                  title='Tambah Termin Pembayaran Baru'
                  onClick={() =>
                    openDialog('payment-term', {
                      onSuccess: (data: PaymentTerm) => {
                        if (data?.id) {
                          field.onChange(data.id)
                        }
                      },
                    })
                  }
                />
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='md:col-span-2 lg:col-span-3'>
        <FormField
          control={control}
          name='tags'
          render={({ field }) => (
            <FormItem className='mb-0 space-y-1'>
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

      <div className='md:col-span-2 lg:col-span-3'>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant='link'
              className='text-primary h-auto p-0 text-xs font-medium hover:no-underline'
            >
              <div className='flex items-center gap-1'>
                <span>Tampilkan Informasi Pengiriman</span>
                <ChevronDown className='h-3 w-3' />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='CollapsibleContent'>
            <div className='overflow-hidden rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-muted/50'>
                    <TableHead className='h-10 px-2 text-xs'>
                      Tanggal Pengiriman
                    </TableHead>
                    <TableHead className='h-10 px-2 text-xs'>
                      Ekspedisi
                    </TableHead>
                    <TableHead className='h-10 px-2 text-xs'>
                      Nomor Resi
                    </TableHead>
                    <TableHead className='h-10 px-2 text-xs'>
                      Biaya Pengiriman
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className='p-2 align-top'>
                      <FormField
                        control={control}
                        name='shipping_date'
                        render={({ field }) => (
                          <FormItem className='mb-0 flex flex-col'>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'h-9 w-full pl-3 text-left text-xs font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), 'dd/MM/yyyy', {
                                        locale: id,
                                      })
                                    ) : (
                                      <span>Pilih tanggal</span>
                                    )}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-auto p-0'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => field.onChange(date)}
                                  disabled={(date) =>
                                    date < new Date('1900-01-01')
                                  }
                                  autoFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className='text-[10px]' />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    <TableCell className='p-2 align-top'>
                      <FormField
                        control={control}
                        name='expedition_id'
                        render={({ field }) => (
                          <FormItem className='mb-0'>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? undefined}
                            >
                              <FormControl>
                                <SelectTrigger className='h-9 w-full text-xs'>
                                  <SelectValue placeholder='Pilih ekspedisi' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {expeditions?.data.length === 0 ? (
                                  <div className='text-muted-foreground p-2 text-center text-sm'>
                                    Tidak ada ekspedisi
                                  </div>
                                ) : (
                                  expeditions?.data.map((exp) => (
                                    <SelectItem key={exp.id} value={exp.id}>
                                      {exp.name}
                                    </SelectItem>
                                  ))
                                )}
                                <SelectSeparator />
                                <FormShortcutButton
                                  title='Tambah Ekspedisi Baru'
                                  onClick={() =>
                                    openDialog('expedition', {
                                      onSuccess: (data: Expedition) => {
                                        if (data?.id) {
                                          field.onChange(data.id)
                                        }
                                      },
                                    })
                                  }
                                />
                              </SelectContent>
                            </Select>
                            <FormMessage className='text-[10px]' />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    <TableCell className='p-2 align-top'>
                      <FormField
                        control={control}
                        name='tracking_number'
                        render={({ field }) => (
                          <FormItem className='mb-0'>
                            <FormControl>
                              <Input
                                placeholder='Contoh: JNE123456789'
                                {...field}
                                value={field.value ?? ''}
                                className='h-9 text-xs'
                              />
                            </FormControl>
                            <FormMessage className='text-[10px]' />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    <TableCell className='p-2 align-top'>
                      <FormField
                        control={control}
                        name='shipping_fee'
                        render={({ field }) => (
                          <FormItem className='mb-0'>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='0'
                                {...field}
                                value={field.value ?? 0}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                startAdornment='Rp'
                                className='h-9 text-xs'
                              />
                            </FormControl>
                            <FormMessage className='text-[10px]' />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
