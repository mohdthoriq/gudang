import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { useTotalPaymentsQuery } from '../hooks/use-purchases-overview-query'
import type { Period } from '../types/purchases-overview'
import { CardAction } from './card-action'
import { CardStatistic } from './card-statistic'

interface PaymentsReceivedProps {
  globalPeriod?: Period
}

export function PaymentsReceived({ globalPeriod }: PaymentsReceivedProps) {
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

  const { data: paymentsReceived } = useTotalPaymentsQuery(queryParams)
  return (
    <CardStatistic
      title='Pembayaran Pembelian Dikirim'
      value={paymentsReceived?.value}
      count={paymentsReceived?.count}
      trend={paymentsReceived?.trend}
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
