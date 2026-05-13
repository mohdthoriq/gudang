"use client" // Wajib tambahkan ini di baris paling atas

import { createContext, useContext, useEffect, useState } from 'react'
import { CommandMenu } from '@/components/command-menu' // Sesuaikan path jika sudah dipindah

type SearchContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchContext = createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      {/* Pastikan kamu punya komponen CommandMenu untuk memunculkan popup-nya */}
      <CommandMenu /> 
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const searchContext = useContext(SearchContext)
  if (!searchContext) {
    throw new Error('useSearch has to be used within SearchProvider')
  }
  return searchContext
}
