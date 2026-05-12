import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useState } from 'react'
import type { PaginationMeta, ProductCategory } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { type ProductCategoryQueryParams, useProductCategoryQuery } from '../hooks/use-product-category-query'

type ProductCategoryDialogType = 'view' | 'edit' | 'add' | 'delete'

type ProductCategoryContextType = {
  open: ProductCategoryDialogType | null
  setOpen: (str: ProductCategoryDialogType | null) => void
  currentRow: ProductCategory | null
  setCurrentRow: Dispatch<SetStateAction<ProductCategory | null>>
  productCategoriesData: ProductCategory[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: ProductCategoryQueryParams
}

// eslint-disable-next-line react-refresh/only-export-components
export const ProductCategoryContext = createContext<ProductCategoryContextType | null>(
  null
)

export function ProductCategoryProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: ProductCategoryQueryParams
}) {
  const [open, setOpen] = useDialogState<ProductCategoryDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProductCategory | null>(null)

  const {
    data: productCategoriesData,
    isLoading: isLoadingProductCategories,
    isError: isErrorProductCategories,
  } = useProductCategoryQuery(paginationParams)

  const productCategoriesProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    productCategoriesData: productCategoriesData?.data ?? [],
    pagination: productCategoriesData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingProductCategories,
    isError: isErrorProductCategories,
    paginationParams,
  }

  return (
    <ProductCategoryContext value={productCategoriesProviderValues}>
      {children}
    </ProductCategoryContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProductCategories = () => {
  const productCategoriesContext = useContext(ProductCategoryContext)

  if (!productCategoriesContext) {
    throw new Error(
      'useProductCategories has to be used within <ProductCategoryProvider>'
    )
  }

  return productCategoriesContext
}
