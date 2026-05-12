import React, { useState } from 'react'
import type { PaginationMeta, Permission } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { usePermissionsQuery } from '../hooks/use-permissions-query'

type PermissionsDialogType = 'view' | 'edit' | 'add' | 'delete'

type PermissionsContextType = {
  open: PermissionsDialogType | null
  setOpen: (str: PermissionsDialogType | null) => void
  currentRow: Permission | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Permission | null>>
  permissionsData: Permission[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: { page?: number; limit?: number; name?: string }
}

const PermissionsContext = React.createContext<PermissionsContextType | null>(
  null
)

export function PermissionsProvider({
  children,
  paginationParams,
}: {
  children: React.ReactNode
  paginationParams?: { page?: number; limit?: number; name?: string }
}) {
  const [open, setOpen] = useDialogState<PermissionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Permission | null>(null)

  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = usePermissionsQuery(paginationParams)

  const permissionsProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    permissionsData: permissionsData?.data ?? [],
    pagination: permissionsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
    paginationParams,
  }

  return (
    <PermissionsContext value={permissionsProviderValues}>
      {children}
    </PermissionsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePermissions = () => {
  const permissionsContext = React.useContext(PermissionsContext)

  if (!permissionsContext) {
    throw new Error('usePermissions has to be used within <PermissionsContext>')
  }

  return permissionsContext
}
