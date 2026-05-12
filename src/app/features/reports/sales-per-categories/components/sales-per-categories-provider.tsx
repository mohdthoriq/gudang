import { createContext, type ReactNode, useContext, useState } from 'react'
import type { PaginationMeta } from '@/types'
import type { CategorySalesReport } from '@/types/domain/sales-per-categories'
import {
  type SalesPerCategoryQueryParams,
  useSalesPerCategoryQuery,
} from '../hooks/use-sales-per-category-query'

type SalesPerCategoriesContextType = {
  salesPerCategoriesData: CategorySalesReport | undefined
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: SalesPerCategoryQueryParams
  date_from: Date
  date_to: Date
  setDateRange: (date_from: Date, date_to: Date) => void
}

// eslint-disable-next-line
export const SalesPerCategoriesContext =
  createContext<SalesPerCategoriesContextType | null>(null)

export function SalesPerCategoriesProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams: SalesPerCategoryQueryParams
}) {
  const [dateFrom, setDateFrom] = useState(
    paginationParams.date_from ?? new Date()
  )
  const [dateTo, setDateTo] = useState(paginationParams.date_to ?? new Date())
  const {
    data: salesPerCategoriesData,
    isLoading: isLoadingSalesPerCategories,
    isError: isErrorSalesPerCategories,
  } = useSalesPerCategoryQuery(paginationParams)

  const setDateRange = (date_from: Date, date_to: Date) => {
    setDateFrom(date_from)
    setDateTo(date_to)
  }

  const accountsProviderValues = {
    salesPerCategoriesData,
    pagination: salesPerCategoriesData?.pagination ?? {
      page: 1,
      limit: 1000,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingSalesPerCategories,
    isError: isErrorSalesPerCategories,
    paginationParams,
    date_from: dateFrom,
    date_to: dateTo,
    setDateRange,
  }

  return (
    <SalesPerCategoriesContext value={accountsProviderValues}>
      {children}
    </SalesPerCategoriesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSalesPerCategories = () => {
  const salesPerCategoriesContext = useContext(SalesPerCategoriesContext)

  if (!salesPerCategoriesContext) {
    throw new Error(
      'useSalesPerCategories has to be used within <SalesPerCategoriesProvider>'
    )
  }

  return salesPerCategoriesContext
}
