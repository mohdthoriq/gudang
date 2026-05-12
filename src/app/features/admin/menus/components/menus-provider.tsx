import React, { useState } from 'react'
import type { PaginationMeta, Menu } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { useMenusQuery } from '../hooks/use-menus-query'

type MenusDialogType = 'view' | 'edit' | 'add' | 'delete'

type MenusContextType = {
  open: MenusDialogType | null
  setOpen: (str: MenusDialogType | null) => void
  currentRow: Menu | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Menu | null>>
  menusData: Menu[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: { page?: number; limit?: number; name?: string }
}

const MenusContext = React.createContext<MenusContextType | null>(null)

export function MenusProvider({
  children,
  paginationParams,
}: {
  children: React.ReactNode
  paginationParams?: { page?: number; limit?: number; name?: string }
}) {
  const [open, setOpen] = useDialogState<MenusDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Menu | null>(null)

  const {
    data: menusData,
    isLoading: isLoadingMenus,
    isError: isErrorMenus,
  } = useMenusQuery(paginationParams)

  const menusProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    menusData: menusData?.data ?? [],
    pagination: menusData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingMenus,
    isError: isErrorMenus,
    paginationParams,
  }

  return <MenusContext value={menusProviderValues}>{children}</MenusContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMenus = () => {
  const menusContext = React.useContext(MenusContext)

  if (!menusContext) {
    throw new Error('useMenus has to be used within <MenusContext>')
  }

  return menusContext
}
