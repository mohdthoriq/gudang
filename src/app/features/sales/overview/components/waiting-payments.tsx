import { useState, useEffect } from 'react'
import { format } from '@/lib/date'
import type { DateRange } from 'react-day-picker'
import { useWaitingPaymentsQuery } from '../hooks/use-sales-overview-query'
import type { Period } from '../types/sales-overview'
import { CardAction } from './card-action'
import { CardStatistic } from './card-statistic'

interface WaitingPaymentsProps {
  globalPeriod?: Period
}

export function WaitingPayments({ globalPeriod }: WaitingPaymentsProps) {
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

  const { data: waitingPayments } = useWaitingPaymentsQuery(queryParams)
  return (
    <CardStatistic
      title='Menunggu Pembayaran'
      value={waitingPayments?.value}
      count={waitingPayments?.count}
      trend={waitingPayments?.trend}
      cardAction={
        <CardAction
          period={period}
          dateRange={dateRange}
          onChange={handlePeriodChange}
          setDateRange={setDateRange}
          setPeriod={setPeriod}
        />
      }
    />
  )
}
