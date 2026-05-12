import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { ArrowLeft, CalendarIcon, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { SalesPerCategoriesTable } from './sales-per-categories-table'
import { cn } from '@/lib/utils'

const route = getRouteApi('/_authenticated/reports/sales-per-categories/')

export function SalesPerCategoriesFallback() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()

  return (
    <Card className='relative'>
      <CardHeader className='pointer-events-none opacity-100 blur-[2px]'>
        <div className='flex justify-between'>
          <div className='mb-2 grid'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Laporan Penjualan per Kategori Produk
            </h2>
            <p className='text-muted-foreground'>
              Laporan Penjualan per Kategori Produk di Perusahaan Anda.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Printer className='h-4 w-4' />
                  {'Cetak'}
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
            <Button variant={'outline'}>
              <ArrowLeft className='h-4 w-4' />
              Kembali
            </Button>
          </div>
        </div>
        <hr />
      </CardHeader>
      <CardContent className='pointer-events-none flex flex-col gap-4 opacity-100 blur-[2px]'>
        <div className='flex items-center justify-end gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[280px] justify-between border-slate-200 p-3 text-left font-normal transition-colors hover:border-slate-400 hover:bg-slate-50/50'
                )}
              >
                <div className='flex items-center gap-2'>
                  <span>{format(new Date(), 'dd/MM/yyyy')}</span>
                  <span className='text-muted-foreground'>→</span>
                  <span>{format(new Date(), 'dd/MM/yyyy')}</span>
                </div>
                <CalendarIcon className='h-4 w-4 text-slate-400' />
              </Button>
            </PopoverTrigger>
          </Popover>
        </div>
        <SalesPerCategoriesTable search={search} navigate={navigate} />
      </CardContent>
      <UpgradePlanCard feature='Laporan Penjualan per Kategori Produk' />
    </Card>
  )
}
