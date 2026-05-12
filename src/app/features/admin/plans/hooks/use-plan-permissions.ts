import type { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiResponse } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'

interface PlanPermissionResponse {
  id: string
  permission_id: string
}

export function usePlanPermissionsQuery(planId: string) {
  return useQuery({
    queryKey: [QUERY_KEY_ADMIN.PLAN_PERMISSIONS, planId],
    queryFn: async () => {
      const response = await apiClient.get<
        ApiResponse<PlanPermissionResponse[]>
      >(`subscriptions/plans/${planId}/permissions`)
      return response.data.data ?? []
    },
    select: (data) => data.map((item) => item.permission_id),
    enabled: !!planId,
  })
}

export function useUpdatePlanPermissionsMutation(planId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (permissionIds: string[]) => {
      const response = await apiClient.post(
        `subscriptions/plans/${planId}/permissions`,
        {
          permission_ids: permissionIds,
        }
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Updating permissions...', { id: 'plan-permissions-toast' })
    },
    onSuccess: () => {
      toast.dismiss('plan-permissions-toast')
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PLAN_PERMISSIONS, planId],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PLANS],
      })
      toast.success('Permissions berhasil diubah.')
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.dismiss('plan-permissions-toast')
      toast.error(
        error.response?.data?.message || 'Failed to update permissions.'
      )
    },
  })
}
