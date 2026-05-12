import MenuCategories from '@/features/admin/menu-categories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/menu-categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MenuCategories />
}
