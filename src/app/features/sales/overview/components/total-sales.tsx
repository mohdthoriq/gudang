import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import type { Period } from '../types/sales-overview'
import { CardAction } from './card-action'
import { CardStatistic } from './card-statistic'
import { useTotalSalesQuery } from '../hooks/use-sales-overview-query'

interface TotalSalesProps {
  globalPeriod?: Period
}

export function TotalSales({ globalPeriod }: TotalSalesProps) {
  const [period, setPeriod] = useState<Period>('month')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  useEffect(() => {
    const handleChangePeriod = () => {
      if (globalPeriod && globalPeriod !== 'custom') {
        setPeriod(globalPeriod)
        setDateRange(undefined)
      }
    }
    handleChangePeriod()
  }, [globalPeriod])

  const queryParams =
    period === 'custom' && dateRange?.from && dateRange?.to
      ? {
          date_from: format(dateRange.from, 'yyyy-MM-dd'),
          date_to: format(dateRange.to, 'yyyy-MM-dd'),
          period: 'day' as const,
        }
      : {
          date_from: '',
          date_to: '',
          period: period === 'custom' ? 'month' : period,
        }

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod)
    if (newPeriod !== 'custom') {
      setDateRange(undefined)
    }
  }

  const { data: totalSales } = useTotalSalesQuery(queryParams)
  return (
    <CardStatistic
      title='Penjualan'
      value={totalSales?.value}
      count={totalSales?.count}
      trend={totalSales?.trend}
      cardAction={
        <CardAction
          period={period}
          dateRange={dateRange}
          setPeriod={setPeriod}
          setDateRange={setDateRange}
          onChange={handlePeriodChange}
        />
      }
    />
  )
}
