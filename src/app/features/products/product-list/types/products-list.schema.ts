import { z } from 'zod'

export const deleteProductSchema = z.object({
  id: z.uuid(),
})

export type DeleteProductFormData = z.infer<typeof deleteProductSchema>

export const bulkDeleteProductSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeleteProductFormData = z.infer<typeof bulkDeleteProductSchema>
