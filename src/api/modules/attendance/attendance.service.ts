import { AttendanceRepository } from "./attendance.repo.js";
import type { IMarkAttendanceData, IUpdateAttendanceData } from "./attendance.schema.js";
import type { IAttendanceQuery } from "./attendance.dto.js";
import type { Prisma } from "../../../generated/index.js";

export class AttendanceService {
  constructor(private attendanceRepo: AttendanceRepository) {}

  async getAllAttendances(params: { page: number; limit: number; search?: string; filter?: string }) {
    const { page, limit, search, filter } = params;
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.attendanceRepo.findAll(skip, take, search, filter);
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

  async getAttendanceById(id: string) {
    const attendance = await this.attendanceRepo.findById(id);
    if (!attendance) throw new Error("Data absensi tidak ditemukan");
    return attendance;
  }

  async markAttendance(data: IMarkAttendanceData) {
    const payload: Prisma.AttendanceCreateInput = {
      class: { connect: { id: data.classId } },
      santri: { connect: { id: data.santriId } },
      mentor: { connect: { id: data.mentorId } },
      date: new Date(data.date),
      status: data.status,
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
    };
    return await this.attendanceRepo.create(payload);
  }

  async updateAttendance(id: string, data: IUpdateAttendanceData) {
    const existing = await this.attendanceRepo.findById(id);
    if (!existing) throw new Error("Data absensi tidak ditemukan");

    const payload: Prisma.AttendanceUpdateInput = {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
    };

    return await this.attendanceRepo.update(id, payload);
  }

  async deleteAttendance(id: string) {
    const existing = await this.attendanceRepo.findById(id);
    if (!existing) throw new Error("Data absensi tidak ditemukan");

    return await this.attendanceRepo.delete(id);
  }

  async getAttendanceStats() {
    const rawStats = await this.attendanceRepo.stats();

    // Merapikan format array dari Prisma menjadi object JSON yang mudah dibaca
    const formattedByStatus = rawStats.byStatus.reduce((acc, curr) => {
      // curr.status akan berisi enum seperti 'HADIR', 'IZIN', 'SAKIT', 'ALPHA'
      acc[curr.status] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Memastikan status yang mungkin belum ada datanya tetap bernilai 0 (Opsional, tapi bagus untuk Frontend)
    const defaultStatus = {
      HADIR: 0,
      IZIN: 0,
      SAKIT: 0,
      ALPHA: 0,
      ...formattedByStatus // Timpa nilai 0 dengan data asli dari database jika ada
    };

    return {
      total: rawStats.total,
      byStatus: defaultStatus
    };
  }
}
