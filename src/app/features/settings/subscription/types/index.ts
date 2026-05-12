import type { Subscription, Plan, Company, User } from '@/types';


export interface SubscriptionData {
  subscription: Subscription | undefined
  plan: Plan | undefined
  company: Company | undefined
  user: User | undefined
  isEmpty: boolean
}

export type PricingPeriod = 'monthly' | 'yearly'

export interface PricingFeature {
  text: string
  included: boolean
}

export interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  isPopular?: boolean
  buttonText?: string
  isDefault?: boolean
}