import type { Prisma } from "../../../generated/index.js";
import { DivisionRepository } from "./division.repo.js";
import type { ICreateDivisionData, IUpdateDivisionData } from "./division.schema.js";

export class DivisionService {
  constructor(private divisionRepo: DivisionRepository) {}

  async getAllDivisions(params: { page: number; limit: number; search?: string; filter?: string }) {
    const { page, limit, search, filter } = params;
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.divisionRepo.findAll(skip, take, search, filter);
    return {
      data,
      meta: {
        total,
        page: skip / take + 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getDivisionById(id: string) {
    const division = await this.divisionRepo.findById(id);
    if (!division) throw new Error("Divisi tidak ditemukan");
    return division;
  }

  async createDivision(data: ICreateDivisionData) {
    const payload: Prisma.DivisionCreateInput = {
      name: data.name,
      ...(data.description !== undefined && { description: data.description ?? null }),
    };
    return await this.divisionRepo.create(payload);
  }

  async updateDivision(id: string, data: IUpdateDivisionData) {
    const existing = await this.divisionRepo.findById(id);
    if (!existing) throw new Error("Divisi tidak ditemukan");

    const payload: Prisma.DivisionUpdateInput = {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description ?? null }),
    };

    return await this.divisionRepo.update(id, payload);
  }

  async deleteDivision(id: string) {
    const existing = await this.divisionRepo.findById(id);
    if (!existing) throw new Error("Divisi tidak ditemukan");

    return await this.divisionRepo.delete(id);
  }

  async getDivisionStats() {
    const rawStats = await this.divisionRepo.stats();

    // Merapikan format array menjadi object JSON (Nama Divisi -> Jumlah Kelas)
    const formattedClassCount = rawStats.divisionsWithClassCount.reduce((acc, curr) => {
      acc[curr.name] = curr._count.classes;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDivisions: rawStats.total,
      classesPerDivision: formattedClassCount
    };
  }
}
