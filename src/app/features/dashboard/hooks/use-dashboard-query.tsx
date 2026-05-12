import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, DashboardData } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import { useAuthStore } from '@/stores/auth-store'
import type { Period } from '@/features/sales/overview/types/sales-overview'

interface CashBankOverviewQueryParams {
  date_from: string
  date_to: string
  period: Period
}

export function useCashBankDashboardOverviewQuery(
  params?: CashBankOverviewQueryParams
) {
  const { auth } = useAuthStore()
  return useQuery({
    queryKey: [
      QUERY_KEY.CASH_BANK,
      QUERY_KEY.DASHBOARD_CASH_BANK,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period
          ? { period: params.period === 'custom' ? 'month' : params.period }
          : {}),
      })

      const url = queryParams.toString()
        ? `/dashboard/cash-bank?${queryParams.toString()}`
        : '/dashboard/cash-bank'
      const response = await apiClient.get<ApiResponse<DashboardData>>(url)

      return response.data.data
    },
    enabled: auth.isAuthenticated,
    staleTime: 0,
    retry: 1,
  })
}

interface ExpenseOverviewQueryParams {
  date_from: string
  date_to: string
  period: Period
}

export function useExpenseOverviewQuery(params?: ExpenseOverviewQueryParams) {
  const { auth } = useAuthStore()
  return useQuery({
    queryKey: [
      QUERY_KEY.EXPENSES,
      QUERY_KEY.DASHBOARD_EXPENSE,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period
          ? { period: params.period === 'custom' ? 'month' : params.period }
          : {}),
      })

      const url = queryParams.toString()
        ? `/dashboard/expense?${queryParams.toString()}`
        : '/dashboard/expense'
      const response = await apiClient.get<ApiResponse<DashboardData>>(url)

      return response.data.data
    },
    enabled: auth.isAuthenticated,
    staleTime: 0,
    retry: 1,
  })
}

interface SalesOverviewQueryParams {
  date_from: string
  date_to: string
  period: Period
}

export function useSalesOverviewQuery(params?: SalesOverviewQueryParams) {
  const { auth } = useAuthStore()
  return useQuery({
    queryKey: [
      QUERY_KEY.SALES,
      QUERY_KEY.DASHBOARD_SALES,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period
          ? { period: params.period === 'custom' ? 'month' : params.period }
          : {}),
      })

      const url = queryParams.toString()
        ? `/dashboard/sales?${queryParams.toString()}`
        : '/dashboard/sales'
      const response = await apiClient.get<ApiResponse<DashboardData>>(url)

      return response.data.data
    },
    enabled: auth.isAuthenticated,
    staleTime: 0,
    retry: 1,
  })
}

interface UnpaidPurchaseOverviewQueryParams {
  date_from: string
  date_to: string
  period: Period
}

export function useUnpaidPurchaseOverviewQuery(
  params?: UnpaidPurchaseOverviewQueryParams
) {
  const { auth } = useAuthStore()
  return useQuery({
    queryKey: [
      QUERY_KEY.PURCHASES,
      QUERY_KEY.DASHBOARD_UNPAID_PURCHASES,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period
          ? { period: params.period === 'custom' ? 'month' : params.period }
          : {}),
      })

      const url = queryParams.toString()
        ? `/dashboard/unpaid-purchase?${queryParams.toString()}`
        : '/dashboard/unpaid-purchase'
      const response = await apiClient.get<ApiResponse<DashboardData>>(url)

      return response.data.data
    },
    enabled: auth.isAuthenticated,
    staleTime: 0,
    retry: 1,
  })
}
