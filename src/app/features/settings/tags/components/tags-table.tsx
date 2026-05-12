import { useEffect, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as TanstackTable,
} from '@tanstack/react-table'
import type { Tag } from '@/types'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DataTableBulkActions,
  DataTablePagination,
  DataTableToolbar,
} from '@/components/data-table'
import { TagsBulkDeleteDialog } from './tags-bulk-delete-dialog'
import { tagsColumns } from './tags-columns'
import { useTags } from './tags-provider'

type DataTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function TagsTable({ search, navigate }: DataTableProps) {
  const { tagsData, pagination: serverPagination, isLoading } = useTags()

  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Synced with URL states (keys/defaults mirror roles route search schema)
  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    globalFilter,
    onGlobalFilterChange,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10, pageSizeKey: 'limit' },
    globalFilter: { enabled: true, key: 'search' },
    columnFilters: [],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tagsData,
    columns: tagsColumns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    manualPagination: true,
    manualFiltering: true,
    pageCount: serverPagination.total_pages,
    enableRowSelection: true,
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    if (serverPagination.total_pages !== 1) {
      ensurePageInRange(serverPagination.total_pages)
    }
  }, [serverPagination.total_pages, ensurePageInRange])

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .flatRows.map((row) => row.original)

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar table={table} searchPlaceholder='Cari...' />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-secondary group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading
                columnCount={table.getVisibleFlatColumns().length}
              />
            ) : table.getRowModel().rows?.length ? (
              <TableRows table={table} />
            ) : (
              <TableEmpty colSpan={tagsColumns.length} />
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <DataTableBulkActions table={table} entityName='tag'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setBulkDeleteDialogOpen(true)}
              className='size-8 rounded-lg bg-red-500/80 hover:bg-red-500'
            >
              <Trash2 className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top' className='bg-slate-800 text-slate-50'>
            <p>Hapus</p>
          </TooltipContent>
        </Tooltip>
      </DataTableBulkActions>

      <TagsBulkDeleteDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        selectedRows={selectedRows}
        onSuccess={() => {
          table.resetRowSelection()
        }}
      />
    </div>
  )
}

function TableLoading({ columnCount }: { columnCount: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className='hover:bg-transparent'>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className='h-6 w-full' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

function TableRows({ table }: { table: TanstackTable<Tag> }) {
  const { setOpen, setCurrentRow } = useTags()
  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          className='group/row hover:cursor-pointer'
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              onClick={() => {
                if (cell.column.id === 'select') return
                setOpen('edit')
                setCurrentRow(row.original)
              }}
              key={cell.id}
              className={cn(
                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                cell.column.columnDef.meta?.className,
                cell.column.columnDef.meta?.tdClassName
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

function TableEmpty({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className='h-24 text-center'>
        No results.
      </TableCell>
    </TableRow>
  )
}
