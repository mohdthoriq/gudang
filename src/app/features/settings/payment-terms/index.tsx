import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { PaymentTermsDialogs } from './components/payment-terms-dialogs'
import { PaymentTermsFallback } from './components/payment-terms-fallback'
import {
  usePaymentTerms,
  PaymentTermsProvider,
} from './components/payment-terms-provider'
import { PaymentTermsTable } from './components/payment-terms-table'
import { type PaymentTermsQueryParams } from './hooks/use-payment-terms-query'

const route = getRouteApi('/_authenticated/settings/payment-terms/')

function PaymentTermsContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = usePaymentTerms()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SETTINGS_PAYMENT_TERM}
      fallback={<PaymentTermsFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Termin Pembayaran
              </h2>
              <p className='text-muted-foreground'>
                Kelola Termin Pembayaran di Perusahaan Anda.
              </p>
            </div>
            <div>
              <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
                <Button
                  variant={'link'}
                  onClick={() =>
                    navigate({
                      to: '/settings',
                      search: { tab: 'master_data' },
                    })
                  }
                >
                  Kembali
                </Button>
                <Button onClick={() => setOpen('add')}>
                  <Plus className='mr-2 h-4 w-4' />
                  Tambah Termin
                </Button>
              </div>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <div className='flex flex-1 flex-col gap-4 sm:gap-6'>
            <PaymentTermsTable search={search} navigate={navigate} />
            <PaymentTermsDialogs />
          </div>
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

export function PaymentTerms() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: PaymentTermsQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
  }

  return (
    <PaymentTermsProvider paginationParams={queryParams}>
      <PaymentTermsContent />
    </PaymentTermsProvider>
  )
}

export default PaymentTerms
