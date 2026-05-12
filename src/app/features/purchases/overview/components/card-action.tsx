import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { MoreVertical } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Period } from '../types/purchases-overview'

interface CardActionProps {
  period: Period
  dateRange: DateRange | undefined
  setPeriod: (period: Period) => void
  setDateRange: (dateRange: DateRange | undefined) => void
  onChange: (period: Period) => void
}
export function CardAction({
  period,
  dateRange,
  setPeriod,
  setDateRange,
  // onChange,
}: CardActionProps) {
  return (
    <>
      {/* <Button
                variant='ghost'
                size='icon'
                className='text-muted-foreground hover:text-foreground h-8 w-8'
            >
                <Filter className='h-4 w-4' />
            </Button> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-foreground h-8 w-8'
          >
            <MoreVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          {/* <DropdownMenuItem
            onClick={() => onChange('day')}
            className={cn(period === 'day' && 'bg-accent')}
          >
            Harian
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onChange('month')}
            className={cn(period === 'month' && 'bg-accent')}
          >
            Bulanan
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onChange('year')}
            className={cn(period === 'year' && 'bg-accent')}
          >
            Tahunan
          </DropdownMenuItem>
          <DropdownMenuSeparator /> */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className={cn(period === 'custom' && 'bg-accent')}
            >
              Custom
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className='p-0' sideOffset={8}>
              <div className='border-b p-3'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='border-input rounded-md border px-3 py-1 text-xs'>
                    {dateRange?.from
                      ? format(dateRange.from, 'dd/MM/yyyy')
                      : 'Pilih tanggal'}
                  </div>
                  <span className='text-muted-foreground text-xs'>s/d</span>
                  <div className='border-input rounded-md border px-3 py-1 text-xs'>
                    {dateRange?.to
                      ? format(dateRange.to, 'dd/MM/yyyy')
                      : 'Pilih tanggal'}
                  </div>
                </div>
              </div>
              <Calendar
                mode='range'
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range)
                  if (range?.from && range?.to) {
                    setPeriod('custom')
                  }
                }}
                locale={id}
                autoFocus
              />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
