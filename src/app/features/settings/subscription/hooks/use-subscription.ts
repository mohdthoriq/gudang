import { useAuthStore } from '@/stores/auth-store'
import type { SubscriptionData } from '../types'

export function useSubscription(): SubscriptionData {
  const userAuth = useAuthStore((state) => state.auth.user)
  const subscription = userAuth?.subscription
  const plan = subscription?.plan

  return {
    subscription,
    plan,
    company: userAuth?.company,
    user: userAuth?.user,
    isEmpty: !subscription,
  }
}
