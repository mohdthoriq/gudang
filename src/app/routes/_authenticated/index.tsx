import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    const {
      auth: { user },
    } = useAuthStore.getState()
    const roleName = user?.role?.name?.toLowerCase()
    if (roleName === 'superadmin' || roleName === 'super administrator') {
      throw redirect({
        to: '/admin/dashboard',
        search: {
          period: 'month',
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      })
    }
  },
  component: Dashboard,
})

