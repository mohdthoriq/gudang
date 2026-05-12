import { createFileRoute } from '@tanstack/react-router'
import ProductCategory from '@/features/product-categories'

export const Route = createFileRoute('/_authenticated/product-categories/')({
  component: ProductCategory,
})
