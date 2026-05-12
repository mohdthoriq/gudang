import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
import type { Product } from '@/types'
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
import { useBulkDeleteProductMutation } from '../hooks/use-product-list-mutation'
import { ProductListFilter } from './product-list-filter'
import { ProductsBulkDeleteDialog } from './products-bulk-delete-dialog'
import { productsColumns } from './products-columns'
import { useProducts } from './products-provider'

type DataTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function ProductsTable({ search, navigate }: DataTableProps) {
  const {
    productsData,
    pagination: serverPagination,
    isLoading,
  } = useProducts()

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  const deleteMutation = useBulkDeleteProductMutation()

  const {
    columnFilters,
    pagination,
    globalFilter,
    onGlobalFilterChange,
    onColumnFiltersChange,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10, pageSizeKey: 'limit' },
    globalFilter: { enabled: true, key: 'search' },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: productsData,
    columns: productsColumns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    manualPagination: true,
    manualFiltering: true,
    pageCount: serverPagination.total_pages,
    enableRowSelection: true,
    onGlobalFilterChange,
    onPaginationChange,
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
    .rows.map((row) => row.original)

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar table={table} searchPlaceholder='Cari...'>
        <ProductListFilter search={search} navigate={navigate} />
      </DataTableToolbar>
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
              <TableEmpty colSpan={table.getVisibleFlatColumns().length} />
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <DataTableBulkActions table={table} entityName='produk'>
        {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-10 rounded-lg'
                  >
                    <ArrowUpCircle className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top' className='bg-slate-800 text-slate-50'>
                  <p>Ekspor</p>
                </TooltipContent>
              </Tooltip>
      
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-10 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-50'
                  >
                    <ArrowUpCircle className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top' className='bg-slate-800 text-slate-50'>
                  <p>Urutkan</p>
                </TooltipContent>
              </Tooltip>
      
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-10 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-50'
                  >
                    <Download className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top' className='bg-slate-800 text-slate-50'>
                  <p>Unduh</p>
                </TooltipContent>
              </Tooltip> */}

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

      <ProductsBulkDeleteDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        selectedRows={selectedRows}
        isLoading={deleteMutation.isPending}
        onConfirm={(ids) => {
          deleteMutation.mutate(
            { ids },
            {
              onSuccess: () => {
                setBulkDeleteDialogOpen(false)
                table.resetRowSelection()
              },
            }
          )
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

function TableRows({ table }: { table: TanstackTable<Product> }) {
  const { setCurrentRow } = useProducts()
  const navigate = useNavigate()
  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          className='group/row hover:bg-muted/50 cursor-pointer'
          onClick={() => {
            setCurrentRow(row.original)
            navigate({
              to: '/products/edit',
              search: {},
              state: { currentRowId: row.original.id } as Record<
                string,
                unknown
              >,
            })
          }}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              onClick={(e) => {
                if (cell.column.id === 'select') {
                  e.stopPropagation()
                }
              }}
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
