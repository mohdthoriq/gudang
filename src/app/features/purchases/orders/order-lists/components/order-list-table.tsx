import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  type SortingState,
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
import type { PurchasesOrder } from '@/types'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { FeatureLockDialog } from '@/components/dialog/feature-lock.dialog'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { usePurchasesOrderMutation } from '../../order-detail/hooks/use-order-payments.mutation'
import { OrderBulkDeleteDialog } from './order-bulk-delete-dialog'
import { orderListsColumns } from './order-list-columns'
import { OrderListFilter } from './order-list-filter'
import { useOrderLists } from './order-list-provider'

type DataTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function OrderListsTable({ search, navigate }: DataTableProps) {
  const {
    orderListsData,
    pagination: serverPagination,
    isLoading,
    columnVisibility,
    setColumnVisibility,
  } = useOrderLists()

  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [lockDialogOpen, setLockDialogOpen] = useState(false)

  const hasPermission = useHasPermission(PERMISSION_KEY.PURCHASE_ORDER_DELETE)
  const { bulkDeleteMutation } = usePurchasesOrderMutation()

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
    data: orderListsData,
    columns: orderListsColumns,
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
    .getSelectedRowModel()
    .rows.map((row) => row.original)

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Cari...'
      >
        <div className='flex gap-2'>
          <OrderListFilter search={search} navigate={navigate} />
        </div>
      </DataTableToolbar>
      <Tabs
        defaultValue=''
        value={(search.document_status as string) || ''}
        onValueChange={(value) =>
          navigate({ search: { ...search, document_status: value } })
        }
      >
        <TabsList className='h-10'>
          <TabsTrigger value=''>Semua</TabsTrigger>
          <TabsTrigger value='posted'>Posted</TabsTrigger>
          <TabsTrigger value='draft'>Draft</TabsTrigger>
          <TabsTrigger value='void'>Dibatalkan</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className='overflow-hidden rounded-lg border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row border-none'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-secondary group-hover/row:bg-secondary group-data-[state=selected]/row:bg-secondary border-none',
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
              <TableRows table={table} />
            ) : (
              <TableEmpty colSpan={orderListsColumns.length} />
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />

      <DataTableBulkActions table={table} entityName='purchase order'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => {
                if (!hasPermission) {
                  setLockDialogOpen(true)
                } else {
                  setBulkDeleteDialogOpen(true)
                }
              }}
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

      <OrderBulkDeleteDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        selectedRows={selectedRows}
        isLoading={bulkDeleteMutation.isPending}
        onConfirm={(ids) => {
          bulkDeleteMutation.mutate(ids, {
            onSuccess: () => {
              setBulkDeleteDialogOpen(false)
              table.resetRowSelection()
            },
          })
        }}
      />
      <FeatureLockDialog
        open={lockDialogOpen}
        onOpenChange={setLockDialogOpen}
        feature='Hapus Pesanan Pembelian'
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

function TableRows({ table }: { table: TanstackTable<PurchasesOrder> }) {
  const navigate = useNavigate()
  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          className='group/row cursor-pointer'
          onClick={() =>
            navigate({
              to: '/purchases/orders/detail',
              state: {
                currentRowId: row.original.id,
              } as Record<string, unknown>,
            })
          }
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className={cn(
                'bg-background group-hover/row:bg-secondary/50 group-data-[state=selected]/row:bg-muted',
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
