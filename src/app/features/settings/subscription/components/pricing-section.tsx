import { useState } from 'react'
import type { Plan } from '@/types'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { PricingPeriod, PricingPlan } from '../types'
import { PricingCard } from './pricing-card'

interface PricingSectionProps {
  currentPlanName?: string
  plans: Plan[]
  isLoading: boolean
}

export function PricingSection({
  currentPlanName,
  plans,
  isLoading,
}: PricingSectionProps) {
  const [period, setPeriod] = useState<PricingPeriod>('monthly')

  const handleSelectPlan = (plan: Plan) => {
    const message = encodeURIComponent(
      `Halo, saya tertarik untuk berlangganan ${plan.name} dengan periode ${
        period === 'monthly' ? 'Bulanan' : 'Tahunan'
      }. Mohon bantuannya.`
    )
    window.open(`https://wa.me/6281549639868?text=${message}`, '_blank')
  }

  return (
    <div className='mt-8 space-y-6'>
      <div className='flex flex-col items-center justify-center space-y-4 text-center'>
        <h3 className='text-2xl font-bold tracking-tight'>
          Pilih Paket Terbaik untuk Bisnis Anda
        </h3>
        <p className='text-muted-foreground max-w-lg text-sm'>
          Upgrade layanan Anda untuk mendapatkan fitur lebih lengkap dan
          dukungan prioritas.
        </p>
      </div>

      <div className='flex items-center justify-center space-x-4'>
        <Label
          htmlFor='pricing-period'
          className={`cursor-pointer ${
            period === 'monthly'
              ? 'text-foreground font-semibold'
              : 'text-muted-foreground'
          }`}
        >
          Bulanan
        </Label>
        <Switch
          id='pricing-period'
          checked={period === 'yearly'}
          onCheckedChange={(checked) =>
            setPeriod(checked ? 'yearly' : 'monthly')
          }
        />
        <Label
          htmlFor='pricing-period'
          className={`cursor-pointer ${
            period === 'yearly'
              ? 'text-foreground font-semibold'
              : 'text-muted-foreground'
          }`}
        >
          Tahunan
        </Label>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:gap-8'>
          {plans
            .sort((a, b) => a.monthly_price - b.monthly_price)
            .map((plan) => {
              // Map API Plan to PricingPlan UI structure on the fly
              const pricingPlan: PricingPlan = {
                id: plan.id,
                name: plan.name,
                description: plan.description,
                monthlyPrice: plan.monthly_price,
                yearlyPrice: plan.yearly_price,
                features: plan.features,
                // Auto-detect popular plan? Or just basic logic
                isPopular: plan.monthly_price > 0 && plan.monthly_price < 100000,
                buttonText: `Pilih ${plan.name}`,
                isDefault: plan.code === 'default-plan',
              }

              return (
                <PricingCard
                  key={plan.id}
                  plan={pricingPlan}
                  period={period}
                  isCurrentPlan={plan.name === currentPlanName}
                  onSelect={() => handleSelectPlan(plan)}
                  isDefault={pricingPlan.isDefault}
                />
              )
            })}
        </div>
      )}

      <div className='bg-muted/50 text-muted-foreground mt-8 rounded-lg border p-4 text-center text-sm'>
        <p>
          Butuh bantuan memilih paket? Hubungi tim support kami di{' '}
          <a
            href='https://wa.me/6281549639868'
            target='_blank'
            rel='noreferrer'
            className='text-primary font-medium hover:underline'
          >
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}
