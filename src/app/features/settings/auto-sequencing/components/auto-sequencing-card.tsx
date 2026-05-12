import type { FinanceNumber } from '@/types/domain/auto-numbering'
import { Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AutoSequencingCardProps {
  item: FinanceNumber
  onClick: (item: FinanceNumber) => void
}

export function AutoSequencingCard({ item, onClick }: AutoSequencingCardProps) {
  return (
    <Card
      className='group hover:bg-muted/50 hover:border-primary relative cursor-pointer transition-colors'
      onClick={() => onClick(item)}
    >
      <div className='absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100'>
        <Pencil className='text-muted-foreground h-6 w-6' />
      </div>
      <CardContent className='flex flex-col items-start justify-center gap-2'>
        <h3 className='text-muted-foreground text-sm font-semibold'>
          {item.title}
        </h3>
        <p className='text-2xl font-bold'>{item.format}</p>
      </CardContent>
    </Card>
  )
}
