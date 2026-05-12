import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { type VisibilityState } from '@tanstack/react-table'
import type { PaginationMeta, PurchaseDelivery } from '@/types'
import {
  type PurchaseDeliveryListQueryParams,
  usePurchaseDeliveryListQuery,
} from '../hooks/use-delivery-list-query'

type PurchaseDeliveryListsContextType = {
  deliveryListsData: PurchaseDelivery[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: PurchaseDeliveryListQueryParams
  columnVisibility: VisibilityState
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
}

const PurchaseDeliveryListsContext =
  createContext<PurchaseDeliveryListsContextType | null>(null)

export function DeliveryListsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: PurchaseDeliveryListQueryParams
}) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const {
    data: deliveryListsData,
    isLoading: isLoadingDeliveryLists,
    isError: isErrorDeliveryLists,
  } = usePurchaseDeliveryListQuery(paginationParams)

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
    <PurchaseDeliveryListsContext value={deliveryListsProviderValues}>
      {children}
    </PurchaseDeliveryListsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDeliveryLists = () => {
  const deliveryListsContext = useContext(PurchaseDeliveryListsContext)

  if (!deliveryListsContext) {
    throw new Error(
      'useDeliveryLists has to be used within <PurchaseDeliveryListsContext>'
    )
  }

  return deliveryListsContext
}
