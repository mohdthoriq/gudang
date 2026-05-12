import type { Prisma } from "../../../generated/index.js";
import { AppError } from "../../appErr.js";
import { ClassRepository } from "./class.repo.js";
import type { ICreateClassData, IUpdateClassData } from "./class.schema.ts";

export class ClassService {
  constructor(private classRepo: ClassRepository) {}

  async getAllClasses(params: { page: number; limit: number; search?: string; filter?: string }) {
    const { page, limit, search, filter } = params;
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.classRepo.findAll(skip, take, search, filter);
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

  async getClassById(id: string) {
    const foundClass = await this.classRepo.findById(id);
    if (!foundClass) throw new AppError("Kelas tidak ditemukan", 404);
    return foundClass;
  }

  async createClass(data: ICreateClassData) {
    const payload: Prisma.ClassCreateInput = {
      name: data.name,
      division: { connect: { id: data.divisiId } },
      mentor: { connect: { id: data.mentorId } },
    };
    return await this.classRepo.create(payload);
  }

  async updateClass(id: string, data: IUpdateClassData) {
    const existing = await this.classRepo.findById(id);
    if (!existing) throw new AppError("Kelas tidak ditemukan", 404);

    const payload: Prisma.ClassUpdateInput = {
      ...(data.name && { name: data.name }),
      ...(data.divisiId && { division: { connect: { id: data.divisiId } } }),
      ...(data.mentorId && { mentor: { connect: { id: data.mentorId } } }),
    };

    return await this.classRepo.update(id, payload);
  }

  async deleteClass(id: string) {
    const existing = await this.classRepo.findById(id);
    if (!existing) throw new AppError("Kelas tidak ditemukan", 404);

    return await this.classRepo.delete(id);
  }

  async getClassStats() {
    const rawStats = await this.classRepo.stats();

    // Buat "Kamus" untuk mengubah divisiId menjadi Nama Divisi (misal: "SD", "SMP")
    const divisionMap = rawStats.divisions.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {} as Record<string, string>);

    // Format array hasil Prisma menjadi object JSON menggunakan nama divisi
    const formattedByDivision = rawStats.byDivision.reduce((acc, curr) => {
      const divisionName = divisionMap[curr.divisiId] || "Divisi Tidak Diketahui";
      acc[divisionName] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: rawStats.total,
      byDivision: formattedByDivision
    };
  }
}
