import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react'
import type { PaginationMeta, Product } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import {
  useProductsQuery,
  type ProductsQueryParams,
} from '../hooks/use-product-list-query'

type ProductsDialogType = 'add' | 'edit' | 'delete' | 'view'

type ProductsContextType = {
  open: ProductsDialogType | null
  setOpen: (str: ProductsDialogType | null) => void
  currentRow: Product | null
  setCurrentRow: Dispatch<SetStateAction<Product | null>>
  productsData: Product[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: ProductsQueryParams
}

const ProductsContext = createContext<ProductsContextType | null>(null)

export function ProductsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: ProductsQueryParams
}) {
  const [open, setOpen] = useDialogState<ProductsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Product | null>(null)

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useProductsQuery(paginationParams)

  const productsProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    productsData: productsData?.data ?? [],
    pagination: productsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    paginationParams,
  }

  return (
    <ProductsContext.Provider value={productsProviderValues}>
      {children}
    </ProductsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
  const productsContext = useContext(ProductsContext)

  if (!productsContext) {
    throw new Error('useProducts has to be used within <ProductsProvider>')
  }

  return productsContext
}
