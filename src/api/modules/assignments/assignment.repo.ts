import type { Prisma, PrismaClient } from "../../../generated/index.js";

export class AssignmentRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(skip: number, take: number, search?: string, filter?: string) {
    const where: Prisma.AssignmentWhereInput = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { class: { name: { contains: search, mode: 'insensitive' } } },
        { mentor: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (filter) {
      where.classId = filter;
    }
    const [data, total] = await Promise.all([
      this.prisma.assignment.findMany({
        where,
        skip,
        take,
        include: {
        class: {
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
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    this.prisma.assignment.count({ where })
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            santriProfiles: {
              include: {
                user: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
        mentor: {
          select: {
            id: true,
            fullName: true,
          },
        },
        submissions: {
          include: {
            santri: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: Prisma.AssignmentCreateInput) {
    return await this.prisma.assignment.create({
      data,
      include: {
        class: {
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

  async update(id: string, data: Prisma.AssignmentUpdateInput) {
    return await this.prisma.assignment.update({
      where: { id },
      data,
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.assignment.delete({
      where: { id },
    });
  }

  async stats() {
    // Menghitung total semua penugasan
    const totalAssignments = await this.prisma.assignment.count();
    
    // Mengelompokkan berdasarkan tipe pengumpulan (TEXT atau FILE)
    const bySubmissionType = await this.prisma.assignment.groupBy({
      by: ['submissionType'],
      _count: {
        id: true
      }
    });

    return { totalAssignments, bySubmissionType };
  }
}
