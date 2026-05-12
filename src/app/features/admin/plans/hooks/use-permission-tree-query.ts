import { useQuery } from '@tanstack/react-query'
import type { Permission, ApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'

export interface PermissionTreeItem extends Permission {
  children?: PermissionTreeItem[]
}

export function usePermissionTreeQuery() {
  return useQuery({
    queryKey: [QUERY_KEY_ADMIN.PERMISSIONS_TREE],
    queryFn: async () => {
      const response =
        await apiClient.get<ApiResponse<PermissionTreeItem[]>>(
          '/permissions/tree'
        )
      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
