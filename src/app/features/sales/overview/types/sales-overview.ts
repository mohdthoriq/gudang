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

export interface TotalSales {
  value: number
  count: number
  trend: Trend
  chart_data: ChartData[]
}

export interface PaymentReceived {
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

export interface TopSellingProducts {
  product_id: string
  name: string
  sku: string
  total_sales: number
  total_quantity: number
}

export interface TopCustomer {
  customer_id: string
  name: string
  total_sales: number
}

export interface RecentUnpaid {
  id: string
  invoice_number: string
  invoice_date: Date
  due_date: Date
  customer_name: string
  total: number
  outstanding: number
  status: PaymentStatus
}
