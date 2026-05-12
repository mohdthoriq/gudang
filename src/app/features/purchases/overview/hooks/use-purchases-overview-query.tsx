import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@/types';
import apiClient from '@/lib/api-client';
import { QUERY_KEY } from '@/constants/query-key';
import type { Overdue, PaidRatio, PaymentSent, Period, RecentUnpaid, TopPurchasedProducts, TopVendor, TotalPurchases, WaitingPayments } from '../types/purchases-overview';


interface OverdueQueryParams {
  date_from: string
  date_to: string
  period: Period
}

export function useOverdueQuery(params?: OverdueQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.PURCHASES,
      QUERY_KEY.PURCHASES_OVERVIEW,
      QUERY_KEY.PURCHASES_OVERDUE,
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
        ? `/purchase-overview/overdue?${queryParams.toString()}`
        : '/purchase-overview/overdue'
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
  period: Period
}

export function usePaidRatioQuery(params?: PaidRatioQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.PURCHASES,
      QUERY_KEY.PURCHASES_OVERVIEW,
      QUERY_KEY.PURCHASES_PAID_RATIO,
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
        ? `/purchase-overview/paid-ratio?${queryParams.toString()}`
        : '/purchase-overview/paid-ratio'
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
  period: Period
}

export function useRecentUnpaidQuery(params?: RecentUnpaidQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.PURCHASES,
      QUERY_KEY.PURCHASES_OVERVIEW,
      QUERY_KEY.PURCHASES_RECENT_UNPAID,
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

interface TopProductsQueryParams {
  date_from: string
  date_to: string
  period: Period
}

export function useTopProductsQuery(params?: TopProductsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.PURCHASES,
      QUERY_KEY.PURCHASES_OVERVIEW,
      QUERY_KEY.PURCHASES_TOP_PRODUCTS,
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
        ? `/purchase-overview/top-products?${queryParams.toString()}`
        : '/purchase-overview/top-products'
      const response =
        await apiClient.get<ApiResponse<TopPurchasedProducts>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}

interface TopVendorQueryParams {
  date_from: string
  date_to: string
  period: Period
}

export function useTopVendorQuery(params?: TopVendorQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.PURCHASES,
      QUERY_KEY.PURCHASES_OVERVIEW,
      QUERY_KEY.PURCHASES_TOP_VENDORS,
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
        ? `/purchase-overview/top-vendors?${queryParams.toString()}`
        : '/purchase-overview/top-vendors'
      const response = await apiClient.get<ApiResponse<TopVendor>>(url)

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
      QUERY_KEY.PURCHASES,
      QUERY_KEY.PURCHASES_OVERVIEW,
      QUERY_KEY.PURCHASES_TOTAL_PAYMENTS,
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
        ? `/purchase-overview/payment-sent?${queryParams.toString()}`
        : '/purchase-overview/payment-sent'
      const response = await apiClient.get<ApiResponse<PaymentSent>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}

interface TotalPurchasesQueryParams {
  date_from: string
  date_to: string
  period: Period
}

export function useTotalPurchasesQuery(params?: TotalPurchasesQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.PURCHASES,
      QUERY_KEY.PURCHASES_OVERVIEW,
      QUERY_KEY.PURCHASES_TOTAL,
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
        ? `/purchase-overview/total-purchases?${queryParams.toString()}`
        : '/purchase-overview/total-purchases'
      const response = await apiClient.get<ApiResponse<TotalPurchases>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}

interface WaitingPaymentsQueryParams {
  date_from: string
  date_to: string
  period: Period
}

export function useWaitingPaymentsQuery(params?: WaitingPaymentsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.PURCHASES,
      QUERY_KEY.PURCHASES_OVERVIEW,
      QUERY_KEY.PURCHASES_WAITING_PAYMENTS,
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
        ? `/purchase-overview/waiting-payment?${queryParams.toString()}`
        : '/purchase-overview/waiting-payment'
      const response = await apiClient.get<ApiResponse<WaitingPayments>>(url)

      return response.data.data
    },
    staleTime: 0,
    retry: 1,
  })
}