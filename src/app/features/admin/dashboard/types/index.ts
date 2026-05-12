export interface AdminDashboardSummary {
  total_companies: number
  total_users: number
  total_active_subscriptions: number
  new_companies_this_period: number
  new_users_this_period: number
}

export interface SubscriptionByPlan {
  plan_name: string
  plan_id: string
  company_count: number
  percentage: number
}

export interface AdminDashboardChartData {
  label: string
  new_companies: number
  new_users: number
  new_subscriptions: number
}

export interface AdminDashboardData {
  summary: AdminDashboardSummary
  subscription_by_plan: SubscriptionByPlan[]
  chart_data: AdminDashboardChartData[]
}

export interface AdminDashboardResponse {
  status: string
  code: number
  message: string
  data: AdminDashboardData
}

export type AdminDashboardPeriod = 'month' | 'year'
