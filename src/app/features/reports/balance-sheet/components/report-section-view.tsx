import { format } from 'date-fns'
import type { BalanceSheetSection } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useBalanceSheetContext } from './balance-sheet-provider'

export function ReportSectionView({
  title,
  date,
  section,
  totalLabel,
}: {
  title: string
  date: Date
  section: BalanceSheetSection
  totalLabel: string
}) {
  const { openDetail } = useBalanceSheetContext()
  const categories = Object.values(section.data)

  if (categories.length === 0) {
    return (
      <div className='space-y-4 p-8'>
        <div className='flex items-center justify-between border-b-2 p-6 font-bold'>
          <span>{title}</span>
          <span>{format(date, 'dd/MM/yyyy')}</span>
        </div>
        <p className='text-muted-foreground py-4 text-sm italic'>
          Tidak ada data
        </p>
      </div>
    )
  }

  return (
    <div className='p-4'>
      {/* Section Header */}
      <div className='bg-secondary/50 flex items-center justify-between rounded-md p-4 text-sm font-bold'>
        <span className='text-2xl font-semibold'>{title}</span>
        <span className='text-lg'>{format(date, 'dd/MM/yyyy')}</span>
      </div>

      <div>
        {categories.map((category) => (
          <div key={category.name}>
            {/* Category Header */}
            <h4 className='border-border hover:bg-secondary/50 border-b p-4 text-base font-semibold'>
              {category.name}
            </h4>

            {/* Account Rows */}
            <div>
              {category.data.map((item) =>
                item.account_id === 5000 || item.account_id === 5001 ? (
                  <div
                    key={item.account_id}
                    className='flex cursor-pointer items-center justify-between border-b border-slate-200 p-4 transition-colors hover:bg-slate-100/50'
                  >
                    <div className='ml-6 flex gap-4'>
                      {item.account.ref_code ? (
                        <span className='w-20 text-sm font-medium'>
                          {item.account.ref_code}
                        </span>
                      ) : (
                        '-'
                      )}
                      <span className='text-sm font-medium'>
                        {item.account.name}
                      </span>
                    </div>
                    <span className='text-primary text-sm font-medium'>
                      {item.net < 0
                        ? `(${formatCurrency(Math.abs(item.net))})`
                        : formatCurrency(item.net)}
                    </span>
                  </div>
                ) : (
                  <div
                    key={item.account_id}
                    className='flex cursor-pointer items-center justify-between border-b border-slate-200 p-4 transition-colors hover:bg-slate-100/50'
                    onClick={() => openDetail(item.account_id.toString())}
                  >
                    <div className='ml-6 flex gap-4'>
                      {item.account.ref_code && (
                        <span className='w-20 text-sm'>
                          {item.account.ref_code}
                        </span>
                      )}
                      <span className='text-sm'>
                        {item.name || item.account.name}
                      </span>
                    </div>
                    <span className='text-primary text-sm'>
                      {item.net < 0
                        ? `(${formatCurrency(Math.abs(item.net))})`
                        : formatCurrency(item.net)}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Category Total */}
            <div className='flex items-center justify-between border-b border-slate-200 p-4 text-base font-semibold hover:bg-slate-100/20'>
              <span>Total {category.name}</span>
              <span>
                {category.total < 0
                  ? `(${formatCurrency(Math.abs(category.total))})`
                  : formatCurrency(category.total)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section Total */}
      <div className='border-b border-slate-200 p-4 hover:bg-slate-100/20'>
        <div className='flex items-center justify-between text-base font-semibold tracking-wide uppercase'>
          <span>{totalLabel}</span>
          <span>
            {section.total < 0
              ? `(${formatCurrency(Math.abs(section.total))})`
              : formatCurrency(section.total)}
          </span>
        </div>
      </div>
    </div>
  )
}
