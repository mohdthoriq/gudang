import { StockHistoryRepository } from './stock-history.repository';
import { VariantRepository } from '@/api/modules/variant/variant.repository';
import { createStockHistorySchema, queryStockHistorySchema } from './stock-history.validate';
import { StockHistory } from '../../../../prisma/generated/client';

export class StockHistoryService {
  static async getHistories(queryParams: unknown) {
    const parsed = queryStockHistorySchema.parse(queryParams);
    
    const pageNum = Number(parsed.page);
    const limitNum = Number(parsed.limit);
    const skip = (pageNum - 1) * limitNum;
    
    const variantId = parsed.variantId ? String(parsed.variantId) : undefined;
    const type = parsed.type;

    const [histories, totalItems] = await StockHistoryRepository.findAndCountAll(
      skip, limitNum, variantId, type
    );

    return {
      data: histories,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum),
      },
    };
  }

  static async getHistoryById(id: string): Promise<StockHistory> {
    const history = await StockHistoryRepository.findById(id);
    if (!history) throw new Error('Riwayat tidak ditemukan');
    return history;
  }

  static async createHistory(payload: unknown): Promise<StockHistory> {
    const parsedData = createStockHistorySchema.parse(payload);
    
    // 1. Pastikan Variant-nya ada
    const variant = await VariantRepository.findById(parsedData.variantId);
    if (!variant) throw new Error('Variant ID tidak valid atau tidak ditemukan');

    // 2. Proteksi Stok Minus (Pastikan 'OUT' sesuai nama enum-mu)
    if (parsedData.type === 'OUT') {
      if (variant.stock < parsedData.quantity) {
        throw new Error(`Stok tidak mencukupi! Sisa stok saat ini hanya ${variant.stock}`);
      }
    }

    // 3. Eksekusi transaksi (simpan riwayat + update stok)
    return StockHistoryRepository.createTransaction(parsedData);
  }
}
