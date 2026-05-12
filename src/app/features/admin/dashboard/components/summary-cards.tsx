import { Building2, Users, CreditCard, UserPlus, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminDashboardSummary } from '../types'

interface SummaryCardsProps {
  summary: AdminDashboardSummary | undefined
  isLoading: boolean
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Perusahaan',
      value: summary?.total_companies ?? 0,
      icon: Building2,
      description: 'Total perusahaan terdaftar',
    },
    {
      title: 'Total Pengguna',
      value: summary?.total_users ?? 0,
      icon: Users,
      description: 'Total pengguna dalam sistem',
    },
    {
      title: 'Langganan Aktif',
      value: summary?.total_active_subscriptions ?? 0,
      icon: CreditCard,
      description: 'Perusahaan dengan langganan aktif',
    },
    {
      title: 'Perusahaan Baru',
      value: summary?.new_companies_this_period ?? 0,
      icon: TrendingUp,
      description: 'Periode ini',
    },
    {
      title: 'Pengguna Baru',
      value: summary?.new_users_this_period ?? 0,
      icon: UserPlus,
      description: 'Periode ini',
    },
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {card.title}
            </CardTitle>
            <card.icon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-8 w-16 animate-pulse rounded bg-muted' />
            ) : (
              <>
                <div className='text-2xl font-bold'>{card.value}</div>
                <p className='text-xs text-muted-foreground'>
                  {card.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
