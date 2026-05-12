import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { FilterIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FormShortcutButton } from '@/components/forms/form-shortcut-button'
import { MultiSelectDropdown } from '@/components/forms/multi-select-dropdown'
import { useTagsQuery } from '@/features/settings/tags/hooks/use-tags-query'
import { InvoiceFormCombobox } from '../../invoice-form/components/invoice-form-combobox'
import { DatePickerWithRange } from './date-picker-with-range'

interface InvoiceListFilterProps {
  className?: string
  search: Record<string, unknown>
  navigate: (opts: {
    search:
      | true
      | Record<string, unknown>
      | ((
          prev: Record<string, unknown>
        ) => Partial<Record<string, unknown>> | Record<string, unknown>)
    replace?: boolean
  }) => void
}

export function InvoiceListFilter({
  className,
  search,
  navigate,
}: InvoiceListFilterProps) {
  const [open, setOpen] = useState(false)
  const [invoiceDate, setInvoiceDate] = useState<DateRange | undefined>()
  const [dueDate, setDueDate] = useState<DateRange | undefined>()
  const [paymentDate, setPaymentDate] = useState<DateRange | undefined>()
  const { openDialog } = useGlobalDialogStore()

  const [selectedCustomerId, setSelectedCustomerId] = useState<
    string | undefined
  >()
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  const { data: tagsData } = useTagsQuery({ limit: 1000 })
  const tagOptions =
    tagsData?.data.map((tag) => ({
      label: tag.name,
      value: tag.id,
    })) ?? []

  useEffect(() => {
    const syncStateFromUrl = () => {
      const getParam = (key: string) => (search[key] as string) || undefined

      const dateFrom = getParam('date')
      const dateTo = getParam('date_to')
      if (dateFrom && dateTo) {
        setInvoiceDate({ from: new Date(dateFrom), to: new Date(dateTo) })
      } else if (dateFrom) {
        setInvoiceDate({ from: new Date(dateFrom), to: undefined })
      }

      const dueDateFrom = getParam('due_date')
      const dueDateTo = getParam('due_date_to')
      if (dueDateFrom && dueDateTo) {
        setDueDate({ from: new Date(dueDateFrom), to: new Date(dueDateTo) })
      }

      const paymentDateFrom = getParam('payment_date')
      const paymentDateTo = getParam('payment_date_to')
      if (paymentDateFrom && paymentDateTo) {
        setPaymentDate({
          from: new Date(paymentDateFrom),
          to: new Date(paymentDateTo),
        })
      }

      const customerId = getParam('customer_id')
      if (customerId) setSelectedCustomerId(customerId)

      const tags = getParam('tags')
      if (tags) {
        setSelectedTagIds(tags.split(','))
      } else {
        setSelectedTagIds([])
      }
    }

    syncStateFromUrl()
  }, [search])

  const handleApply = () => {
    const newParams: Record<string, unknown> = {}

    const setDateParams = (
      range: DateRange | undefined,
      startKey: string,
      endKey: string
    ) => {
      if (range?.from) {
        newParams[startKey] = format(range.from, 'yyyy-MM-dd')
      } else {
        newParams[startKey] = undefined
      }
      if (range?.to) {
        newParams[endKey] = format(range.to, 'yyyy-MM-dd')
      } else {
        newParams[endKey] = undefined
      }
    }

    setDateParams(invoiceDate, 'date_from', 'date_to')
    setDateParams(dueDate, 'due_date_from', 'due_date_to')
    setDateParams(paymentDate, 'payment_date_from', 'payment_date_to')

    if (selectedCustomerId) {
      newParams['customer_id'] = selectedCustomerId
    } else {
      newParams['customer_id'] = undefined
    }

    if (selectedTagIds.length > 0) {
      newParams['tags'] = selectedTagIds.join(',')
    } else {
      newParams['tags'] = undefined
    }

    newParams['page'] = 1

    navigate({
      search: (prev) => ({
        ...prev,
        ...newParams,
      }),
    })
    setOpen(false)
  }

  const handleReset = () => {
    setInvoiceDate(undefined)
    setDueDate(undefined)
    setPaymentDate(undefined)
    setSelectedCustomerId(undefined)
    setSelectedTagIds([])

    navigate({
      search: (prev) => ({
        ...prev,
        date_from: undefined,
        date_to: undefined,
        due_date_from: undefined,
        due_date_to: undefined,
        payment_date_from: undefined,
        payment_date_to: undefined,
        customer_id: undefined,
        tags: undefined,
        page: 1,
      }),
    })
    setOpen(false)
  }

  const activeFilterCount = [
    invoiceDate,
    dueDate,
    paymentDate,
    selectedCustomerId,
    selectedTagIds.length > 0,
  ].filter(Boolean).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className={cn('gap-2', className)}>
          <FilterIcon className='h-4 w-4' />
          Filter
          {activeFilterCount > 0 && (
            <Badge
              variant='secondary'
              className='ml-1 h-5 rounded-sm px-1 text-[10px] lg:hidden'
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[calc(100vw-2rem)] p-0 md:w-[700px]'
        align='start'
        side='right'
        collisionPadding={16}
      >
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b px-4 py-2'>
            <h4 className='font-medium'>Filter</h4>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleReset}
              className='text-muted-foreground hover:text-foreground'
            >
              Reset
            </Button>
          </div>
          <div className='grid max-h-[40vh] grid-cols-1 divide-y overflow-y-auto md:h-[300px] md:max-h-none md:grid-cols-2 md:divide-x md:divide-y-0'>
            <div className='scrollbar-thin space-y-4 overflow-y-auto p-4'>
              <h5 className='text-muted-foreground mb-4 text-sm font-medium'>
                Tanggal
              </h5>

              <div className='min-w-[200px] space-y-2'>
                <label className='text-xs font-medium'>Tanggal Invoice</label>
                <DatePickerWithRange
                  date={invoiceDate}
                  setDate={setInvoiceDate}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-medium'>Jatuh Tempo</label>
                <DatePickerWithRange date={dueDate} setDate={setDueDate} />
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-medium'>
                  Tanggal Pembayaran
                </label>
                <DatePickerWithRange
                  date={paymentDate}
                  setDate={setPaymentDate}
                />
              </div>
            </div>

            <div className='scrollbar-thin space-y-4 overflow-y-auto p-4'>
              <h5 className='text-muted-foreground mb-4 text-sm font-medium'>
                Detail Vendor
              </h5>
              <div className='space-y-2'>
                <label className='text-xs font-medium'>Vendor</label>
                <InvoiceFormCombobox
                  placeholder='Pilih Vendor'
                  type='contact'
                  onValueChange={setSelectedCustomerId}
                  action={
                    <FormShortcutButton
                      title='Tambah Vendor Baru'
                      onClick={() => openDialog('contact')}
                    />
                  }
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs font-medium'>Tag</label>
                <MultiSelectDropdown
                  options={tagOptions}
                  selected={selectedTagIds}
                  onChange={setSelectedTagIds}
                  placeholder='Pilih tag...'
                  action={
                    <FormShortcutButton
                      title='Tambah Tag Baru'
                      onClick={() => openDialog('tag')}
                    />
                  }
                />
              </div>
            </div>
          </div>
          <div className='bg-muted/10 flex justify-end border-t p-4'>
            <Button onClick={handleApply}>Terapkan Filter</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
