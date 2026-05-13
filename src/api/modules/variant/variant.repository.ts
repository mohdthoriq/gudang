import prisma from '@/lib/prisma';
import { CreateVariantInput, UpdateVariantInput } from './variant.validate';
import { Variant, Prisma } from '../../../../prisma/generated/client';

export class VariantRepository {
  static async findAndCountAll(
    skip: number,
    take: number,
    search?: string,
    modelId?: string
  ): Promise<[Variant[], number]> {
    // Pencarian dinamis ke SKU, warna, atau ukuran
    const where: Prisma.VariantWhereInput = {
      ...(search && {
        OR: [
          { sku: { contains: search, mode: 'insensitive' } },
          { color: { contains: search, mode: 'insensitive' } },
          { size: { contains: search, mode: 'insensitive' } },
        ]
      }),
      ...(modelId && { modelId }),
    };

    return prisma.$transaction([
      prisma.variant.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: 'desc' }, // Menggunakan updatedAt karena ada di skema
        include: { model: true },
      }),
      prisma.variant.count({ where }),
    ]);
  }

  static async findById(id: string): Promise<Variant | null> {
    return prisma.variant.findUnique({
      where: { id },
      include: { model: true },
    });
  }

  static async findBySku(sku: string): Promise<Variant | null> {
    return prisma.variant.findUnique({
      where: { sku },
    });
  }

  static async create(data: CreateVariantInput): Promise<Variant> {
    return prisma.variant.create({ data });
  }

  static async update(id: string, data: UpdateVariantInput): Promise<Variant> {
    return prisma.variant.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<Variant> {
    return prisma.variant.delete({
      where: { id },
    });
  }

  static async deleteMany(ids: string[]): Promise<Prisma.BatchPayload> {
    return prisma.variant.deleteMany({
      where: { id: { in: ids } },
    });
  }

  static async getSummary() {
    const totalVariants = await prisma.variant.count();
    // Bisa ditambah summary total stok jika mau:
    const totalStock = await prisma.variant.aggregate({
      _sum: { stock: true }
    });
    
    return { 
      totalVariants, 
      totalStock: totalStock._sum.stock || 0 
    };
  }
}
