import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'
import type { AdminDashboardResponse, AdminDashboardPeriod } from '../types'

export interface AdminDashboardQueryParams {
  period?: AdminDashboardPeriod
  year?: number
  month?: number
}

export function useAdminDashboardQuery(params?: AdminDashboardQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY_ADMIN.DASHBOARD,
      params?.period,
      params?.year,
      params?.month,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (params?.period) queryParams.append('period', params.period)
      if (params?.year) queryParams.append('year', params.year.toString())
      if (params?.month && params.month > 0) queryParams.append('month', params.month.toString())

      const url = queryParams.toString()
        ? `/admin/dashboard?${queryParams.toString()}`
        : '/admin/dashboard'
      
      const response = await apiClient.get<AdminDashboardResponse>(url)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
