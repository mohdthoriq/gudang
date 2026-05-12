import { z } from 'zod'

export const createWarehouseSchema = z.object({
  name: z.string().min(1, 'Nama gudang harus diisi'),
  code: z.string().min(1, 'Kode gudang harus diisi'),
  description: z.string().optional(),
})

export type CreateWarehouseFormData = z.infer<typeof createWarehouseSchema>

export const updateWarehouseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nama gudang harus diisi'),
  code: z.string().min(1, 'Kode gudang harus diisi'),
  description: z.string().optional(),
})

export type UpdateWarehouseFormData = z.infer<typeof updateWarehouseSchema>

export const deleteWarehouseSchema = z.object({
  id: z.string().uuid(),
})

export type DeleteWarehouseFormData = z.infer<typeof deleteWarehouseSchema>

export const bulkDeleteWarehouseSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'Pilih minimal 1 gudang untuk dihapus'),
})

export type BulkDeleteWarehouseFormData = z.infer<typeof bulkDeleteWarehouseSchema>
