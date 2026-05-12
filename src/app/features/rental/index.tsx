import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UnderDevelopmentDialog } from '@/components/dialog/under-development.dialog'

export default function RentalPage() {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>Persewaan</h2>
              <p className='text-muted-foreground'>
                Kelola dan pantau seluruh transaksi persewaan Anda.
              </p>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground flex h-[400px] items-center justify-center'>
            Fitur sedang dalam pengembangan.
          </div>
        </CardContent>
      </Card>
      <UnderDevelopmentDialog
        open={open}
        onOpenChange={setOpen}
        featureName='Persewaan'
      />
    </>
  )
}
