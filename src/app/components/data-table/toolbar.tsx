import { type ComponentType, type ReactNode, useEffect, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: ComponentType<{ className?: string }>
    }[]
  }[]
  children?: ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    (table.getState().columnFilters?.length ?? 0) > 0 ||
    table.getState().globalFilter

  // Handle debounced search for column or global filter
  const column = searchKey ? table.getColumn(searchKey) : null
  const initialValue = searchKey
    ? ((column?.getFilterValue() as string) ?? '')
    : ((table.getState().globalFilter as string) ?? '')

  const [searchValue, setSearchValue] = useState(initialValue)
  const debouncedSearchValue = useDebounce(searchValue, 800)

  // Sync internal state with external value (e.g. from reset)
  useEffect(() => {
    setSearchValue(initialValue)
  }, [initialValue])

  // Apply debounced search to the table
  useEffect(() => {
    if (searchKey && column) {
      if (column.getFilterValue() !== debouncedSearchValue) {
        column.setFilterValue(debouncedSearchValue)
      }
    } else {
      if (table.getState().globalFilter !== debouncedSearchValue) {
        table.setGlobalFilter(debouncedSearchValue)
      }
    }
  }, [debouncedSearchValue, column, searchKey, table])

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <DataTableViewOptions table={table} />
        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
              setSearchValue('')
            }}
            className='h-10 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        {children}
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
      </div>
    </div>
  )
}
