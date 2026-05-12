import { createFileRoute } from '@tanstack/react-router'
import WarehouseFormPage from '@/features/warehouses/warehouse-form'

export const Route = createFileRoute('/_authenticated/warehouses/edit/')({
  component: WarehouseFormPage,
})