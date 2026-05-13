import prisma from '@/lib/prisma';
import { CreateStockHistoryInput } from './stock-history.validate';
import { StockHistory, Prisma, TransactionType } from '../../../../prisma/generated/client';

export class StockHistoryRepository {
  static async findAndCountAll(
    skip: number,
    take: number,
    variantId?: string,
    type?: TransactionType
  ): Promise<[StockHistory[], number]> {
    const where: Prisma.StockHistoryWhereInput = {
      ...(variantId && { variantId }),
      ...(type && { type }),
    };

    return prisma.$transaction([
      prisma.stockHistory.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }, // Selalu urutkan dari yang terbaru
        include: { variant: { include: { model: true } } }, // Tarik data varian & model
      }),
      prisma.stockHistory.count({ where }),
    ]);
  }

  static async findById(id: string): Promise<StockHistory | null> {
    return prisma.stockHistory.findUnique({
      where: { id },
      include: { variant: true },
    });
  }

  // FUNGSI INTI: Catat riwayat sekaligus update stok Variant
  static async createTransaction(data: CreateStockHistoryInput): Promise<StockHistory> {
    return prisma.$transaction(async (tx) => {
      // 1. Simpan riwayat transaksi
      const history = await tx.stockHistory.create({
        data: {
          variantId: data.variantId,
          type: data.type,
          quantity: data.quantity,
          description: data.description,
        },
      });

      // 2. Tentukan pengali: Jika tipe masuk (IN) maka positif, jika keluar (OUT) maka negatif
      // Sesuaikan 'IN' dengan nama enum-mu di schema.prisma
      const incrementValue = data.type === 'IN' ? data.quantity : -data.quantity;

      // 3. Update stok di tabel Variant
      await tx.variant.update({
        where: { id: data.variantId },
        data: {
          stock: { increment: incrementValue }
        }
      });

      return history;
    });
  }
}
