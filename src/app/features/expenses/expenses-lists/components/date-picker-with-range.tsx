import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function DatePickerWithRange({
  date,
  setDate,
}: {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id='date'
          variant={'outline'}
          className={cn(
            'h-9 w-full justify-start px-3 text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='h-4 w-4 shrink-0' />
          <span className='ml-2 truncate'>
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yyyy')} -{' '}
                  {format(date.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(date.from, 'dd/MM/yyyy')
              )
            ) : (
              <span>Pilih tanggal</span>
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='range'
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
