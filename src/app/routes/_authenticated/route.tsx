import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const {
      auth: { isAuthenticated, resetAccessToken },
    } = useAuthStore.getState()
    if (!isAuthenticated) {
      resetAccessToken()
      throw redirect({
        to: '/login',
      })
    }
  },
  component: AuthenticatedLayout,
})
