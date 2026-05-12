import { useAuthStore } from '@/stores/auth-store'
import type { PermissionKey } from '@/constants/permissions'

export function useHasPermission(permission: PermissionKey): boolean {
  const user = useAuthStore((state) => state.auth?.user)

  if (!user || !user.permissions) return false

  return user.permissions.includes(permission)
}
