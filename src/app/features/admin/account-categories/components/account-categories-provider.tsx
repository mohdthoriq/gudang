import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react'
import type { PaginationMeta, AccountCategory } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { useAccountCategoriesQuery } from '../hooks/use-account-categories-query'

type AccountCategoriesDialogType = 'view' | 'edit' | 'add' | 'delete'

type AccountCategoriesContextType = {
  open: AccountCategoriesDialogType | null
  setOpen: (str: AccountCategoriesDialogType | null) => void
  currentRow: AccountCategory | null
  setCurrentRow: Dispatch<SetStateAction<AccountCategory | null>>
  accountCategoriesData: AccountCategory[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: { page?: number; limit?: number; name?: string }
}

const AccountCategoriesContext =
  createContext<AccountCategoriesContextType | null>(null)

export function AccountCategoriesProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: { page?: number; limit?: number; name?: string }
}) {
  const [open, setOpen] = useDialogState<AccountCategoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AccountCategory | null>(null)

  const {
    data: accountCategoriesData,
    isLoading: isLoadingAccountCategories,
    isError: isErrorAccountCategories,
  } = useAccountCategoriesQuery(paginationParams)

  const accountCategoriesProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    accountCategoriesData: accountCategoriesData?.data ?? [],
    pagination: accountCategoriesData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingAccountCategories,
    isError: isErrorAccountCategories,
    paginationParams,
  }

  return (
    <AccountCategoriesContext value={accountCategoriesProviderValues}>
      {children}
    </AccountCategoriesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAccountCategories = () => {
  const accountCategoriesContext = useContext(AccountCategoriesContext)

  if (!accountCategoriesContext) {
    throw new Error(
      'useAccountCategories has to be used within <AccountCategoriesProvider>'
    )
  }

  return accountCategoriesContext
}
