import { format } from 'date-fns'
import type {
  COGSItem,
  GrossProfitItem,
  NetIncomeItem,
  OperatingExpensesItem,
  RevenueItem,
  ProfitLossCategoryDetail,
} from '@/types'
import { cn, formatCurrency } from '@/lib/utils'
import { useProfitLossContext } from './profit-loss-provider'

type ReportSection =
  | RevenueItem
  | COGSItem
  | GrossProfitItem
  | OperatingExpensesItem
  | NetIncomeItem

interface ReportSectionWithData {
  data?: Record<string, ProfitLossCategoryDetail>
}

export function ReportSectionView({
  title,
  date,
  section,
  // totalLabel,
}: {
  title: string
  date?: Date
  section: ReportSection
  totalLabel: string
}) {
  const { openDetail } = useProfitLossContext()
  const sectionWithData = section as ReportSectionWithData
  const categories: ProfitLossCategoryDetail[] = sectionWithData.data
    ? Object.values(sectionWithData.data)
    : []

  if (categories.length === 0) {
    return (
      <div className='space-y-4 p-8'>
        <div className='flex items-center justify-between border-b-2 p-6 font-bold'>
          <span>{title}</span>
          {date && <span>{format(date, 'dd/MM/yyyy')}</span>}
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
        {date && <span className='text-lg'>{format(date, 'dd/MM/yyyy')}</span>}
      </div>

      <div>
        {categories.map((category) => (
          <div key={category.name}>
            {/* Category Header */}
            <h4 className='border-border hover:bg-secondary/20 border-b p-4 text-base font-semibold'>
              {category.name}
            </h4>

            {/* Account Rows */}
            <div>
              {category.data.map((item) => {
                const accountId = item.account_id.toString()
                const isExcluded = accountId === '5000' || accountId === '5001'

                return (
                  <div
                    key={item.account_id}
                    className='hover:bg-secondary/20 flex cursor-pointer items-center justify-between border-b border-slate-200 p-4 transition-colors'
                    onClick={() => !isExcluded && openDetail(accountId)}
                  >
                    <div className='ml-6 flex gap-4'>
                      {item.account.ref_code ? (
                        <span
                          className={cn('w-20 text-sm', {
                            'font-medium': isExcluded,
                          })}
                        >
                          {item.account.ref_code}
                        </span>
                      ) : (
                        <span className='w-20 text-sm'>-</span>
                      )}
                      <span
                        className={cn('text-sm', {
                          'font-medium': isExcluded,
                        })}
                      >
                        {item.account.name}
                      </span>
                    </div>
                    <span
                      className={cn('text-primary text-sm', {
                        'font-medium': isExcluded,
                      })}
                    >
                      {item.net < 0
                        ? `(${formatCurrency(Math.abs(item.net))})`
                        : formatCurrency(item.net)}
                    </span>
                  </div>
                )
              })}
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
      {/* <div className='border-b border-slate-200 p-4 hover:bg-slate-100/20'>
        <div className='flex items-center justify-between text-base font-semibold tracking-wide uppercase'>
          <span>{totalLabel}</span>
          <span>
            {section.total < 0
              ? `(${formatCurrency(Math.abs(section.total))})`
              : formatCurrency(section.total)}
          </span>
        </div>
      </div> */}
    </div>
  )
}
