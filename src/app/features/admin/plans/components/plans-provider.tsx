import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react'
import type { Plan, PaginationMeta } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import {
  type PlansQueryParams,
  usePlansQuery,
} from '../hooks/use-plans-query'

type PlansDialogType = 'view' | 'edit' | 'add' | 'delete'

type PlansContextType = {
  open: PlansDialogType | null
  setOpen: (str: PlansDialogType | null) => void
  currentRow: Plan | null
  setCurrentRow: Dispatch<SetStateAction<Plan | null>>
  plansData: Plan[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: PlansQueryParams
}

const PlansContext = createContext<PlansContextType | null>(null)

export function PlansProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: PlansQueryParams
}) {
  const [open, setOpen] = useDialogState<PlansDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Plan | null>(null)

  const {
    data: plansData,
    isLoading: isLoadingPlans,
    isError: isErrorPlans,
  } = usePlansQuery(paginationParams)

  const plansProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    plansData: plansData?.data ?? [],
    pagination: plansData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingPlans,
    isError: isErrorPlans,
    paginationParams,
  }

  return (
    <PlansContext value={plansProviderValues}>{children}</PlansContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePlans = () => {
  const plansContext = useContext(PlansContext)

  if (!plansContext) {
    throw new Error('usePlans has to be used within <PlansContext>')
  }

  return plansContext
}
