import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { VisibilityState } from '@tanstack/react-table'
import type { PaginationMeta, SalesOrder } from '@/types'
import {
  type SalesOrderListQueryParams,
  useSalesOrderListQuery,
} from '../hooks/use-sales-order-list-query'

type OrderListsContextType = {
  orderListsData: SalesOrder[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: SalesOrderListQueryParams
  columnVisibility: VisibilityState
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
}

const OrderListsContext = createContext<OrderListsContextType | null>(null)

export function OrderListsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: SalesOrderListQueryParams
}) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const {
    data: orderListsData,
    isLoading: isLoadingOrderLists,
    isError: isErrorOrderLists,
  } = useSalesOrderListQuery(paginationParams)

  const orderListsProviderValues = {
    orderListsData: orderListsData?.data ?? [],
    pagination: orderListsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingOrderLists,
    isError: isErrorOrderLists,
    paginationParams,
    columnVisibility,
    setColumnVisibility,
  }

  return (
    <OrderListsContext.Provider value={orderListsProviderValues}>
      {children}
    </OrderListsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOrderLists = () => {
  const orderListsContext = useContext(OrderListsContext)

  if (!orderListsContext) {
    throw new Error(
      'useOrderLists has to be used within <OrderListsContext>'
    )
  }

  return orderListsContext
}
