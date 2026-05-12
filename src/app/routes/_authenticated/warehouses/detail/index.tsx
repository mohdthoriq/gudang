import WarehouseDetailView from '@/features/warehouses/warehouse-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/warehouses/detail/')({
  component: WarehouseDetailView
})