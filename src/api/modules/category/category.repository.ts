import { CreateCategoryInput, UpdateCategoryInput } from './category.validate';
import { Category, Prisma } from '../../../../prisma/generated/client';
import prisma from '@/lib/prisma';

export class CategoryRepository {
  static async findAndCountAll(
    skip: number,
    take: number,
    search?: string
  ): Promise<[Category[], number]> {
    const where: Prisma.CategoryWhereInput = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    return prisma.$transaction([
      prisma.category.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'desc' },
        include: { _count: { select: { models: true } } }, // Menghitung jumlah model di tiap kategori
      }),
      prisma.category.count({ where }),
    ]);
  }

  static async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: { models: true },
    });
  }

  static async create(data: CreateCategoryInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  static async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }

  static async deleteMany(ids: string[]): Promise<Prisma.BatchPayload> {
    return prisma.category.deleteMany({
      where: { id: { in: ids } },
    });
  }

  static async getSummary() {
    const totalCategories = await prisma.category.count();
    return { totalCategories };
  }
}