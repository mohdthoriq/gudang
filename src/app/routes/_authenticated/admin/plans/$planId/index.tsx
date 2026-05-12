import { createFileRoute } from '@tanstack/react-router'
import { PlansForm } from '@/features/admin/plans/components/plans-form'

import { PlansProvider } from '@/features/admin/plans/components/plans-provider'

export const Route = createFileRoute('/_authenticated/admin/plans/$planId/')({
  component: EditPlanPage,
})

function EditPlanPage() {
  const { planId } = Route.useParams()
  return (
    <PlansProvider>
      <div className='flex flex-col gap-4 p-4'>
        <PlansForm mode='edit' planId={planId} />
      </div>
    </PlansProvider>
  )
}
