import { createContext, useContext, useState } from 'react'
import type { PaginationMeta, Warehouse } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { useWarehousesQuery } from '../hooks/use-warehouses-query'

type WarehousesDialogType = 'view' | 'edit' | 'add' | 'delete'

type WarehousesContextType = {
  open: WarehousesDialogType | null
  setOpen: (str: WarehousesDialogType | null) => void
  currentRow: Warehouse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Warehouse | null>>
  warehousesData: Warehouse[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: {
    page?: number
    limit?: number
    search?: string
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const WarehousesContext = createContext<WarehousesContextType | null>(null)

export function WarehousesProvider({
  children,
  paginationParams,
}: {
  children: React.ReactNode
  paginationParams?: {
    page?: number
    limit?: number
    search?: string
  }
}) {
  const [open, setOpen] = useDialogState<WarehousesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Warehouse | null>(null)

  const {
    data: warehousesData,
    isLoading: isLoadingWarehouses,
    isError: isErrorWarehouses,
  } = useWarehousesQuery(paginationParams)

  const warehousesProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    warehousesData: warehousesData?.data ?? [],
    pagination: warehousesData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingWarehouses,
    isError: isErrorWarehouses,
    paginationParams,
  }

  return (
    <WarehousesContext.Provider value={warehousesProviderValues}>{children}</WarehousesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWarehouses = () => {
  const warehousesContext = useContext(WarehousesContext)

  if (!warehousesContext) {
    throw new Error('useWarehouses has to be used within <WarehousesProvider>')
  }

  return warehousesContext
}
