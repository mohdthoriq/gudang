import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AdminDashboardPeriod } from '../types'

interface AdminDashboardCardActionProps {
  period: AdminDashboardPeriod
  year: number
  month?: number
  onChange: (updates: {
    period?: AdminDashboardPeriod
    year?: number
    month?: number
  }) => void
}

export function AdminDashboardCardAction({
  period,
  year,
  month,
  onChange,
}: AdminDashboardCardActionProps) {
  const currentYear = new Date().getFullYear()

  // Generate last 6 months relative to today
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    return {
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      label: new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
      }).format(d),
    }
  })

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const activeLabel =
    period === 'month'
      ? month && month !== 0
        ? last6Months.find((m) => m.month === month && m.year === year)?.label ||
          `Bulan ${month}, ${year}`
        : '6 Bulan Terakhir'
      : `Tahun ${year}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='text-muted-foreground hover:text-foreground h-8 w-8 print:hidden'
        >
          <MoreVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <div className='px-2 py-1.5 text-xs font-semibold text-muted-foreground'>
          Filter Aktif: {activeLabel}
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onChange({ period: 'month', month: 0, year: currentYear })}
          className={cn(period === 'month' && (!month || month === 0) && 'bg-accent text-accent-foreground')}
        >
          6 Bulan Terakhir
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Pilih Bulan</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className='w-48'>
            {last6Months.map((m) => (
              <DropdownMenuItem
                key={`${m.month}-${m.year}`}
                onClick={() =>
                  onChange({ period: 'month', month: m.month, year: m.year })
                }
                className={cn(
                  period === 'month' &&
                    month === m.month &&
                    year === m.year &&
                    'bg-accent text-accent-foreground'
                )}
              >
                {m.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Pilih Tahun</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className='w-40'>
            {yearOptions.map((y) => (
              <DropdownMenuItem
                key={y}
                onClick={() => onChange({ period: 'year', year: y })}
                className={cn(
                  period === 'year' && year === y && 'bg-accent text-accent-foreground'
                )}
              >
                Tahun {y}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
