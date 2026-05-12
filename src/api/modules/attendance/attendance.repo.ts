import type { Prisma, PrismaClient } from "../../../generated/index.js";

export class AttendanceRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(skip: number, take: number, search?: string, filter?: string) {
    const where: Prisma.AttendanceWhereInput = {};
    if (search) {
      where.OR = [
        { santri: { fullName: { contains: search, mode: 'insensitive' } } },
        { class: { name: { contains: search, mode: 'insensitive' } } },
        { mentor: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (filter) {
      where.classId = filter;
    }
    const [data, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        skip,
        take,
        include: {
        class: {
          select: { name: true },
        },
        santri: {
          select: { fullName: true, nis: true },
        },
        mentor: {
          select: { fullName: true },
        },
      },
      orderBy: {
        date: 'desc',
      },
    }),
    this.prisma.attendance.count({ where })
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        class: true,
        santri: {
          select: { 
            fullName: true, 
            nis: true,
            santriProfile: true 
          },
        },
        mentor: {
          select: { fullName: true },
        },
      },
    });
  }

  async create(data: Prisma.AttendanceCreateInput) {
    return await this.prisma.attendance.create({
      data,
      include: {
        class: {
          select: { name: true },
        },
        santri: {
          select: { fullName: true, nis: true },
        },
        mentor: {
          select: { fullName: true },
        },
      },
    });
  }

  async update(id: string, data: Prisma.AttendanceUpdateInput) {
    return await this.prisma.attendance.update({
      where: { id },
      data,
      include: {
        santri: {
          select: { fullName: true },
        },
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.attendance.delete({
      where: { id },
    });
  }

  async stats() {
    // Menghitung total semua record absensi
    const total = await this.prisma.attendance.count();
    
    // Mengelompokkan berdasarkan status absensi
    const byStatus = await this.prisma.attendance.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    return { total, byStatus };
  }
}
