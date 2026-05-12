import type { Prisma, PrismaClient } from "../../../generated/index.js";

export class AssignmentContentRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(skip: number, take: number, search?: string, filter?: string) {
    const where: Prisma.AssignmentContentWhereInput = {};
    if (search) {
      where.OR = [
        { assignment: { title: { contains: search, mode: 'insensitive' } } },
        { santri: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (filter) {
      where.assignmentId = filter;
    }
    const [data, total] = await Promise.all([
      this.prisma.assignmentContent.findMany({
        where,
        skip,
        take,
        include: {
          assignment: {
            select: {
              title: true,
            },
          },
          santri: {
            select: {
              fullName: true,
              nis: true,
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      }),
      this.prisma.assignmentContent.count({ where })
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return await this.prisma.assignmentContent.findUnique({
      where: { id },
      include: {
        assignment: true,
        santri: {
          select: {
            id: true,
            fullName: true,
            nis: true,
            santriProfile: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.AssignmentContentCreateInput) {
    return await this.prisma.assignmentContent.create({
      data,
      include: {
        assignment: {
          select: {
            title: true,
          },
        },
        santri: {
          select: {
            fullName: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.AssignmentContentUpdateInput) {
    return await this.prisma.assignmentContent.update({
      where: { id },
      data,
      include: {
        assignment: {
          select: {
            title: true,
          },
        },
        santri: {
          select: {
            fullName: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.assignmentContent.delete({
      where: { id },
    });
  }

  async stats() {
    return await this.prisma.assignmentContent.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });
  }
}
