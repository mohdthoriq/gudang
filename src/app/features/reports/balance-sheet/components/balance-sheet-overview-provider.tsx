import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Period } from '@/features/sales/overview/types/sales-overview'

interface BalanceSheetOverviewContextType {
  date: Date
  period: Period
  setDate: (date: Date) => void
  setPeriod: (period: Period) => void
}

const BalanceSheetOverviewContext = createContext<
  BalanceSheetOverviewContextType | undefined
>(undefined)

export function BalanceSheetOverviewProvider({
  children,
  defaultDate,
}: {
  children: ReactNode
  defaultDate: Date
}) {
  const [date, setDate] = useState<Date>(defaultDate)
  const [period, setPeriod] = useState<Period>('month')

  return (
    <BalanceSheetOverviewContext.Provider
      value={{
        date,
        period,
        setDate,
        setPeriod,
      }}
    >
      {children}
    </BalanceSheetOverviewContext.Provider>
  )
}

// eslint-disable-next-line
export function useBalanceSheetOverviewContext() {
  const context = useContext(BalanceSheetOverviewContext)
  if (!context) {
    throw new Error(
      'useBalanceSheetOverviewContext must be used within a BalanceSheetOverviewProvider'
    )
  }
  return context
}
