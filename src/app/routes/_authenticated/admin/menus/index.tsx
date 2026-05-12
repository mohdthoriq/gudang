import { createFileRoute } from '@tanstack/react-router'
import Menus from '@/features/admin/menus'

export const Route = createFileRoute('/_authenticated/admin/menus/')({
  component: Menus,
})
