import { z } from 'zod'

// Skema untuk menghapus satu gudang
export const deleteWarehouseSchema = z.object({
  id: z.string().min(1, 'ID Gudang diperlukan'),
})

// Skema untuk menghapus banyak gudang sekaligus (bulk delete)
export const bulkDeleteWarehouseSchema = z.object({
  ids: z.array(z.string()).min(1, 'Pilih minimal satu gudang untuk dihapus'),
})

// Ekspor tipe (type inference) agar bisa digunakan di hook mutation kamu
export type DeleteWarehouseFormData = z.infer<typeof deleteWarehouseSchema>
export type BulkDeleteWarehouseFormData = z.infer<typeof bulkDeleteWarehouseSchema>
