import { PrismaClient, Prisma, Role } from "../../../../generated/index.js";

export class WaliProfileRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(skip: number, take: number, search?: string, role?: string, isActive?: boolean) {
    const whereClause: Prisma.WaliProfileWhereInput = {
      user: {
        AND: [
          search ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          } : {},
          role ? { role: role as Role } : {},
          isActive !== undefined ? { isActive } : {},
        ],
      },
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.waliProfile.findMany({
        skip,
        take,
        where: whereClause,
        include: {
          user: { select: { id: true, fullName: true, email: true, role: true, isActive: true } },
        }
      }),
      this.prisma.waliProfile.count({ where: whereClause }),
    ]);

    return { data, total };
  }


  async findById(id: string) {
    return await this.prisma.waliProfile.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string) {
    return await this.prisma.waliProfile.findUnique({
      where: { userId },
    });
  }

  async create(data: Prisma.WaliProfileCreateInput) {
    return await this.prisma.waliProfile.create({
      data,
      include: { user: true }
    });
  }

  async update(id: string, data: Prisma.WaliProfileUpdateInput) {
    return await this.prisma.waliProfile.update({
      where: { id },
      data,
      include: { user: true }
    });
  }

  async updateFromUser(userId: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id: userId },
      data,
      include: { waliProfile: true }
    });
  }


  async delete(id: string) {
    return await this.prisma.waliProfile.delete({
      where: { id }
    });
  }

  async stats() {
    // 1. Hitung total semua profil wali santri
    const total = await this.prisma.waliProfile.count();
    
    // 2. Hitung wali santri yang nomor HP-nya belum diisi (null)
    const missingPhone = await this.prisma.waliProfile.count({
      where: { phone: null }
    });

    // 3. (Opsional) Hitung wali santri yang alamatnya belum diisi
    const missingAddress = await this.prisma.waliProfile.count({
      where: { address: null }
    });

    return { total, missingPhone, missingAddress };
  }
}
