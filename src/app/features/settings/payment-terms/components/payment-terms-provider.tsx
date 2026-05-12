import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from 'react'
import type { PaymentTerm, PaginationMeta } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import {
  type PaymentTermsQueryParams,
  usePaymentTermsQuery,
} from '../hooks/use-payment-terms-query'

type PaymentTermsDialogType = 'edit' | 'add'

type PaymentTermsContextType = {
  open: PaymentTermsDialogType | null
  setOpen: (str: PaymentTermsDialogType | null) => void
  currentRow: PaymentTerm | null
  setCurrentRow: Dispatch<SetStateAction<PaymentTerm | null>>
  paymentTermsData: PaymentTerm[]
  isLoading: boolean
  isError: boolean
  pagination: PaginationMeta
  paginationParams?: PaymentTermsQueryParams
}

// eslint-disable-next-line react-refresh/only-export-components
export const PaymentTermsContext =
  createContext<PaymentTermsContextType | null>(null)

export function PaymentTermsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: PaymentTermsQueryParams
}) {
  const [open, setOpen] = useDialogState<PaymentTermsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PaymentTerm | null>(null)

  const {
    data: paymentTermsData,
    isLoading: isLoadingPaymentTerms,
    isError: isErrorPaymentTerms,
  } = usePaymentTermsQuery(paginationParams)

  const paymentTermsProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    paymentTermsData: paymentTermsData?.data ?? [],
    pagination: paymentTermsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingPaymentTerms,
    isError: isErrorPaymentTerms,
    paginationParams,
  }

  return (
    <PaymentTermsContext value={paymentTermsProviderValues}>
      {children}
    </PaymentTermsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePaymentTerms = () => {
  const paymentTermsContext = useContext(PaymentTermsContext)

  if (!paymentTermsContext) {
    throw new Error(
      'usePaymentTerms has to be used within <PaymentTermsContext>'
    )
  }

  return paymentTermsContext
}
