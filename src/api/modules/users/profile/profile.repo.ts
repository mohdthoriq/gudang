import { PrismaClient, Prisma, Role, Gender } from "../../../../generated/index.js";

export class ProfileRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(skip: number, take: number, search?: string, role?: string, gender?: string, isActive?: boolean) {
    const whereClause: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(role && { role: role as Role }),
      ...(gender && { gender: gender as Gender }),
      ...(isActive !== undefined && { isActive }),
    };
    
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take,
        include: { santriProfile: true }, // Tarik juga data relasi profilnya
        orderBy: { createdAt: "desc" },
        where: whereClause,
      }),
      this.prisma.user.count({ where: whereClause }), // Hitung total seluruh user
    ]);

    return { data, total };
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { santriProfile: true },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
      include: { santriProfile: true },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id },
      data,
      include: { santriProfile: true },
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async stats() {
    // 1. Hitung total semua profil santri yang ada
    const total = await this.prisma.santriProfile.count();
    
    // 2. Kelompokkan berdasarkan jenis kelamin (gender)
    // 💡 Catatan: Sesuaikan kata 'gender' ini dengan nama kolom asli di file schema.prisma kamu
    const byGender = await this.prisma.santriProfile.groupBy({
      by: ['gender'], 
      _count: {
        id: true
      }
    });

    return { total, byGender };
  }
}
