import { Badge } from '@/components/ui/badge'

interface SubscriptionStatusBadgeProps {
  status?: string
}

const statusConfig: Record<
  string,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    className?: string
  }
> = {
  active: {
    label: 'Aktif',
    variant: 'default',
    className: 'bg-emerald-600 hover:bg-emerald-600/90',
  },
  expired: {
    label: 'Kadaluarsa',
    variant: 'destructive',
  },
  cancelled: {
    label: 'Dibatalkan',
    variant: 'secondary',
    className: 'bg-amber-500 text-white hover:bg-amber-500/90',
  },
  pending: {
    label: 'Menunggu',
    variant: 'outline',
  },
}

export function SubscriptionStatusBadge({
  status,
}: SubscriptionStatusBadgeProps) {
  const config = statusConfig[status || ''] || {
    label: status || 'Tidak Diketahui',
    variant: 'outline' as const,
  }

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
