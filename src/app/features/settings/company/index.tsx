import { getRouteApi } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CompanySettingsForm } from './components/company-settings-form'
import { CompanySettingsSkeleton } from './components/company-settings-skeleton'
import { useCompanySettingsForm } from './hooks/use-company-settings-form'

const route = getRouteApi('/_authenticated/settings/company/')

export function CompanySettings() {
  const navigate = route.useNavigate()
  const { isLoadingData } = useCompanySettingsForm()

  if (isLoadingData) {
    return <CompanySettingsSkeleton />
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Data Perusahaan
              </h2>
              <p className='text-muted-foreground'>
                Kelola data Perusahaan Anda.
              </p>
            </div>
            <div>
              <Button
                variant={'link'}
                onClick={() =>
                  navigate({
                    to: '/settings',
                    search: { tab: 'company' },
                  })
                }
              >
                Kembali
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <CompanySettingsForm />
        </CardContent>
      </Card>
    </>
  )
}
