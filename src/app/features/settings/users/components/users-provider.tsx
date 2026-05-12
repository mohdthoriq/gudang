import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from 'react'
import type { PaginationMeta, User } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { type UsersQueryParams, useUsersQuery } from '../hooks/use-users-query'

type UsersDialogType = 'view' | 'edit' | 'add' | 'delete'

type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: Dispatch<SetStateAction<User | null>>
  usersData: User[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: UsersQueryParams
}

const UsersContext = createContext<UsersContextType | null>(null)

export function UsersProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: UsersQueryParams
}) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useUsersQuery(paginationParams)

  const usersProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    usersData: usersData?.data ?? [],
    pagination: usersData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    paginationParams,
  }

  return (
    <UsersContext.Provider value={usersProviderValues}>
      {children}
    </UsersContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersProvider>')
  }

  return usersContext
}
