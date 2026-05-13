import prisma from '../../../lib/prisma';
import { CreateGroupDTO, UpdateGroupDTO } from './group.validate';
import { Group, Prisma } from '../../../../prisma/generated/client';

export class GroupRepository {
  static async findAndCountAll(
    skip: number,
    take: number,
    search?: string
  ): Promise<[Group[], number]> {
    const where: Prisma.GroupWhereInput = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    // Prisma Transaction untuk menjalankan query data dan count secara paralel
    return prisma.$transaction([
      prisma.group.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'desc' }, // Tampilkan yang terbaru dulu
      }),
      prisma.group.count({ where }),
    ]);
  }

  static async findById(id: number): Promise<Group | null> {
    return prisma.group.findUnique({
      where: { id },
    });
  }

  static async create(data: CreateGroupDTO): Promise<Group> {
    return prisma.group.create({ data });
  }

  static async update(id: number, data: UpdateGroupDTO): Promise<Group> {
    return prisma.group.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number): Promise<Group> {
    return prisma.group.delete({
      where: { id },
    });
  }

  static async deleteMany(ids: number[]): Promise<Prisma.BatchPayload> {
    return prisma.group.deleteMany({
      where: { id: { in: ids } },
    });
  }

  static async getSummary() {
    const totalGroups = await prisma.group.count();
    return { totalGroups };
  }
}
