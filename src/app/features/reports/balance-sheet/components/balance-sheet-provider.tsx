import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { BalanceSheetData } from '@/types'
import type { Period } from '@/features/sales/overview/types/sales-overview'
import { useBalanceSheetReportQuery } from '../hooks/use-balance-sheet-report-query'

interface BalanceSheetContextType {
  selectedAccountId: string | null
  data: BalanceSheetData | null | undefined
  isLoading: boolean
  isOpen: boolean
  date: Date
  period: Period
  openDetail: (accountId: string) => void
  closeDetail: () => void
  setDate: (date: Date) => void
  setPeriod: (period: Period) => void
}

const BalanceSheetContext = createContext<BalanceSheetContextType | undefined>(
  undefined
)

export function BalanceSheetProvider({
  children,
  defaultDate,
}: {
  children: ReactNode
  defaultDate: Date
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  )
  const [date, setDate] = useState<Date>(defaultDate)
  const [period, setPeriod] = useState<Period>('month') // Default period
  const { data, isLoading } = useBalanceSheetReportQuery({ date })

  useEffect(() => {
    if (defaultDate) {
      // eslint-disable-next-line
      setDate(defaultDate)
    }
  }, [defaultDate])

  const openDetail = (accountId: string) => {
    setSelectedAccountId(accountId)
    setIsOpen(true)
  }

  const closeDetail = () => {
    setIsOpen(false)
    setSelectedAccountId(null)
  }

  return (
    <BalanceSheetContext.Provider
      value={{
        selectedAccountId,
        isOpen,
        date,
        period,
        data,
        isLoading,
        openDetail,
        closeDetail,
        setDate,
        setPeriod,
      }}
    >
      {children}
    </BalanceSheetContext.Provider>
  )
}

// eslint-disable-next-line
export function useBalanceSheetContext() {
  const context = useContext(BalanceSheetContext)
  if (!context) {
    throw new Error(
      'useBalanceSheetContext must be used within a BalanceSheetProvider'
    )
  }
  return context
}
