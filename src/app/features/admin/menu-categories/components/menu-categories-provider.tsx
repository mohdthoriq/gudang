import React, { createContext, useContext, useState } from 'react'
import type { MenuCategory, PaginationMeta } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { useMenuCategoriesQuery } from '../hooks/use-menu-categories-query'

type MenuCategoriesDialogType = 'add' | 'edit' | 'delete'

interface MenuCategoriesContextType {
  open: MenuCategoriesDialogType | null
  setOpen: (open: MenuCategoriesDialogType | null) => void
  currentRow: MenuCategory | null
  setCurrentRow: React.Dispatch<React.SetStateAction<MenuCategory | null>>
  menuCategoriesData: MenuCategory[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams: {
    page?: number
    limit?: number
    name?: string
  }
}

const MenuCategoriesContext = createContext<MenuCategoriesContextType | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useMenuCategories = () => {
  const context = useContext(MenuCategoriesContext)
  if (!context) {
    throw new Error('useMenuCategories must be used within a MenuCategoriesProvider')
  }
  return context
}

export const MenuCategoriesProvider = ({
  children,
  paginationParams,
}: {
  children: React.ReactNode
  paginationParams: { page?: number; limit?: number; name?: string }
}) => {
  const [open, setOpen] = useDialogState<MenuCategoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<MenuCategory | null>(null)

  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useMenuCategoriesQuery(paginationParams)

  return (
    <MenuCategoriesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        menuCategoriesData: categoriesData?.data ?? [],
        pagination: categoriesData?.pagination ?? {
          page: 1,
          limit: 10,
          total: 0,
          total_pages: 1,
        },
        isLoading,
        isError,
        paginationParams,
      }}
    >
      {children}
    </MenuCategoriesContext.Provider>
  )
}
