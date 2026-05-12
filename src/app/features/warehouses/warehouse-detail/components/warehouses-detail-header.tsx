import { ArrowLeft, Edit } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import type { Warehouse } from '@/types'
import { CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { WarehousesDialogs } from '../../warehouse-list/components/warehouses-dialogs'
import { useWarehouses } from '../../warehouse-list/components/warehouses-provider'
// import { WarehousesProvider } from '../warehouse-list/components/warehouses-provider'

type WarehousesDetailHeaderProps = {
  warehouse: Warehouse | undefined
  isLoading?: boolean
}

export function WarehousesDetailHeader({ warehouse, isLoading }: WarehousesDetailHeaderProps) {
  const navigate = useNavigate()
  const { setOpen, setCurrentRow } = useWarehouses()

  return (
    <>
      <CardHeader className='py-3'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-end gap-2'>
            <h1 className='text-xl font-semibold'>
              {isLoading ? <Skeleton className='w-[200px] h-[20px]' /> : `${warehouse?.name.toUpperCase()} - ${warehouse?.code}`}
            </h1>
          </div>

          <div className='mr-4 flex flex-wrap items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => navigate({ to: '/warehouses' })}
              className='h-8 gap-2 px-3 text-xs'
            >
              <ArrowLeft className='h-3.5 w-3.5' /> Kembali
            </Button>
            <Button
              onClick={() => {
                setCurrentRow(warehouse!)
                setOpen('edit')
              }}
              size='sm'
              className='h-8 bg-blue-600 hover:bg-blue-700'
            >
              <Edit className='mr-2 h-4 w-4' /> Edit Gudang
            </Button>
          </div>
        </div>
      </CardHeader>
      <WarehousesDialogs />
    </>
  )
}
