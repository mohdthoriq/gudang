import prisma from '../../../lib/prisma';
import { CreateModelInput, UpdateModelInput } from './model.validate';
import { Model, Prisma } from '../../../../prisma/generated/client';

export class ModelRepository {
  static async findAndCountAll(
    skip: number,
    take: number,
    search?: string,
    groupId?: string
  ): Promise<[Model[], number]> {
    // Susun filter dinamis
    const where: Prisma.ModelWhereInput = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(groupId && { groupId }),
    };

    return prisma.$transaction([
      prisma.model.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'desc' },
        include: { group: true }, // Tarik data relasi grup sekalian
      }),
      prisma.model.count({ where }),
    ]);
  }

  static async findById(id: string): Promise<Model | null> {
    return prisma.model.findUnique({
      where: { id },
      include: { group: true },
    });
  }

  static async create(data: CreateModelInput): Promise<Model> {
    return prisma.model.create({ data: {...data, categoryId: data.groupId} });
  }

  static async update(id: string, data: UpdateModelInput): Promise<Model> {
    return prisma.model.update({
      where: { id },
      data: {...data, categoryId: data.groupId},
    });
  }

  static async delete(id: string): Promise<Model> {
    return prisma.model.delete({
      where: { id },
    });
  }

  static async deleteMany(ids: string[]): Promise<Prisma.BatchPayload> {
    return prisma.model.deleteMany({
      where: { id: { in: ids } },
    });
  }

  static async getSummary() {
    const totalModels = await prisma.model.count();
    return { totalModels };
  }
}
