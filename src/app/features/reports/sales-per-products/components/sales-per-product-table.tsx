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
  getExpandedRowModel,
  type ExpandedState,
} from '@tanstack/react-table'
import type { ProductSalesReportItem } from '@/types/domain/sales-per-products'
import { cn, formatCurrency } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { FeatureLockDialog } from '@/components/dialog/feature-lock.dialog'
import { useProductCategoryQuery } from '@/features/product-categories/hooks/use-product-category-query'
import { salesPerProductColumns } from './sales-per-product-columns'
import { useSalesPerProduct } from './sales-per-product-provider'

type DataTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function SalesPerProductTable({ search, navigate }: DataTableProps) {
  const {
    salesPerProductData,
    pagination: serverPagination,
    isLoading,
  } = useSalesPerProduct()

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [lockFeatureDialog, setLockFeatureDialog] = useState(false)

  const { data: productCategories } = useProductCategoryQuery()

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
    columnFilters: [
    ],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: (salesPerProductData?.items ?? []) as ProductSalesReportItem[],
    columns: salesPerProductColumns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
      expanded,
      globalFilter,
    },
    manualPagination: true,
    manualFiltering: true,
    pageCount: serverPagination.total_pages,
    enableRowSelection: true,
    onGlobalFilterChange,
    onPaginationChange,
    onColumnFiltersChange,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
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
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder='Cari...'
        filters={[
          {
            columnId: 'Kategori',
            title: 'Filter Kategori',
            options:
              productCategories?.data?.map((category) => ({
                label: category.name,
                value: category.id,
              })) ?? [],
          },
        ]}
      />
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
              <TableEmpty colSpan={salesPerProductColumns.length} />
            )}
          </TableBody>
          {table.getRowModel().rows?.length > 0 &&
            salesPerProductData?.summary && (
              <TableFooter className='bg-secondary hover:bg-secondary font-bold'>
                <TableRow className='hover:bg-transparent border-none'>
                  <TableCell />
                  <TableCell>Total</TableCell>
                  <TableCell />
                  <TableCell>
                    {salesPerProductData.summary.total_quantity}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(salesPerProductData.summary.total_sales)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(salesPerProductData.summary.total_cost)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(salesPerProductData.summary.total_profit)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <FeatureLockDialog
        open={lockFeatureDialog}
        onOpenChange={setLockFeatureDialog}
        feature='Hapus Akun'
      />
    </div>
  )
}

function TableLoading({ columnCount }: { columnCount: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className='hover:bg-transparent'>
          {Array.from({ length: columnCount ?? 0 }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className='h-6 w-full' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

function TableRows({
  table,
}: {
  table: TanstackTable<ProductSalesReportItem>
}) {
  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          className='group/row'
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
