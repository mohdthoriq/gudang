import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { UnderDevelopmentDialog } from '@/components/dialog/under-development.dialog'
import type { Report } from '../types/report-data.types'

export function ReportItem({
  report,
  isFavorite,
  toggleFavorite,
}: {
  report: Report
  isFavorite?: boolean
  toggleFavorite?: (id: number) => void
}) {
  const [underDevDialog, setUnderDevDialog] = useState<{
    open: boolean
    featureName?: string
  }>({ open: false })

  return (
    <div
      key={report.id}
      className='group hover:bg-muted/80 hover:border-primary flex items-center rounded-lg p-2 transition-colors hover:border'
    >
      <div className='p-4 pr-0'>
        <button
          onClick={() => toggleFavorite?.(report.id)}
          className='focus:outline-none'
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              isFavorite ? 'fill-primary text-primary' : 'text-primary'
            }`}
          />
        </button>
      </div>
      {report.url ? (
        <Link
          to={report.url}
          className='text-primary flex-1 p-4 pl-4 group-hover:underline'
        >
          <span className='font-medium'>{report.name}</span>
        </Link>
      ) : (
        <div
          className='text-primary flex-1 cursor-pointer p-4 pl-4 group-hover:underline'
          onClick={() =>
            setUnderDevDialog({ open: true, featureName: report.name })
          }
        >
          <span className='font-medium'>{report.name}</span>
        </div>
      )}
      <UnderDevelopmentDialog
        open={underDevDialog.open}
        onOpenChange={(open) =>
          setUnderDevDialog((prev) => ({ ...prev, open }))
        }
        featureName={underDevDialog.featureName}
      />
    </div>
  )
}
