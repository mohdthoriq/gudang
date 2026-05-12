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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormShortcutButton } from '@/components/forms/form-shortcut-button'
import { InputFieldNumberFormat } from '@/components/forms/input-field-number-format'
import { MultiSelectDropdown } from '@/components/forms/multi-select-dropdown'
import { DatePickerWithRange } from '@/features/sales/invoices/invoice-lists/components/date-picker-with-range'
import { useTagsQuery } from '@/features/settings/tags/hooks/use-tags-query'

interface CashBankListFilterProps {
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

export function CashBankListFilter({
  className,
  search,
  navigate,
}: CashBankListFilterProps) {
  const [open, setOpen] = useState(false)
  const [transactionDate, setTransactionDate] = useState<
    DateRange | undefined
  >()

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [referenceType, setReferenceType] = useState<string | undefined>()

  const [amountFrom, setAmountFrom] = useState<number | undefined>(undefined)
  const [amountTo, setAmountTo] = useState<number | undefined>(undefined)

  const { openDialog } = useGlobalDialogStore()

  const { data: tagsData } = useTagsQuery({ limit: 1000 })

  const tagOptionsByName =
    tagsData?.data.map((tag) => ({
      label: tag.name,
      value: tag.id,
    })) ?? []

  useEffect(() => {
    const syncStateFromUrl = () => {
      const getParam = (key: string) => (search[key] as string) || undefined

      const dateFrom = getParam('date_from')
      const dateTo = getParam('date_to')
      if (dateFrom && dateTo) {
        setTransactionDate({ from: new Date(dateFrom), to: new Date(dateTo) })
      } else if (dateFrom) {
        setTransactionDate({ from: new Date(dateFrom), to: undefined })
      }

      const tags = getParam('tag')
      if (tags) {
        setSelectedTagIds(tags.split(','))
      } else {
        setSelectedTagIds([])
      }

      setReferenceType(getParam('reference_type'))

      const amountFromParam = getParam('total_from')
      setAmountFrom(amountFromParam ? Number(amountFromParam) : undefined)

      const amountToParam = getParam('total_to')
      setAmountTo(amountToParam ? Number(amountToParam) : undefined)
    }

    syncStateFromUrl()
  }, [search])

  const handleApply = () => {
    const newParams: Record<string, unknown> = {}

    if (transactionDate?.from) {
      newParams['date_from'] = format(transactionDate.from, 'yyyy-MM-dd')
    } else {
      newParams['date_from'] = undefined
    }

    if (transactionDate?.to) {
      newParams['date_to'] = format(transactionDate.to, 'yyyy-MM-dd')
    } else {
      newParams['date_to'] = undefined
    }

    if (selectedTagIds.length > 0) {
      newParams['tag'] = selectedTagIds.join(',')
    } else {
      newParams['tag'] = undefined
    }

    newParams['reference_type'] = referenceType || undefined
    newParams['total_from'] = amountFrom || undefined
    newParams['total_to'] = amountTo || undefined

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
    setTransactionDate(undefined)
    setSelectedTagIds([])
    setReferenceType(undefined)
    setAmountFrom(undefined)
    setAmountTo(undefined)

    navigate({
      search: (prev) => ({
        ...prev,
        date_from: undefined,
        date_to: undefined,
        tag: undefined,
        reference_type: undefined,
        total_from: undefined,
        total_to: undefined,
        page: 1,
      }),
    })
    setOpen(false)
  }

  const activeFilterCount = [
    transactionDate,
    selectedTagIds.length > 0,
    referenceType,
    amountFrom,
    amountTo,
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
        collisionPadding={16}
      >
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b px-4 py-2'>
            <h4 className='font-medium'>Filter Transaksi</h4>
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
            {/* Left Column */}
            <div className='scrollbar-thin space-y-4 overflow-y-auto p-4'>
              <h5 className='text-muted-foreground mb-4 text-sm font-medium'>
                Umum
              </h5>

              <div className='min-w-[200px] space-y-2'>
                <label className='text-xs font-medium'>Tanggal Transaksi</label>
                <DatePickerWithRange
                  date={transactionDate}
                  setDate={setTransactionDate}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-medium'>Tipe Referensi</label>
                <Select value={referenceType} onValueChange={setReferenceType}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Pilih tipe' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='spend_money'>Kirim Uang</SelectItem>
                    <SelectItem value='receive_money'>Terima Uang</SelectItem>
                    <SelectItem value='bank_transfer'>Transfer Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-medium'>Tag</label>
                <MultiSelectDropdown
                  options={tagOptionsByName}
                  selected={selectedTagIds}
                  onChange={setSelectedTagIds}
                  placeholder='Pilih tag...'
                  action={
                    <FormShortcutButton
                      title='Kelola Tag'
                      onClick={() => openDialog('tag')}
                    />
                  }
                />
              </div>
            </div>

            {/* Right Column */}
            <div className='scrollbar-thin space-y-4 overflow-y-auto p-4'>
              <h5 className='text-muted-foreground mb-4 text-sm font-medium'>
                Nominal
              </h5>

              <div className='grid grid-cols-1 gap-4'>
                <div className='space-y-2'>
                  <label className='text-xs font-medium'>Minimal</label>
                  <InputFieldNumberFormat
                    prefix='Rp'
                    placeholder='0'
                    value={amountFrom}
                    onValueChange={(value) => setAmountFrom(value)}
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-xs font-medium'>Maksimal</label>
                  <InputFieldNumberFormat
                    prefix='Rp'
                    placeholder='0'
                    value={amountTo}
                    onValueChange={(value) => setAmountTo(value)}
                  />
                </div>
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
