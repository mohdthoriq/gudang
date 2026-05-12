import { type ReactNode } from 'react'
import type { PermissionKey } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'

interface PermissionGuardProps {
  permission: PermissionKey
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const isAllowed = useHasPermission(permission)

  if (isAllowed) return children
  return fallback
}
