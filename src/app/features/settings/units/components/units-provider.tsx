import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { PaginationMeta, Unit } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { type UnitsQueryParams, useUnitsQuery } from '../hooks/use-units-query'

type UnitsDialogType = 'edit' | 'add'

type UnitsContextType = {
  open: UnitsDialogType | null
  setOpen: (str: UnitsDialogType | null) => void
  currentRow: Unit | null
  setCurrentRow: Dispatch<SetStateAction<Unit | null>>
  unitsData: Unit[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: UnitsQueryParams
}

// eslint-disable-next-line react-refresh/only-export-components
export const UnitsContext = createContext<UnitsContextType | null>(null)

export function UnitsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: UnitsQueryParams
}) {
  const [open, setOpen] = useDialogState<UnitsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Unit | null>(null)

  const {
    data: unitsData,
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
  } = useUnitsQuery(paginationParams)

  const unitsProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    unitsData: unitsData?.data ?? [],
    pagination: unitsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
    paginationParams,
  }

  return <UnitsContext value={unitsProviderValues}>{children}</UnitsContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUnits = () => {
  const unitsContext = useContext(UnitsContext)

  if (!unitsContext) {
    throw new Error('useUnits has to be used within <UnitsContext>')
  }

  return unitsContext
}
