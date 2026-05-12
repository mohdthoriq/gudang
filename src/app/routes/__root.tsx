import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useIsOffline } from '@/hooks/use-is-offline'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { OfflineError } from '@/features/errors/offline-error'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'

function RootComponent() {
  const isOffline = useIsOffline()

  if (isOffline) {
    return <OfflineError />
  }

  return (
    <>
      <NavigationProgress />
      <Outlet />
      <Toaster duration={5000} position='top-center' richColors />
      <FloatingWhatsApp />
      {import.meta.env.MODE === 'development' && (
        <>
          {/* <ReactQueryDevtools buttonPosition='bottom-right' /> */}
          {/* <TanStackRouterDevtools position='bottom-right' /> */}
        </>
      )}
    </>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
