import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { TabsContent } from '@/components/ui/tabs'
import { UnderDevelopmentDialog } from '@/components/dialog/under-development.dialog'
import { settingsTabs } from '../constants/settings-constants'

export function SettingsTabContent() {
  const [underDevDialog, setUnderDevDialog] = useState<{
    open: boolean
    featureName?: string
  }>({ open: false })

  return (
    <>
      <div className='bg-secondary text-card-foreground w-full flex-1 rounded-xl border shadow-sm'>
        {settingsTabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className='m-0 space-y-6 p-6'
          >
            <div className='mb-6 flex items-center gap-2'>
              {/* <tab.icon className='text-muted-foreground h-6 w-6' /> */}
              <h2 className='text-xl font-semibold tracking-tight'>
                {tab.name}
              </h2>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {tab.items.map((item) =>
                item?.url ? (
                  <Link key={item.title} to={item.url}>
                    <div className='group bg-background hover:border-primary/50 flex h-full min-h-50 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border p-6 text-center shadow-sm transition-all hover:shadow-md'>
                      <div className='bg-primary/10 text-primary rounded-full p-3 transition-transform group-hover:scale-110'>
                        <item.icon className='h-8 w-8' />
                      </div>
                      <div className='space-y-1'>
                        <h3 className='leading-none font-semibold tracking-tight'>
                          {item.title}
                        </h3>
                        <p className='text-muted-foreground text-sm'>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={item.title}
                    onClick={() =>
                      setUnderDevDialog({ open: true, featureName: item.title })
                    }
                    className='group bg-background hover:border-primary/50 flex h-full min-h-50 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border p-6 text-center shadow-sm transition-all hover:shadow-md'
                  >
                    <div className='bg-primary/10 text-primary rounded-full p-3 transition-transform group-hover:scale-110'>
                      <item.icon className='h-8 w-8' />
                    </div>
                    <div className='space-y-1'>
                      <h3 className='leading-none font-semibold tracking-tight'>
                        {item.title}
                      </h3>
                      <p className='text-muted-foreground text-sm'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </TabsContent>
        ))}
      </div>

      <UnderDevelopmentDialog
        open={underDevDialog.open}
        onOpenChange={(open) =>
          setUnderDevDialog((prev) => ({ ...prev, open }))
        }
        featureName={underDevDialog.featureName}
      />
    </>
  )
}
