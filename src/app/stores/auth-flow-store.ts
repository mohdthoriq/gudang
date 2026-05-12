import type { AuthPurpose } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthFlowState {
  email: string | null
  purpose: AuthPurpose | null
  otp_code: string | null
  setAuthFlow: (
    data: Partial<Omit<AuthFlowState, 'setAuthFlow' | 'clearAuthFlow'>>
  ) => void
  clearAuthFlow: () => void
}

export const useAuthFlowStore = create<AuthFlowState>()(
  persist(
    (set) => ({
      email: null,
      purpose: null,
      otp_code: null,
      setAuthFlow: (data) =>
        set((state) => {
          return {
            ...state,
            ...data,
          }
        }),
      clearAuthFlow: () => {
        set({
          email: null,
          purpose: null,
          otp_code: null,
        })
      },
    }),
    {
      name: 'auth-flow-storage',
    }
  )
)
