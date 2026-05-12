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
import { ExpensesFormCombobox } from '../../expenses-form/components/expenses-form-combobox'
import { DatePickerWithRange } from './date-picker-with-range'

interface ExpensesListFilterProps {
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

export function ExpensesListFilter({
  className,
  search,
  navigate,
}: ExpensesListFilterProps) {
  const [open, setOpen] = useState(false)
  const [expenseDate, setExpenseDate] = useState<DateRange | undefined>()

  const [selectedContactId, setSelectedContactId] = useState<
    string | undefined
  >()
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  const { data: tagsData } = useTagsQuery({ limit: 1000 })
  const { openDialog } = useGlobalDialogStore()
  const tagOptions =
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
        setExpenseDate({ from: new Date(dateFrom), to: new Date(dateTo) })
      } else if (dateFrom) {
        setExpenseDate({ from: new Date(dateFrom), to: undefined })
      }

      const contactId = getParam('contact_id')
      if (contactId) setSelectedContactId(contactId)

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

    setDateParams(expenseDate, 'date_from', 'date_to')

    if (selectedContactId) {
      newParams['contact_id'] = selectedContactId
    } else {
      newParams['contact_id'] = undefined
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
    setExpenseDate(undefined)
    setSelectedContactId(undefined)
    setSelectedTagIds([])

    navigate({
      search: (prev) => ({
        ...prev,
        date_from: undefined,
        date_to: undefined,
        contact_id: undefined,
        tags: undefined,
        page: 1,
      }),
    })
    setOpen(false)
  }

  const activeFilterCount = [
    expenseDate,
    selectedContactId,
    selectedTagIds.length > 0,
  ].filter(Boolean).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className={cn('h-9 gap-2', className)}>
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
                <label className='text-xs font-medium'>Tanggal Biaya</label>
                <DatePickerWithRange
                  date={expenseDate}
                  setDate={setExpenseDate}
                />
              </div>
            </div>

            <div className='scrollbar-thin space-y-4 overflow-y-auto p-4'>
              <h5 className='text-muted-foreground mb-4 text-sm font-medium'>
                Detail Kontak
              </h5>
              <div className='space-y-2'>
                <label className='text-xs font-medium'>Pemasok/Kontak</label>
                <ExpensesFormCombobox
                  type='contact'
                  onValueChange={setSelectedContactId}
                  action={
                    <FormShortcutButton
                      title='Tambah Pemasok Baru'
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
