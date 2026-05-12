import { useState } from 'react'
import { Search } from 'lucide-react'
import { useReportsStore } from '@/stores/reports-store'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PermissionGuard } from '@/components/permission-guard'
import { ReportItem } from './components/report-items'
import { ReportPageFallback } from './components/report-page-fallback'
import { reportData } from './data/report-data'

function ReportContents() {
  const [searchQuery, setSearchQuery] = useState('')
  const { favorites, toggleFavorite } = useReportsStore()

  const filteredData = reportData
    ?.map((cat) => ({
      ...cat,
      reports: cat.reports.filter((report) =>
        report.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    ?.filter((cat) => cat.reports.length > 0)

  const favoriteReports = reportData
    ?.flatMap((cat) => cat.reports)
    .filter((report) => favorites.includes(report.id))

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.REPORTS}
      fallback={<ReportPageFallback />}
    >
      <div className='flex flex-col space-y-6'>
        <div className='flex items-center justify-between p-2'>
          <h1 className='text-2xl font-semibold'>Laporan</h1>
        </div>

        {favoriteReports && favoriteReports.length > 0 && (
          <div className='flex flex-col space-y-4'>
            <h2 className='text-foreground/90 text-sm font-semibold'>
              Favorit
            </h2>
            <Card className='bg-card text-card-foreground p-0'>
              <div className='divide-border divide-y'>
                {favoriteReports.map((report, index) => (
                  <ReportItem
                    key={`${report.id}-${index}`}
                    report={report}
                    isFavorite={true}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        <div className='flex justify-end'>
          <div className='relative w-full max-w-xs'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Cari'
              className='pl-9'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className='mb-10 grid grid-cols-1 gap-8 md:grid-cols-2'>
          {filteredData?.map((category, index) => (
            <div
              key={`${category.id}-${index}`}
              className='flex flex-col space-y-4'
            >
              <h2 className='text-foreground/90 text-sm font-semibold'>
                {category.category}
              </h2>
              <Card className='bg-card text-card-foreground p-0'>
                <div className='divide-border divide-y'>
                  {category.reports.map((report, index) => (
                    <ReportItem
                      key={`${report.id}-${index}`}
                      report={report}
                      isFavorite={favorites.includes(report.id)}
                      toggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </PermissionGuard>
  )
}

export function Reports() {
  return <ReportContents />
}
