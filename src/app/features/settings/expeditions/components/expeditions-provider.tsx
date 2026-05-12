import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { PaginationMeta, Expedition } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { type ExpeditionsQueryParams, useExpeditionsQuery } from '../hooks/use-expeditions-query'

type ExpeditionsDialogType = 'edit' | 'add'

type ExpeditionsContextType = {
  open: ExpeditionsDialogType | null
  setOpen: (str: ExpeditionsDialogType | null) => void
  currentRow: Expedition | null
  setCurrentRow: Dispatch<SetStateAction<Expedition | null>>
  expeditionsData: Expedition[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: ExpeditionsQueryParams
}

// eslint-disable-next-line react-refresh/only-export-components
export const ExpeditionsContext = createContext<ExpeditionsContextType | null>(null)

export function ExpeditionsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: ExpeditionsQueryParams
}) {
  const [open, setOpen] = useDialogState<ExpeditionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Expedition | null>(null)

  const {
    data: expeditionsData,
    isLoading: isLoadingExpeditions,
    isError: isErrorExpeditions,
  } = useExpeditionsQuery(paginationParams)

  const expeditionsProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    expeditionsData: expeditionsData?.data ?? [],
    pagination: expeditionsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingExpeditions,
    isError: isErrorExpeditions,
    paginationParams,
  }

  return <ExpeditionsContext value={expeditionsProviderValues}>{children}</ExpeditionsContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useExpeditions = () => {
  const expeditionsContext = useContext(ExpeditionsContext)

  if (!expeditionsContext) {
    throw new Error('useExpeditions has to be used within <ExpeditionsContext>')
  }

  return expeditionsContext
}
