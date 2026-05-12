import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
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
import type { TransactionData } from '@/types'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { cashBankListsColumns } from './cash-bank-list-columns'
import { CashBankListFilter } from './cash-bank-list-filter'
import { useCashBankLists } from './cash-bank-list-provider'

type DataTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function CashBankListsTable({ search, navigate }: DataTableProps) {
  const {
    cashBankTransactionListsData,
    pagination: serverPagination,
    isLoading,
  } = useCashBankLists()

  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  // Synced with URL states (keys/defaults mirror roles route search schema)
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: cashBankTransactionListsData,
    columns: cashBankListsColumns,
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

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar table={table} searchPlaceholder='Cari...'>
        <CashBankListFilter search={search} navigate={navigate} />
      </DataTableToolbar>
      {/* <div className='flex flex-col gap-2 md:flex-row md:items-center'>
        <Tabs
          defaultValue=''
          value={search.payment_status as string}
          onValueChange={(value) =>
            navigate({ search: { ...search, payment_status: value } })
          }
        >
          <TabsList className='h-10'>
            <TabsTrigger value=''>Semua</TabsTrigger>
            <TabsTrigger value='paid'>Lunas</TabsTrigger>
            <TabsTrigger value='unpaid'>Belum Dibayar</TabsTrigger>
            <TabsTrigger value='partially_paid'>Sebagian Dibayar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div> */}
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
              <TableEmpty colSpan={cashBankListsColumns.length} />
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
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

function TableRows({ table }: { table: TanstackTable<TransactionData> }) {
  const navigate = useNavigate()
  const { paginationParams } = useCashBankLists()
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const accountId = (paginationParams?.id || search?.id) as string

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          className='group/row'
          onClick={() =>
            navigate({
              to: '/cash-bank/detail',
              search: {
                accountId,
                transactionId: row.original.id,
              },
            })
          }
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
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
