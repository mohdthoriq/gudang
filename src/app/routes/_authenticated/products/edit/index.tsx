import { createFileRoute } from '@tanstack/react-router'
import { ProductsForm } from '@/features/products/product-form'

export const Route = createFileRoute('/_authenticated/products/edit/')({
  component: ProductsForm,
})
