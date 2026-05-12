import { useQuery } from '@tanstack/react-query'
import type { ApiResponse } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import type {
  Overdue,
  PaidRatio,
  PaymentReceived,
  Period,
  RecentUnpaid,
  TopCustomer,
  TopSellingProducts,
  TotalSales,
  WaitingPayments,
} from '../types/sales-overview'

interface OverdueQueryParams {
  date_from: string
  date_to: string
  period: 'day' | 'week' | 'month' | 'year'
}

export function useOverdueQuery(params?: OverdueQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.SALES,
      QUERY_KEY.SALES_OVERVIEW,
      QUERY_KEY.SALES_OVERDUE,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period ? { period: params.period } : {}),
      })

      const url = queryParams.toString()
        ? `/sales-overview/overdue?${queryParams.toString()}`
        : '/sales-overview/overdue'
      const response = await apiClient.get<ApiResponse<Overdue>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}

interface PaidRatioQueryParams {
  date_from: string
  date_to: string
  period: 'day' | 'week' | 'month' | 'year'
}

export function usePaidRatioQuery(params?: PaidRatioQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.SALES,
      QUERY_KEY.SALES_OVERVIEW,
      QUERY_KEY.SALES_PAID_RATIO,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period ? { period: params.period } : {}),
      })

      const url = queryParams.toString()
        ? `/sales-overview/paid-ratio?${queryParams.toString()}`
        : '/sales-overview/paid-ratio'
      const response = await apiClient.get<ApiResponse<PaidRatio>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}

interface RecentUnpaidQueryParams {
  date_from: string
  date_to: string
  period: 'day' | 'week' | 'month' | 'year'
}

export function useRecentUnpaidQuery(params?: RecentUnpaidQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.SALES,
      QUERY_KEY.SALES_OVERVIEW,
      QUERY_KEY.SALES_RECENT_UNPAID,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period ? { period: params.period } : {}),
      })

      const url = queryParams.toString()
        ? `/sales-overview/recent-unpaid?${queryParams.toString()}`
        : '/sales-overview/recent-unpaid'
      const response = await apiClient.get<ApiResponse<RecentUnpaid>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}

interface TopCustomerQueryParams {
  date_from: string
  date_to: string
  period: 'day' | 'week' | 'month' | 'year'
}

export function useTopCustomerQuery(params?: TopCustomerQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.SALES,
      QUERY_KEY.SALES_OVERVIEW,
      QUERY_KEY.SALES_TOP_CUSTOMERS,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period ? { period: params.period } : {}),
      })

      const url = queryParams.toString()
        ? `/sales-overview/top-customers?${queryParams.toString()}`
        : '/sales-overview/top-customers'
      const response = await apiClient.get<ApiResponse<TopCustomer>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}

interface TopProductsQueryParams {
  date_from: string
  date_to: string
  period: 'day' | 'week' | 'month' | 'year'
}

export function useTopProductsQuery(params?: TopProductsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.SALES,
      QUERY_KEY.SALES_OVERVIEW,
      QUERY_KEY.SALES_TOP_PRODUCTS,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period ? { period: params.period } : {}),
      })

      const url = queryParams.toString()
        ? `/sales-overview/top-products?${queryParams.toString()}`
        : '/sales-overview/top-products'
      const response = await apiClient.get<ApiResponse<TopSellingProducts>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}

interface TotalPaymentsQueryParams {
  date_from: string
  date_to: string
  period: Period
}

export function useTotalPaymentsQuery(params?: TotalPaymentsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.SALES,
      QUERY_KEY.SALES_OVERVIEW,
      QUERY_KEY.SALES_TOTAL_PAYMENTS,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period ? { period: params.period } : {}),
      })

      const url = queryParams.toString()
        ? `/sales-overview/payment-received?${queryParams.toString()}`
        : '/sales-overview/payment-received'
      const response = await apiClient.get<ApiResponse<PaymentReceived>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}

interface TotalSalesQueryParams {
  date_from: string
  date_to: string
  period: 'day' | 'week' | 'month' | 'year'
}

export function useTotalSalesQuery(params?: TotalSalesQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.SALES,
      QUERY_KEY.SALES_OVERVIEW,
      QUERY_KEY.SALES_TOTAL,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period ? { period: params.period } : {}),
      })

      const url = queryParams.toString()
        ? `/sales-overview/total-sales?${queryParams.toString()}`
        : '/sales-overview/total-sales'
      const response = await apiClient.get<ApiResponse<TotalSales>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}

interface WaitingPaymentsQueryParams {
  date_from: string
  date_to: string
  period: 'day' | 'week' | 'month' | 'year'
}

export function useWaitingPaymentsQuery(params?: WaitingPaymentsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.SALES,
      QUERY_KEY.SALES_OVERVIEW,
      QUERY_KEY.SALES_WAITING_PAYMENTS,
      params?.date_from,
      params?.date_to,
      params?.period,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period ? { period: params.period } : {}),
      })

      const url = queryParams.toString()
        ? `/sales-overview/waiting-payment?${queryParams.toString()}`
        : '/sales-overview/waiting-payment'
      const response = await apiClient.get<ApiResponse<WaitingPayments>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}
