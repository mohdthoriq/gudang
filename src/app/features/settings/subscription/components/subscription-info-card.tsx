import type { Subscription } from '@/types';
import { CalendarDays, Building2, User, CreditCard, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SubscriptionStatusBadge } from './subscription-status-badge';


interface SubscriptionInfoCardProps {
  subscription: Subscription
  companyName?: string
  userName?: string
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'Selamanya'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getDaysRemaining(endDate: Date | string | null | undefined): number {
  if (!endDate) return 0
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function getSubscriptionProgress(
  startDate: Date | string,
  endDate: Date | string | null | undefined
): number {
  if (!endDate) return 100
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = Date.now()
  const total = end - start
  const elapsed = now - start
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

export function SubscriptionInfoCard({
  subscription,
  companyName,
  userName,
}: SubscriptionInfoCardProps) {
  const daysRemaining = getDaysRemaining(subscription.end_date)
  const progress = getSubscriptionProgress(
    subscription.start_date,
    subscription.end_date
  )

  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
              <CreditCard className='text-primary h-5 w-5' />
            </div>
            <div>
              <h3 className='text-lg font-semibold'>
                {subscription.plan_name}
              </h3>
              <p className='text-muted-foreground text-sm'>
                Paket langganan aktif Anda
              </p>
            </div>
          </div>
          <SubscriptionStatusBadge status={subscription.status} />
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Masa Berlaku Progress */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              Masa berlaku
            </span>
            <span className='font-medium'>
              {!subscription.end_date
                ? 'Aktif selamanya'
                : daysRemaining > 0
                  ? `${daysRemaining} hari tersisa`
                  : 'Telah berakhir'}
            </span>
          </div>
          <div className='bg-secondary h-2 w-full overflow-hidden rounded-full'>
            <div
              className='bg-primary h-full rounded-full transition-all duration-500'
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className='text-muted-foreground flex justify-between text-xs'>
            <span>{formatDate(subscription.start_date)}</span>
            <span>{formatDate(subscription.end_date)}</span>
          </div>
        </div>

        <Separator />

        {/* Detail Info Grid */}
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='flex items-start gap-3'>
            <CalendarDays className='text-muted-foreground mt-0.5 h-4 w-4' />
            <div>
              <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                Tanggal Mulai
              </p>
              <p className='text-sm font-medium'>
                {formatDate(subscription.start_date)}
              </p>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <CalendarDays className='text-muted-foreground mt-0.5 h-4 w-4' />
            <div>
              <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                Tanggal Berakhir
              </p>
              <p className='text-sm font-medium'>
                {formatDate(subscription.end_date)}
              </p>
            </div>
          </div>

          {companyName && (
            <div className='flex items-start gap-3'>
              <Building2 className='text-muted-foreground mt-0.5 h-4 w-4' />
              <div>
                <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                  Perusahaan
                </p>
                <p className='text-sm font-medium'>{companyName}</p>
              </div>
            </div>
          )}

          {userName && (
            <div className='flex items-start gap-3'>
              <User className='text-muted-foreground mt-0.5 h-4 w-4' />
              <div>
                <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                  Pengguna
                </p>
                <p className='text-sm font-medium'>{userName}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}