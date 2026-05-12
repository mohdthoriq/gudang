import { WaliProfileRepository } from "./waliProfile.repo.js";
import cloudinary from "../../../utils/cloudinary.js";
import { AppError } from "../../../appErr.js";
import type { ICreateWaliProfile, IUpdateWaliProfile } from "./waliProfile.schema.js";
import type { Prisma } from "../../../../generated/index.js";

export class WaliProfileService {
  constructor(private repo: WaliProfileRepository) { }

  async getAllProfiles(page: number = 1, limit: number = 10, search?: string | undefined, role?: string | undefined, isActive?: boolean | undefined) {
    const skip = (page - 1) * limit;
    const { data, total } = await this.repo.findAll(skip, limit, search, role, isActive);

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

  async getProfileByUserId(userId: string) {
    const profile = await this.repo.findByUserId(userId);
    if (!profile) throw new AppError("Profil Wali tidak ditemukan", 404);
    return profile;
  }

  async createProfile(body: ICreateWaliProfile) {
    // 1. Cek apakah User ID sudah punya profil (karena userId itu @unique)
    const existingProfile = await this.repo.findByUserId(body.userId);
    if (existingProfile) {
      throw new AppError("Profil untuk Wali ini sudah ada!", 400);
    }

    // 2. Siapkan Payload
    const payload: Prisma.WaliProfileCreateInput = {
      phone: body.phone ?? null,
      address: body.address ?? null,
      job: body.job ?? null,
      photoUrl: body.photoUrl ?? null,
      user: {
        connect: {
          id: body.userId,
        },
      },
    };

    return await this.repo.create(payload);
  }

  async updateProfile(userId: string, data: IUpdateWaliProfile) {
    // 1. Cari berdasarkan User ID menggunakan findByUserId yang sudah ada di repo
    const existing = await this.repo.findByUserId(userId);
    if (!existing) throw new AppError("Profil Wali tidak ditemukan", 404);

    // 2. Buat Payload untuk USER (karena ada fullName & email)
    const payload: Prisma.UserUpdateInput = {
      fullName: data.fullName,
      email: data.email,
      waliProfile: {
        upsert: {
          create: {
            phone: data.phone ?? null,
            address: data.address ?? null,
            job: data.job ?? null,
            photoUrl: data.photoUrl ?? null,
          },
          update: {
            ...(data.phone !== undefined && { phone: data.phone }),
            ...(data.address !== undefined && { address: data.address }),
            ...(data.job !== undefined && { job: data.job }),
            ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
          },
        },
      },
    };

    // 3. Panggil method repository yang mengupdate tabel User
    return await this.repo.updateFromUser(userId, payload);
  }


  async deleteProfile(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError("Profil Wali tidak ditemukan", 404);

    return await this.repo.delete(id);
  }

  async getWaliProfileStats() {
    const rawStats = await this.repo.stats();

    return {
      totalWali: rawStats.total,
      profileCompleteness: {
        withPhone: rawStats.total - rawStats.missingPhone,
        missingPhone: rawStats.missingPhone,
        withAddress: rawStats.total - rawStats.missingAddress,
        missingAddress: rawStats.missingAddress
      }
    };
  }
}