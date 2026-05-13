import { z } from 'zod';
import { TransactionType } from '../../../../prisma/generated/client';

export const createStockHistorySchema = z.object({
  variantId: z.string().uuid(),
  type: z.nativeEnum(TransactionType, {
    message: "Tipe transaksi tidak valid"
  }),
  quantity: z.number().int().positive("Kuantitas harus lebih dari 0"), // Selalu positif saat diinput
  description: z.string().optional().nullable(),
});

export const queryStockHistorySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  variantId: z.string().uuid().optional(), // Filter riwayat berdasarkan Varian tertentu
  type: z.nativeEnum(TransactionType).optional(), // Filter berdasarkan tipe masuk/keluar
});

export type CreateStockHistoryInput = z.infer<typeof createStockHistorySchema>;
