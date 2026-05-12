import type { Prisma, PrismaClient } from "../../../../generated/index.js";


export class UserRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(params: {
    skip: number;
    take: number;
    where: Prisma.UserWhereInput;
  }) {
    const { skip, take, where } = params;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async stats() {
    // 1. Hitung total semua user di dalam database
    const total = await this.prisma.user.count();
    
    // 2. Kelompokkan jumlah user berdasarkan Role-nya
    const byRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    });

    return { total, byRole };
  }
}
