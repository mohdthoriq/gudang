import type { Prisma, PrismaClient } from "../../../generated/index.js";

export class DivisionRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(skip: number, take: number, search?: string, filter?: string) {
    const where: Prisma.DivisionWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (filter) {
      where.id = filter;
    }
    const [data, total] = await Promise.all([
      this.prisma.division.findMany({
        where,
        skip,
        take,
        include: {
        _count: {
          select: {
            classes: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
    this.prisma.division.count({ where })
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return await this.prisma.division.findUnique({
      where: { id },
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.DivisionCreateInput) {
    return await this.prisma.division.create({
      data,
    });
  }

  async update(id: string, data: Prisma.DivisionUpdateInput) {
    return await this.prisma.division.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.division.delete({
      where: { id },
    });
  }

  async stats() {
    // 1. Hitung total semua divisi
    const total = await this.prisma.division.count();
    
    // 2. Ambil semua divisi beserta jumlah kelas di dalamnya
    const divisionsWithClassCount = await this.prisma.division.findMany({
      select: {
        name: true,
        _count: {
          select: { classes: true }
        }
      }
    });

    return { total, divisionsWithClassCount };
  }
}
