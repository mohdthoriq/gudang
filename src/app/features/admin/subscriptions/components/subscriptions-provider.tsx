import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react'
import type { PaginationMeta, Subscription } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import {
  type SubscriptionsQueryParams,
  useSubscriptionsQuery,
} from '../hooks/use-subscriptions-query'

type SubscriptionsDialogType = 'view' | 'edit' | 'add' | 'delete'

type SubscriptionsContextType = {
  open: SubscriptionsDialogType | null
  setOpen: (str: SubscriptionsDialogType | null) => void
  currentRow: Subscription | null
  setCurrentRow: Dispatch<SetStateAction<Subscription | null>>
  subscriptionsData: Subscription[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: SubscriptionsQueryParams
}

const SubscriptionsContext = createContext<SubscriptionsContextType | null>(
  null
)

export function SubscriptionsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: SubscriptionsQueryParams
}) {
  const [open, setOpen] = useDialogState<SubscriptionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Subscription | null>(null)

  const {
    data: subscriptionsData,
    isLoading: isLoadingSubscriptions,
    isError: isErrorSubscriptions,
  } = useSubscriptionsQuery(paginationParams)

  const subscriptionsProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    subscriptionsData: subscriptionsData?.data ?? [],
    pagination: subscriptionsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingSubscriptions,
    isError: isErrorSubscriptions,
    paginationParams,
  }

  return (
    <SubscriptionsContext value={subscriptionsProviderValues}>
      {children}
    </SubscriptionsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSubscriptions = () => {
  const subscriptionsContext = useContext(SubscriptionsContext)

  if (!subscriptionsContext) {
    throw new Error(
      'useSubscriptions has to be used within <SubscriptionsContext>'
    )
  }

  return subscriptionsContext
}
