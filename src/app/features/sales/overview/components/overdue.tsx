import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { useOverdueQuery } from '../hooks/use-sales-overview-query'
import type { Period } from '../types/sales-overview'
import { CardAction } from './card-action'
import { CardStatistic } from './card-statistic'

interface OverdueProps {
  globalPeriod?: Period
}

export function Overdue({ globalPeriod }: OverdueProps) {
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

  const { data: overdue } = useOverdueQuery(queryParams)
  return (
    <CardStatistic
      title='Jatuh Tempo'
      value={overdue?.value}
      count={overdue?.count}
      trend={overdue?.trend}
      variant='graph'
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
