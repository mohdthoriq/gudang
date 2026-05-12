import { UserRepository } from "./user.repo.js";
import type { ICreateUserData, IUpdateUserData } from "./user.schema.js";
import bcrypt from "bcrypt";
import { Prisma, Role } from "../../../../generated/index.js";

export class UserService {
  constructor(private userRepo: UserRepository) { }

  async getAllUsers(params: {
    page: number;
    limit: number;
    search?: string | undefined;
    role?: string | undefined;
    isActive?: boolean | undefined;
  }) {
    const { page, limit, search, role, isActive } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      AND: [
        search ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        } : {},
        role ? { role: role as Role } : {},
        isActive !== undefined ? { isActive } : {},
      ],
    };

    const { data, total } = await this.userRepo.findAll({
      skip,
      take: limit,
      where,
    });

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


  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error("User tidak ditemukan");
    return user;
  }

  async createUser(data: ICreateUserData) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const payload: Prisma.UserCreateInput = {
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      phone: data.phone ?? null, // Atasi error exactOptionalPropertyTypes
    };

    return await this.userRepo.create(payload);
  }

  async updateUser(id: string, data: IUpdateUserData) {
    const existing = await this.userRepo.findById(id);
    if (!existing) throw new Error("User tidak ditemukan");

    // Trik membuang nilai undefined agar Prisma tidak error saat proses Update
    const payload = JSON.parse(JSON.stringify(data)) as Prisma.UserUpdateInput;

    return await this.userRepo.update(id, payload);
  }

  async deleteUser(id: string) {
    const existing = await this.userRepo.findById(id);
    if (!existing) throw new Error("User tidak ditemukan");

    return await this.userRepo.delete(id);
  }

  async getStats() {
    const rawStats = await this.userRepo.stats();

    // Merapikan format array dari Prisma menjadi object JSON
    const formattedByRole = rawStats.byRole.reduce((acc, curr) => {
      acc[curr.role] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Memastikan semua Role standar muncul di response, meskipun nilainya 0
    const defaultRoles = {
      ADMIN: 0,
      MENTOR: 0,
      SANTRI: 0,
      WALI_SANTRI: 0, // Sesuai dengan pesan error kamu sebelumnya
      ...formattedByRole
    };

    return {
      totalUsers: rawStats.total,
      byRole: defaultRoles
    };
  }
}
