import type { PaymentStatus } from '@/types'

export type Period = 'day' | 'week' | 'month' | 'year' | 'custom'

export enum Direction {
  Up = 'up',
  Down = 'down',
  Neutral = 'neutral',
}

export interface Trend {
  percentage: number
  direction: Direction
  comparison_text: string
}

export interface ChartData {
  label: string
  value: number
  value2: number
}

export interface TotalPurchases {
  value: number
  count: number
  trend: Trend
  chart_data: ChartData[]
}

export interface PaymentSent {
  value: number
  count: number
  trend: Trend
  chart_data: ChartData[]
}

export interface WaitingPayments {
  value: number
  count: number
  trend: Trend
}

export interface Overdue {
  value: number
  count: number
  trend: Trend
}

export interface PaidRatio {
  percentage: number
  description: string
}

export interface TopPurchasedProducts {
  product_id: string
  name: string
  sku: string
  total_purchase: number
  total_quantity: number
}

export interface TopVendor {
  vendor_id: string
  name: string
  total_purchase: number
}

export interface RecentUnpaid {
  id: string
  invoice_number: string
  invoice_date: Date
  due_date: Date
  vendor_name: string
  total: number
  outstanding: number
  status: PaymentStatus
}
