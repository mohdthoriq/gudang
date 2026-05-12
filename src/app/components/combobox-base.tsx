'use client'

import { type ReactNode, useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
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

interface ComboboxBaseProps<T extends { id: string }> {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  items: T[]
  selectedItem: T | null
  isLoading: boolean
  isError: boolean
  hasMore: boolean
  onSearch: (value: string) => void
  onLoadMore: () => void
  onRetry: () => void
  onOpenChange?: (open: boolean) => void
  renderItem: (item: T) => React.ReactNode
  getLabel: (item: T) => string
  noItemsMessage?: string
  disabled?: boolean
  action?: ReactNode
  initialLabel?: string
  className?: string
}

export function ComboboxBase<T extends { id: string }>({
  value = '',
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  items,
  selectedItem,
  isLoading,
  isError,
  hasMore,
  onSearch,
  onLoadMore,
  onRetry,
  onOpenChange,
  renderItem,
  getLabel,
  noItemsMessage = 'No items found.',
  disabled,
  action,
  initialLabel,
  className,
}: ComboboxBaseProps<T>) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleSelect = (itemId: string) => {
    onValueChange?.(itemId)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <span className='truncate'>
            {selectedItem
              ? getLabel(selectedItem)
              : value && initialLabel
                ? initialLabel
                : placeholder}
          </span>
          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-0'
        align='start'
        onWheel={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={onSearch}
          />
          <CommandList>
            {isLoading && items.length === 0 ? (
              <div className='flex items-center justify-center py-6'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span className='text-muted-foreground ml-2 text-sm'>
                  Loading...
                </span>
              </div>
            ) : isError ? (
              <CommandEmpty>
                <div className='flex flex-col items-center py-4'>
                  <span className='text-muted-foreground mb-2 text-sm'>
                    Failed to load data
                  </span>
                  <Button variant='outline' size='sm' onClick={onRetry}>
                    Retry
                  </Button>
                </div>
              </CommandEmpty>
            ) : items.length === 0 ? (
              <CommandEmpty>{noItemsMessage}</CommandEmpty>
            ) : (
              <>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => handleSelect(item.id)}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === item.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {renderItem(item)}
                    </CommandItem>
                  ))}
                </CommandGroup>

                {hasMore && (
                  <div className='border-t'>
                    <Button
                      variant='ghost'
                      className='w-full justify-center py-2'
                      onClick={onLoadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Loading...
                        </>
                      ) : (
                        'Load more'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </CommandList>
          {action && <div className='border-t'>{action}</div>}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
