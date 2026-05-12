import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { VisibilityState } from '@tanstack/react-table'
import type { PaginationMeta, SalesInvoice } from '@/types'
import {
  type InvoiceListQueryParams,
  useInvoiceListQuery,
} from '../hooks/use-invoice-list-query'

type InvoiceListsContextType = {
  invoiceListsData: SalesInvoice[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: InvoiceListQueryParams
  columnVisibility: VisibilityState
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
}

const InvoiceListsContext = createContext<InvoiceListsContextType | null>(null)

export function InvoiceListsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: InvoiceListQueryParams
}) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const {
    data: invoiceListsData,
    isLoading: isLoadingInvoiceLists,
    isError: isErrorInvoiceLists,
  } = useInvoiceListQuery(paginationParams)

  const invoiceListsProviderValues = {
    invoiceListsData: invoiceListsData?.data ?? [],
    pagination: invoiceListsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingInvoiceLists,
    isError: isErrorInvoiceLists,
    paginationParams,
    columnVisibility,
    setColumnVisibility,
  }

  return (
    <InvoiceListsContext value={invoiceListsProviderValues}>
      {children}
    </InvoiceListsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useInvoiceLists = () => {
  const invoiceListsContext = useContext(InvoiceListsContext)

  if (!invoiceListsContext) {
    throw new Error(
      'useInvoiceLists has to be used within <InvoiceListsContext>'
    )
  }

  return invoiceListsContext
}
