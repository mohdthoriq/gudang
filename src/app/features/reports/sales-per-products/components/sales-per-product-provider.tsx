import { createContext, type ReactNode, useContext, useState } from 'react'
import type { PaginationMeta } from '@/types'
import type { ProductSalesReport } from '@/types/domain/sales-per-products'
import {
  type SalesPerProductQueryParams,
  useSalesPerProductQuery,
} from '../hooks/use-sales-per-product-query'

type SalesPerProductContextType = {
  salesPerProductData: ProductSalesReport | undefined
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: SalesPerProductQueryParams
  date_from: Date
  date_to: Date
  setDateRange: (date_from: Date, date_to: Date) => void
}

// eslint-disable-next-line
export const SalesPerProductContext =
  createContext<SalesPerProductContextType | null>(null)

export function SalesPerProductProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams: SalesPerProductQueryParams
}) {
  const [dateFrom, setDateFrom] = useState(paginationParams.date_from ?? new Date())
  const [dateTo, setDateTo] = useState(paginationParams.date_to ?? new Date())
  const {
    data: salesPerProductData,
    isLoading: isLoadingSalesPerProduct,
    isError: isErrorSalesPerProduct,
  } = useSalesPerProductQuery(paginationParams)

  const setDateRange = (date_from: Date, date_to: Date) => {
    setDateFrom(date_from)
    setDateTo(date_to)
  }

  const accountsProviderValues = {
    salesPerProductData,
    pagination: salesPerProductData?.pagination ?? {
      page: 1,
      limit: 1000,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingSalesPerProduct,
    isError: isErrorSalesPerProduct,
    paginationParams,
    date_from: dateFrom,
    date_to: dateTo,
    setDateRange,
  }

  return (
    <SalesPerProductContext value={accountsProviderValues}>
      {children}
    </SalesPerProductContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSalesPerProduct = () => {
  const salesPerProductContext = useContext(SalesPerProductContext)

  if (!salesPerProductContext) {
    throw new Error(
      'useSalesPerProduct has to be used within <SalesPerProductProvider>'
    )
  }

  return salesPerProductContext
}
