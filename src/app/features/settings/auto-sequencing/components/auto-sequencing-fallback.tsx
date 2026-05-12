import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'

export function AutoSequencingFallback() {
  const dummyGroups = [
    {
      id: 1,
      title: 'Sales',
      finance_numbers: [
        { id: 1, title: 'Invoice', format: 'INV/2024/0001' },
        { id: 2, title: 'Sales Order', format: 'SO/2024/0001' },
      ],
    },
    {
      id: 2,
      title: 'Purchase',
      finance_numbers: [
        { id: 3, title: 'Purchase Order', format: 'PO/2024/0001' },
      ],
    },
  ]

  return (
    <div className='relative w-full overflow-hidden'>
      <div className='pointer-events-none opacity-100 blur-[2px]'>
        <div className='flex w-full flex-col gap-4 p-4 px-6'>
          <div className='flex w-full items-center justify-between'>
            <h1 className='text-3xl font-bold tracking-wide'>
              Penomoran Otomatis
            </h1>
            <Button variant='link'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Kembali
            </Button>
          </div>
          <p className='text-md text-muted-foreground font-medium'>
            Tentukan nomor yang akan digunakan saat membuat faktur atau pesanan
            pembelian. Nomor tersebut akan <br /> secara otomatis bertambah
            setiap kali Anda membuat dokumen baru.
          </p>
          <div>
            <div className='flex w-full flex-col gap-8'>
              <div className='flex w-full items-center justify-end'>
                <div className='mt-3 w-[300px]'>
                  <Input placeholder='Search' disabled />
                </div>
              </div>

              <div className='flex flex-col gap-10'>
                {dummyGroups.map((group) => (
                  <div key={group.id} className='flex flex-col gap-4'>
                    <h2 className='text-md font-semibold tracking-tight'>
                      {group.title}
                    </h2>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                      {group.finance_numbers.map((item) => (
                        <div
                          key={item.id}
                          className='border-muted bg-card relative rounded-lg border p-6'
                        >
                          <h3 className='text-muted-foreground text-sm font-semibold'>
                            {item.title}
                          </h3>
                          <p className='text-2xl font-bold'>{item.format}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpgradePlanCard feature='Penomoran Otomatis' />
    </div>
  )
}
