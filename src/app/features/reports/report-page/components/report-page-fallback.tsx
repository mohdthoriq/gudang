import { Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { reportData } from '../data/report-data'
import { ReportItem } from './report-items'

export function ReportPageFallback() {
  return (
    <div className='relative'>
      <div className='pointer-events-none flex flex-col space-y-8 opacity-100 blur-[2px]'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Laporan</h1>
        </div>

        <div className='flex justify-end'>
          <div className='relative w-full max-w-xs'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input placeholder='Cari' className='pl-9' disabled />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {reportData?.map((category) => (
            <div key={category.category} className='flex flex-col space-y-4'>
              <h2 className='text-foreground/90 text-sm font-semibold'>
                {category.category}
              </h2>
              <Card className='bg-card text-card-foreground p-0'>
                <div className='divide-border divide-y'>
                  {category.reports.map((report) => (
                    <ReportItem key={report.url} report={report} />
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <UpgradePlanCard feature='Laporan' />
    </div>
  )
}
