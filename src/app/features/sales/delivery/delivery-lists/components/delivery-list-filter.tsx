import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { FilterIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DatePickerWithRange } from './date-picker-with-range'

interface DeliveryListFilterProps {
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

export function DeliveryListFilter({
  className,
  search,
  navigate,
}: DeliveryListFilterProps) {
  const [open, setOpen] = useState(false)
  const [shippingDate, setShippingDate] = useState<DateRange | undefined>()

  useEffect(() => {
    const syncStateFromUrl = () => {
      const getParam = (key: string) => (search[key] as string) || undefined

      const dateFrom = getParam('date_from')
      const dateTo = getParam('date_to')
      if (dateFrom && dateTo) {
        setShippingDate({
          from: new Date(dateFrom),
          to: new Date(dateTo),
        })
      } else if (dateFrom) {
        setShippingDate({ from: new Date(dateFrom), to: undefined })
      }
    }

    syncStateFromUrl()
  }, [search])

  const handleApply = () => {
    const newParams: Record<string, unknown> = {}

    if (shippingDate?.from) {
      newParams['date_from'] = format(shippingDate.from, 'yyyy-MM-dd')
    } else {
      newParams['date_from'] = undefined
    }
    if (shippingDate?.to) {
      newParams['date_to'] = format(shippingDate.to, 'yyyy-MM-dd')
    } else {
      newParams['date_to'] = undefined
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
    setShippingDate(undefined)

    navigate({
      search: (prev) => ({
        ...prev,
        date_from: undefined,
        date_to: undefined,
        page: 1,
      }),
    })
    setOpen(false)
  }


  const activeFilterCount = [shippingDate].filter(Boolean).length

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
        className='w-[calc(100vw-2rem)] p-0 md:w-[400px]'
        align='start'
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
          <div className='scrollbar-thin space-y-4 overflow-y-auto p-4'>
            <div className='min-w-[200px] space-y-2'>
              <label className='text-xs font-medium'>Tanggal Pengiriman</label>
              <DatePickerWithRange
                date={shippingDate}
                setDate={setShippingDate}
              />
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
