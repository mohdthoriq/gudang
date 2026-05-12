import { WaliRelationRepository } from "./relation.repo.js";
import type { ICreateWaliRelation, IUpdateWaliRelation } from "./relation.dto.js";
import { AppError } from "../../../appErr.js";

export class WaliRelationService {
  constructor(private repo: WaliRelationRepository) {}

  async getAllRelations(params: { page: number; limit: number; search?: string; filter?: string }) {
    const { page, limit, search, filter } = params;
    const skip = (page - 1) * limit;
    const { data, total } = await this.repo.findAll(skip, limit, search, filter);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createRelation(data: ICreateWaliRelation) {
    // 1. Validasi Duplikasi
    const isDuplicate = await this.repo.checkDuplicate(data.waliId, data.santriId);
    if (isDuplicate) {
      throw new AppError("Relasi antara Wali dan Santri ini sudah terdaftar!", 400);
    }

    const payload: ICreateWaliRelation = {
      waliId: data.waliId,
      santriId: data.santriId,
      category: data.category,
    };

    // 2. Simpan ke database
    return await this.repo.create(payload);
  }

  async updateRelation(id: string, data: IUpdateWaliRelation) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new AppError("Data relasi tidak ditemukan", 404);
    }

    const payload: IUpdateWaliRelation = {
      category: data.category,
    };

    return await this.repo.update(id, payload);
  }

  async deleteRelation(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new AppError("Data relasi tidak ditemukan", 404);
    }

    return await this.repo.delete(id);
  }

  async getRelationStats() {
    const rawStats = await this.repo.stats();

    // Merapikan format array dari Prisma menjadi object JSON
    const formattedByCategory = rawStats.byCategory.reduce((acc, curr) => {
      // Jika relasi kosong/null, kita beri label default
      const key = curr.category ? String(curr.category) : 'LAINNYA';
      acc[key] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRelations: rawStats.total,
      byCategory: formattedByCategory
    };
  }
}
