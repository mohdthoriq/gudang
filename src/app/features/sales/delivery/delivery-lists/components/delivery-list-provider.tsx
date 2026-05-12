import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { type VisibilityState } from '@tanstack/react-table'
import type { PaginationMeta, SalesDelivery } from '@/types'
import {
  type DeliveryListQueryParams,
  useDeliveryListQuery,
} from '../hooks/use-delivery-list-query'

type DeliveryListsContextType = {
  deliveryListsData: SalesDelivery[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: DeliveryListQueryParams
  columnVisibility: VisibilityState
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
}

const DeliveryListsContext = createContext<DeliveryListsContextType | null>(null)

export function DeliveryListsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: DeliveryListQueryParams
}) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const {
    data: deliveryListsData,
    isLoading: isLoadingDeliveryLists,
    isError: isErrorDeliveryLists,
  } = useDeliveryListQuery(paginationParams)

  const deliveryListsProviderValues = {
    deliveryListsData: deliveryListsData?.data ?? [],
    pagination: deliveryListsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingDeliveryLists,
    isError: isErrorDeliveryLists,
    paginationParams,
    columnVisibility,
    setColumnVisibility,
  }

  return (
    <DeliveryListsContext value={deliveryListsProviderValues}>
      {children}
    </DeliveryListsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDeliveryLists = () => {
  const deliveryListsContext = useContext(DeliveryListsContext)

  if (!deliveryListsContext) {
    throw new Error(
      'useDeliveryLists has to be used within <DeliveryListsContext>'
    )
  }

  return deliveryListsContext
}
