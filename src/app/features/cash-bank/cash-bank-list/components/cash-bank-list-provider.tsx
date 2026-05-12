import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react'
import type { VisibilityState } from '@tanstack/react-table'
import type {
  CashBankTransaction,
  PaginationMeta,
  TransactionData,
} from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import {
  useCashBankListQuery,
  type CashBankListQueryParams,
} from '../hooks/use-cash-bank-list-query'

type CashBankListDialogType = 'edit' | 'transfer'

type CashBankListsContextType = {
  open: CashBankListDialogType | null
  setOpen: (str: CashBankListDialogType | null) => void
  cashBankListsData: CashBankTransaction | null | undefined
  cashBankTransactionListsData: TransactionData[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: CashBankListQueryParams
  columnVisibility: VisibilityState
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const CashBankListsContext =
  createContext<CashBankListsContextType | null>(null)

export function CashBankListsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: CashBankListQueryParams
}) {
  const [open, setOpen] = useDialogState<CashBankListDialogType>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const {
    data: cashBankListsData,
    isLoading: isLoadingCashBankLists,
    isError: isErrorCashBankLists,
  } = useCashBankListQuery(paginationParams)

  const cashBankListsProviderValues = {
    open,
    setOpen,
    cashBankListsData: cashBankListsData,
    cashBankTransactionListsData: cashBankListsData?.transactions ?? [],
    pagination: cashBankListsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingCashBankLists,
    isError: isErrorCashBankLists,
    paginationParams,
    columnVisibility,
    setColumnVisibility,
  }

  return (
    <CashBankListsContext value={cashBankListsProviderValues}>
      {children}
    </CashBankListsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCashBankLists = () => {
  const cashBankListsContext = useContext(CashBankListsContext)

  if (!cashBankListsContext) {
    throw new Error(
      'useCashBankLists has to be used within <CashBankListsContext>'
    )
  }

  return cashBankListsContext
}
