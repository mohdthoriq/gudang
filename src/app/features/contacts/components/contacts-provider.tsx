import { createContext, useContext, useState } from 'react'
import type { PaginationMeta, Contact } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { useContactsQuery } from '../hooks/use-contacts-query'

type ContactsDialogType = 'view' | 'edit' | 'add' | 'delete'

type ContactsContextType = {
  open: ContactsDialogType | null
  setOpen: (str: ContactsDialogType | null) => void
  currentRow: Contact | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Contact | null>>
  contactsData: Contact[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: {
    page?: number
    limit?: number
    name?: string
    type_id?: string
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const ContactsContext = createContext<ContactsContextType | null>(null)

export function ContactsProvider({
  children,
  paginationParams,
}: {
  children: React.ReactNode
  paginationParams?: {
    page?: number
    limit?: number
    name?: string
    type_id?: string
  }
}) {
  const [open, setOpen] = useDialogState<ContactsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Contact | null>(null)

  const {
    data: contactsData,
    isLoading: isLoadingContacts,
    isError: isErrorContacts,
  } = useContactsQuery(paginationParams)

  const contactsProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    contactsData: contactsData?.data ?? [],
    pagination: contactsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingContacts,
    isError: isErrorContacts,
    paginationParams,
  }

  return (
    <ContactsContext value={contactsProviderValues}>{children}</ContactsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useContacts = () => {
  const contactsContext = useContext(ContactsContext)

  if (!contactsContext) {
    throw new Error('useContacts has to be used within <ContactsProvider>')
  }

  return contactsContext
}
