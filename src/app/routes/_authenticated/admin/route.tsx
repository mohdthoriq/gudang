import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: () => {
    const {
      auth: { isAuthenticated, resetAccessToken, user },
    } = useAuthStore.getState()
    const roleName = user?.role?.name?.toLowerCase()
    if (!isAuthenticated || (roleName !== 'superadmin' && roleName !== 'super administrator')) {
      resetAccessToken()
      throw redirect({
        to: '/login',
      })
    }
  },
})
