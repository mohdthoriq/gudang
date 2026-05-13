"use client" // Wajib untuk Context di Next.js App Router

import { createContext, useContext, useEffect, useState } from 'react'

export type Collapsible = 'offcanvas' | 'icon' | 'none'
export type Variant = 'inset' | 'sidebar' | 'floating'

const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible'
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant'

// Default values
const DEFAULT_VARIANT: Variant = 'sidebar'
const DEFAULT_COLLAPSIBLE: Collapsible = 'icon'

// --- Utility Cookie Mini (Agar tidak butuh file eksternal) ---
const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === 'undefined') return
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`
}

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}
// -----------------------------------------------------------

type LayoutContextType = {
  resetLayout: () => void
  defaultCollapsible: Collapsible
  collapsible: Collapsible
  setCollapsible: (collapsible: Collapsible) => void
  defaultVariant: Variant
  variant: Variant
  setVariant: (variant: Variant) => void
}

const LayoutContext = createContext<LayoutContextType | null>(null)

type LayoutProviderProps = {
  children: React.ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  // Gunakan state default untuk render pertama (Server SSR)
  const [collapsible, _setCollapsible] = useState<Collapsible>(DEFAULT_COLLAPSIBLE)
  const [variant, _setVariant] = useState<Variant>(DEFAULT_VARIANT)
  const [isMounted, setIsMounted] = useState(false)

  // Baca cookie HANYA setelah komponen dimuat di browser (Client-side)
  useEffect(() => {
    setIsMounted(true)
    const savedCollapsible = getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME) as Collapsible
    if (savedCollapsible) _setCollapsible(savedCollapsible)

    const savedVariant = getCookie(LAYOUT_VARIANT_COOKIE_NAME) as Variant
    if (savedVariant) _setVariant(savedVariant)
  }, [])

  const setCollapsible = (newCollapsible: Collapsible) => {
    _setCollapsible(newCollapsible)
    setCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME, newCollapsible, 7) // 7 days
  }

  const setVariant = (newVariant: Variant) => {
    _setVariant(newVariant)
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, newVariant, 7) // 7 days
  }

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE)
    setVariant(DEFAULT_VARIANT)
  }

  const contextValue: LayoutContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
  }

  // Mencegah Hydration Mismatch dengan me-render children setelah mounted
  // Atau bisa langsung me-render children jika tidak ada perubahan drastis di DOM awal
  return (
    <LayoutContext.Provider value={contextValue}>
      {/* Opsional: Render transparan agar tidak kedip saat transisi cookie */}
      <div style={{ opacity: isMounted ? 1 : 0, transition: 'opacity 0.2s' }}>
        {children}
      </div>
    </LayoutContext.Provider>
  )
}

// Define the hook for the provider
export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}