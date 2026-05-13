import { type ReactNode, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  action?: ReactNode
}

export function MultiSelectDropdown({
  options,
  selected = [],
  onChange,
  placeholder = 'Select items...',
  disabled = false,
  className,
  action,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((s) => s !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  //   const handleRemove = (value: string, e: React.MouseEvent) => {
  //     e.stopPropagation()
  //     onChange(selected.filter((s) => s !== value))
  //   }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'hover:bg-background h-auto min-h-10 w-full justify-between px-3 py-2',
            className
          )}
          disabled={disabled}
        >
          <div className='flex flex-wrap gap-1'>
            {selected && selected.length > 0 ? (
              selected.map((val) => {
                const option = options.find((o) => o.value === val)
                return (
                  <Badge
                    key={val}
                    variant='secondary'
                    className='pointer-events-auto flex items-center gap-1 font-normal'
                  >
                    {option?.label || val}
                    {/* <X
                      className='text-muted-foreground hover:text-foreground pointer-events-auto h-3 w-3 cursor-pointer'
                      onClick={(e) => handleRemove(val, e)}
                    /> */}
                  </Badge>
                )
              })
            ) : (
              <span className='text-muted-foreground'>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-0'
        align='start'
      >
        <Command>
          <CommandInput placeholder={`Cari...`} />
          <CommandList>
            <CommandEmpty>Tidak ada data.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {action && <div className='border-t'>{action}</div>}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
