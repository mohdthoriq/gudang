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
import type { Warehouse } from '@/types'
import { LayoutGrid, List, Trash2 } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
// import { PERMISSION_KEY } from '@/constants/permissions'
// import { useHasPermission } from '@/hooks/use-has-permission'
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
import { FeatureLockDialog } from '@/components/dialog/feature-lock.dialog'
import { WarehousesBulkDeleteDialog } from './warehouses-bulk-delete-dialog'
import { warehousesColumns } from './warehouses-columns'
import { useWarehouses } from './warehouses-provider'
import { useNavigate } from '@tanstack/react-router'
import { useDeleteWarehouseMutation } from '../hooks/use-warehouses-list-mutation'

type DataTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function WarehousesTable({ search, navigate }: DataTableProps) {
  const navigateTo = useNavigate()

  const {
    warehousesData,
    pagination: serverPagination,
    isLoading,
    // setOpen,
    // setCurrentRow,
  } = useWarehouses()

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [lockFeatureDialog, setLockFeatureDialog] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const deleteMutation = useDeleteWarehouseMutation()

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
    columnFilters: [],
  })

  const table = useReactTable({
    data: warehousesData,
    columns: warehousesColumns,
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
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>
      <div className='flex items-center justify-between gap-2 flex-wrap'>
        <DataTableToolbar table={table} searchPlaceholder='Cari gudang...' />
        <div className='flex items-center gap-4'>
          <div className='flex items-center border rounded-md p-1 bg-muted/20'>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size='sm'
              className='h-8 w-8 p-0'
              onClick={() => setViewMode('list')}
            >
              <List className='h-4 w-4' />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size='sm'
              className='h-8 w-8 p-0'
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className='overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='group/row'>
                  {headerGroup.headers.map((header) => (
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
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoading columnCount={table.getVisibleFlatColumns().length} />
              ) : table.getRowModel().rows?.length ? (
                <TableRows table={table} onRowClick={(row) => {
                  navigateTo({ to: '/warehouses/detail', search: { id: row.id } })
                }} />
              ) : (
                <TableEmpty colSpan={warehousesColumns.length} />
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-[120px] w-full rounded-xl' />
            ))
          ) : warehousesData.length ? (
            warehousesData.map((warehouse) => (
              <div
                key={warehouse.id}
                className='group flex flex-col p-4 border rounded-xl hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-card'
                onClick={() => navigateTo({ to: '/warehouses/detail', search: { id: warehouse.id } })}
              >
                <div className='flex justify-between items-start mb-6'>
                  <div>
                    <h4 className='font-bold text-lg'>{warehouse.name}</h4>
                    <p className='text-sm text-muted-foreground'>Kode: {warehouse.code}</p>
                  </div>
                </div>
                <div className='mt-auto flex justify-between items-end border-t pt-6'>
                  <div className='text-xs text-muted-foreground'>
                    Total Kuantitas
                    <p className='text-sm font-bold text-foreground'>{warehouse.total_quantity || 0}</p>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Total Nilai
                    <p className='text-sm font-bold text-foreground'>{formatCurrency(warehouse.total_value || 0)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full h-40 flex items-center justify-center border border-dashed rounded-xl'>
              No results found.
            </div>
          )}
        </div>
      )}

      <DataTablePagination table={table} className='mt-auto' />

      <DataTableBulkActions table={table} entityName='gudang'>
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

      <WarehousesBulkDeleteDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        selectedRows={selectedRows}
        isLoading={deleteMutation.isPending}
        onConfirm={(ids) => {
          deleteMutation.mutate(
            { id:ids[0] },
            {
              onSuccess: () => {
                setBulkDeleteDialogOpen(false)
                table.resetRowSelection()
              },
            }
          )
        }}
      />
      <FeatureLockDialog
        open={lockFeatureDialog}
        onOpenChange={setLockFeatureDialog}
        feature='Hapus Gudang'
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

function TableRows({ table, onRowClick }: { table: TanstackTable<Warehouse>, onRowClick: (row: Warehouse) => void }) {
  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          className='group/row hover:bg-muted/50 cursor-pointer'
          onClick={() => onRowClick(row.original)}
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
