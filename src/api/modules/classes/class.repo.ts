import type { Prisma, PrismaClient } from "../../../generated/index.js";

export class ClassRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(skip: number, take: number, search?: string, filter?: string) {
    const where: Prisma.ClassWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { division: { name: { contains: search, mode: 'insensitive' } } },
        { mentor: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (filter) {
      where.divisiId = filter;
    }
    const [data, total] = await Promise.all([
      this.prisma.class.findMany({
        where,
        skip,
        take,
        include: {
          division: {
            select: {
              name: true,
            },
          },
          mentor: {
            select: {
              fullName: true,
            },
          },
          _count: {
            select: {
              santriProfiles: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.class.count({ where })
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return await this.prisma.class.findUnique({
      where: { id },
      include: {
        division: true,
        mentor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        santriProfiles: {
          include: {
            user: {
              select: {
                fullName: true,
                nis: true,
              },
            },
          },
        },
        assignments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });
  }

  async create(data: Prisma.ClassCreateInput) {
    return await this.prisma.class.create({
      data,
      include: {
        division: {
          select: {
            name: true,
          },
        },
        mentor: {
          select: {
            fullName: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ClassUpdateInput) {
    return await this.prisma.class.update({
      where: { id },
      data,
      include: {
        division: {
          select: {
            name: true,
          },
        },
        mentor: {
          select: {
            fullName: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.class.delete({
      where: { id },
    });
  }

  async stats() {
    // 1. Hitung total semua kelas
    const total = await this.prisma.class.count();

    // 2. Kelompokkan jumlah kelas berdasarkan divisiId
    const byDivision = await this.prisma.class.groupBy({
      by: ['divisiId'],
      _count: {
        id: true
      }
    });

    // 3. Ambil daftar divisi untuk mendapatkan namanya (Mapping ID -> Name)
    const divisions = await this.prisma.division.findMany({
      select: { id: true, name: true }
    });

    return { total, byDivision, divisions };
  }
}
