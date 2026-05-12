/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from 'react'
import { flexRender } from '@tanstack/react-table'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { invoiceListsColumns } from '../invoice-list-columns'
import { useInvoiceLists } from '../invoice-list-provider'

interface SalesInvoicesTablePrintProps {
  className?: string
}

export const SalesInvoicesTablePrint = forwardRef<
  HTMLDivElement,
  SalesInvoicesTablePrintProps
>(({ className }, ref) => {
  const company = useAuthStore((state) => state.auth.user?.company)
  const { invoiceListsData, columnVisibility } = useInvoiceLists()

  // Filter out 'actions' and hidden columns
  const visibleColumns = invoiceListsColumns.filter((col) => {
    if (col.id === 'actions' || col.id === 'select') return false
    const id = col.id || (col as any).accessorKey
    return columnVisibility[id] !== false
  })

  return (
    <div
      ref={ref}
      className={cn('flex flex-col bg-white p-4 font-sans', className)}
    >
      <style type='text/css' media='print'>
        {`
            @page {
              size: portrait;
              margin: 10mm;
            }
          `}
      </style>

      <div className='mb-6 flex flex-col items-center justify-center space-y-3 border-b-2 border-slate-900 pb-10 text-center'>
        {company?.logo_url && (
          <img
            src={company.logo_url}
            alt={company.name}
            className='mb-2 h-20 w-auto object-contain'
          />
        )}
        <div className='flex flex-col items-center space-y-1'>
          <h2 className='text-3xl font-black tracking-widest text-slate-900 uppercase'>
            {company?.name || 'MANAJERKU'}
          </h2>
          <div className='h-1 w-24 bg-slate-900' />
          <h1 className='mt-4 text-4xl font-bold tracking-tight text-slate-800'>
            Tagihan Penjualan
          </h1>
        </div>
      </div>

      {/* Simplified Table using standard HTML tags */}
      <div className='w-full overflow-hidden rounded-md border border-slate-300'>
        <table className='w-full border-collapse text-left text-[10px]'>
          <thead>
            <tr className='border-b border-slate-300 bg-slate-100'>
              {visibleColumns.map((col, index) => (
                <th
                  key={index}
                  className={cn(
                    'border-r border-slate-300 px-3 py-2 font-semibold text-slate-700 last:border-r-0'
                  )}
                >
                  {typeof col.header === 'function'
                    ? col.header({
                        column: {
                          id: col.id || (col as any).accessorKey,
                          getCanSort: () => false,
                          getIsSorted: () => false,
                          getCanHide: () => false,
                          getIsVisible: () => true,
                          toggleSorting: () => {},
                          toggleVisibility: () => {},
                        } as any,
                        header: {
                          id: col.id || (col as any).accessorKey,
                          column: {} as any,
                          getContext: () => ({}) as any,
                        } as any,
                        table: {
                          options: {
                            meta: {},
                          },
                          getState: () => ({}) as any,
                        } as any,
                      } as any)
                    : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoiceListsData.length > 0 ? (
              invoiceListsData.map((invoice) => (
                <tr
                  key={invoice.id}
                  className='border-b border-slate-200 last:border-b-0'
                >
                  {visibleColumns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        'border-r border-slate-200 px-3 py-2 text-slate-600 last:border-r-0'
                      )}
                    >
                      {flexRender(col.cell, {
                        row: { original: invoice } as any,
                        column: col as any,
                        table: {} as any,
                        cell: {} as any,
                        getValue: () =>
                          (invoice as any)[(col as any).accessorKey],
                        renderValue: () =>
                          (invoice as any)[(col as any).accessorKey],
                      } as any)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className='h-24 text-center text-slate-500'
                >
                  Tidak ada data tagihan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className='mt-auto pt-4 text-right text-[10px] text-slate-400'>
        Dicetak pada {new Date().toLocaleString('id-ID')}
      </div>
    </div>
  )
})

SalesInvoicesTablePrint.displayName = 'SalesInvoicesTablePrint'
