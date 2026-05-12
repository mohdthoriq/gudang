import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { FinanceNumber } from '@/types/domain/auto-numbering'
import { ArrowLeft } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PermissionGuard } from '@/components/permission-guard'
import { AutoSequencingCard } from './components/auto-sequencing-card'
import { AutoSequencingFallback } from './components/auto-sequencing-fallback'
import { AutoSequencingModal } from './components/auto-sequencing-modal'
import { useAutoNumberingQuery } from './hooks/use-auto-numbering-query'

export function AutoSequencing() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<FinanceNumber | null>(null)
  const navigate = useNavigate()

  const { data: autoNumberingData, isLoading } = useAutoNumberingQuery()

  const groupedData = autoNumberingData?.data.data || []

  const filteredGroupedData = groupedData
    .map((group) => ({
      ...group,
      finance_numbers: group.finance_numbers.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.finance_numbers.length > 0)

  const codes = autoNumberingData?.data.finance_number_codes || []

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SETTINGS_AUTO_SEQUENCING_VIEW}
      fallback={<AutoSequencingFallback />}
    >
      <div className='w-full'>
        <div className='flex w-full flex-col gap-4 p-4 px-6'>
          <div className='flex w-full items-center justify-between'>
            <h1 className='text-3xl font-bold tracking-wide'>
              Penomoran Otomatis
            </h1>
            <Button
              variant='link'
              onClick={() =>
                navigate({ to: '/settings', search: { tab: 'business_flow' } })
              }
            >
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
                  <Input
                    placeholder='Search'
                    // startAdornment={<Search className='h-4 w-4' />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className='flex justify-center p-8'>Loading...</div>
              ) : (
                <div className='flex flex-col gap-10'>
                  {filteredGroupedData.map((group) => (
                    <div key={group.id} className='flex flex-col gap-4'>
                      <h2 className='text-md font-semibold tracking-tight'>
                        {group.title}
                      </h2>
                      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {group.finance_numbers.map((item) => (
                          <AutoSequencingCard
                            key={item.id}
                            item={item}
                            onClick={setSelectedItem}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <AutoSequencingModal
            item={selectedItem}
            codes={codes}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        </div>
      </div>
    </PermissionGuard>
  )
}
