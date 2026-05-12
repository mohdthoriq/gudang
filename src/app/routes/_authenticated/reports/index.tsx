import { createFileRoute } from '@tanstack/react-router'
import { Reports } from '@/features/reports/report-page'

export const Route = createFileRoute('/_authenticated/reports/')({
  component: Reports,
})
