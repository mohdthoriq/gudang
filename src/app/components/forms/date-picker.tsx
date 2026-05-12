import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type DatePickerProps = {
  selected: Date | undefined | null
  onSelect: (date: Date | undefined | null) => void
  placeholder?: string
  className?: string
  startMonth?: Date
  endMonth?: Date
  disabled?: boolean
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = 'Pilih tanggal',
  className,
  startMonth = new Date(new Date().getFullYear() - 10, 0),
  endMonth = new Date(new Date().getFullYear() + 10, 11),
  disabled,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled}
          data-empty={!selected}
          className={cn(
            'data-[empty=true]:text-muted-foreground w-[240px] justify-start text-start font-normal',
            className
          )}
        >
          <CalendarIcon className='me-2 h-4 w-4 opacity-50' />
          {selected ? (
            format(selected, 'dd MMM yyyy', { locale: id })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          captionLayout='dropdown'
          selected={selected ?? undefined}
          onSelect={(date) => onSelect(date)}
          startMonth={startMonth}
          endMonth={endMonth}
        />
        {selected && (
          <div className='border-t p-2'>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-start text-xs font-normal'
              onClick={() => onSelect(null)}
            >
              <X className='me-2 h-3 w-3' />
              Hapus Pilihan
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
