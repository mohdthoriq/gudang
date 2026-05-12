import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react'
import type { PaginationMeta, Account } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import {
  type AccountQueryParams,
  useAccountsQuery,
} from '../hooks/use-account-query'

type AccountsDialogType = 'edit' | 'add' | 'ledger'

type AccountsContextType = {
  open: AccountsDialogType | null
  setOpen: (str: AccountsDialogType | null) => void
  currentRow: Account | null
  setCurrentRow: Dispatch<SetStateAction<Account | null>>
  accountsData: Account[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: AccountQueryParams
}

// eslint-disable-next-line
export const AccountsContext = createContext<AccountsContextType | null>(null)

export function AccountsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: AccountQueryParams
}) {
  const [open, setOpen] = useDialogState<AccountsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Account | null>(null)

  const {
    data: accountsData,
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
  } = useAccountsQuery(paginationParams)

  const buildAccountTree = (accounts: Account[]): Account[] => {
    const accountMap = new Map<string, Account & { subRows: Account[] }>()
    const roots: Account[] = []

    // First pass: create mapping
    accounts.forEach((account) => {
      accountMap.set(account.id, { ...account, subRows: [] })
    })

    // Second pass: build tree
    accounts.forEach((account) => {
      const node = accountMap.get(account.id)!
      if (account.parent && accountMap.has(account.parent.id)) {
        const parentNode = accountMap.get(account.parent.id)!
        parentNode.subRows.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }

  const accountsProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    accountsData:
      accountsData && accountsData.data
        ? buildAccountTree(accountsData.data)
        : [],
    pagination: accountsData?.pagination ?? {
      page: 1,
      limit: 1000,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
    paginationParams,
  }

  return (
    <AccountsContext value={accountsProviderValues}>{children}</AccountsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAccounts = () => {
  const accountsContext = useContext(AccountsContext)

  if (!accountsContext) {
    throw new Error('useAccounts has to be used within <AccountsProvider>')
  }

  return accountsContext
}
