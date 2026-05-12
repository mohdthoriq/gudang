import { CheckCircle2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Plan } from '@/types'

interface PlanDetailsCardProps {
  plan: Plan
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function PlanDetailsCard({ plan }: PlanDetailsCardProps) {
  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10'>
            <Sparkles className='h-5 w-5 text-amber-500' />
          </div>
          <div>
            <h3 className='text-lg font-semibold'>Detail Paket</h3>
            <p className='text-muted-foreground text-sm'>
              Informasi lengkap tentang paket Anda
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Deskripsi */}
        {plan.description && (
          <>
            <div className='space-y-2'>
              <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                Deskripsi
              </p>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {plan.description}
              </p>
            </div>
            <Separator />
          </>
        )}

        {/* Fitur */}
        {plan.features && plan.features.length > 0 && (
          <>
            <div className='space-y-3'>
              <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                Fitur yang tersedia
              </p>
              <ul className='grid gap-2.5 sm:grid-cols-2'>
                {plan.features.map((feature, index) => (
                  <li key={index} className='flex items-center gap-2.5'>
                    <div className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10'>
                      <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
                    </div>
                    <span className='text-sm'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
          </>
        )}

        {/* Harga */}
        <div className='space-y-3'>
          <p className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
            Harga
          </p>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='bg-muted/50 rounded-lg border p-4'>
              <p className='text-muted-foreground mb-1 text-xs font-medium'>
                Bulanan
              </p>
              <p className='text-xl font-bold'>
                {formatCurrency(plan.monthly_price)}
              </p>
              <p className='text-muted-foreground text-xs'>/bulan</p>
            </div>
            <div className='bg-primary/5 border-primary/20 rounded-lg border p-4'>
              <div className='mb-1 flex items-center gap-2'>
                <p className='text-muted-foreground text-xs font-medium'>
                  Tahunan
                </p>
                {/* {plan.yearly_price < plan.monthly_price * 12 && (
                  <span className='rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600'>
                    Hemat{' '}
                    {Math.round(
                      ((plan.monthly_price * 12 - plan.yearly_price) /
                        (plan.monthly_price * 12)) *
                        100
                    )}
                    %
                  </span>
                )} */}
              </div>
              <p className='text-xl font-bold'>
                {formatCurrency(plan.yearly_price)}
              </p>
              <p className='text-muted-foreground text-xs'>/tahun</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
