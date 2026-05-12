import { createFileRoute } from '@tanstack/react-router'
import Products from '@/features/products/product-list'

export const Route = createFileRoute('/_authenticated/products/')({
  component: Products,
})
