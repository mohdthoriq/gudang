import { createFileRoute } from '@tanstack/react-router'
import RentalPage from '@/features/rental'

export const Route = createFileRoute('/_authenticated/rental/')({
  component: RentalPage,
})
