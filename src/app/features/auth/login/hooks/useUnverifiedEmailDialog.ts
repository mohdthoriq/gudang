import { useState } from 'react'

interface UseUnverifiedEmailDialogReturn {
  isOpen: boolean
  email: string
  openDialog: (email: string) => void
  closeDialog: () => void
  setOpen: (open: boolean) => void
}

export function useUnverifiedEmailDialog(): UseUnverifiedEmailDialogReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')

  const openDialog = (userEmail: string) => {
    setEmail(userEmail)
    setIsOpen(true)
  }

  const closeDialog = () => {
    setIsOpen(false)
    setEmail('')
  }

  return {
    isOpen,
    email,
    openDialog,
    closeDialog,
    setOpen: setIsOpen,
  }
}
