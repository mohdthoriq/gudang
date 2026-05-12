import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useState } from 'react'
import type { CompanyRole, PaginationMeta } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import {
  type RoleSettingsQueryParams,
  useCompanyRoleSettingsQuery,
} from '../hooks/use-company-roles-query'

type RolesDialogType = 'view' | 'delete'

type RolesContextType = {
  open: RolesDialogType | null
  setOpen: (str: RolesDialogType | null) => void
  currentRow: CompanyRole | null
  setCurrentRow: Dispatch<SetStateAction<CompanyRole | null>>
  rolesData: CompanyRole[]
  isLoading: boolean
  isError: boolean
  pagination: PaginationMeta
  paginationParams?: RoleSettingsQueryParams
}

// eslint-disable-next-line react-refresh/only-export-components
export const RolesContext = createContext<RolesContextType | null>(null)

export function CompanyRolesProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: RoleSettingsQueryParams
}) {
  const [open, setOpen] = useDialogState<RolesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CompanyRole | null>(null)

  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = useCompanyRoleSettingsQuery(paginationParams)

  const rolesProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    rolesData: rolesData?.data ?? [],
    pagination: rolesData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
    paginationParams,
  }

  return <RolesContext value={rolesProviderValues}>{children}</RolesContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCompanyRoles = () => {
  const rolesContext = useContext(RolesContext)

  if (!rolesContext) {
    throw new Error('useCompanyRoles has to be used within <RolesContext>')
  }

  return rolesContext
}
