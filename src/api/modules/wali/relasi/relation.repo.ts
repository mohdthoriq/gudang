import { PrismaClient, Prisma } from "../../../../generated/index.js";

export class WaliRelationRepository {
  constructor(private prisma: PrismaClient) {}

  // Get All dengan Pagination dan Include data dasar User
  async findAll(skip: number, take: number, search?: string, filter?: string) {
    const where: Prisma.WaliSantriRelationWhereInput = {};
    if (search) {
      where.OR = [
        { wali: { fullName: { contains: search, mode: 'insensitive' } } },
        { santri: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (filter) {
      where.id = filter;
    }
    const [data, total] = await this.prisma.$transaction([
      this.prisma.waliSantriRelation.findMany({
        where,
        skip,
        take,
        include: {
          wali: { select: { id: true, fullName: true, email: true } },
          santri: { select: { id: true, fullName: true, nis: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.waliSantriRelation.count(),
    ]);

    return { data, total };
  }

  async findById(id: string) {
    return await this.prisma.waliSantriRelation.findUnique({
      where: { id },
    });
  }

  // Cek duplikasi berdasarkan Unique Constraint
  async checkDuplicate(waliId: string, santriId: string) {
    return await this.prisma.waliSantriRelation.findUnique({
      where: {
        waliId_santriId: {
          waliId,
          santriId,
        },
      },
    });
  }

  async create(data: Prisma.WaliSantriRelationUncheckedCreateInput) {
    return await this.prisma.waliSantriRelation.create({
      data,
    });
  }

  async update(id: string, data: Prisma.WaliSantriRelationUpdateInput) {
    return await this.prisma.waliSantriRelation.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.waliSantriRelation.delete({
      where: { id },
    });
  }

  async stats() {
    // 1. Hitung total semua relasi yang terdaftar
    const total = await this.prisma.waliSantriRelation.count();
    
    // 2. Kelompokkan berdasarkan tipe hubungan (misal: AYAH, IBU, WALI_LAIN)
    // 💡 Ganti 'relationType' dengan nama kolom yang benar di database kamu
    const byCategory = await this.prisma.waliSantriRelation.groupBy({
      by: ['category'], 
      _count: {
        id: true
      }
    });

    return { total, byCategory };
  }
}
