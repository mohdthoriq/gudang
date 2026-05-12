import { createContext, useContext, useState, type ReactNode } from 'react'
import type { TransactionType, PaginationMeta } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { useTransactionTypesQuery } from '../hooks/use-transaction-types-query'

type TransactionTypesDialogType = 'add' | 'edit' | 'delete' | 'view'

interface TransactionTypesContextType {
  open: TransactionTypesDialogType | null
  setOpen: (open: TransactionTypesDialogType | null) => void
  currentRow: TransactionType | null
  setCurrentRow: (row: TransactionType | null) => void
  transactionTypesData: TransactionType[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
}

const TransactionTypesContext = createContext<
  TransactionTypesContextType | undefined
>(undefined)

export function TransactionTypesProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams: {
    page?: number
    limit?: number
    name?: string
  }
}) {
  const [open, setOpen] = useDialogState<TransactionTypesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TransactionType | null>(null)

  const transactionTypesQuery = useTransactionTypesQuery(paginationParams)

  const transactionTypesData = transactionTypesQuery.data?.data ?? []
  
  // Robust pagination handling: 
  // If the API returns 'pagination: null', we derive a virtual pagination object 
  // from the actual data length to ensure the UI (e.g., DataTablePagination) works correctly.
  const paginationFromData = transactionTypesQuery.data?.pagination ?? {
    page: paginationParams.page ?? 1,
    limit: paginationParams.limit ?? 10,
    total: transactionTypesData.length,
    total_pages: Math.ceil(
      transactionTypesData.length / (paginationParams.limit ?? 10)
    ) || 1,
  }

  return (
    <TransactionTypesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        transactionTypesData,
        pagination: paginationFromData,
        isLoading: transactionTypesQuery.isLoading,
        isError: transactionTypesQuery.isError,
      }}
    >
      {children}
    </TransactionTypesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTransactionTypes() {
  const context = useContext(TransactionTypesContext)
  if (context === undefined) {
    throw new Error(
      'useTransactionTypes must be used within a TransactionTypesProvider'
    )
  }
  return context
}
