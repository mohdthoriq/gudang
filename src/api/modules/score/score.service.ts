// src/modules/monthlyEvaluation/monthlyEvaluation.service.ts
import { AppError } from "../../appErr.js";
import { MonthlyEvaluationRepo } from "./score.repo.js";
import { Prisma } from "../../../generated/index.js";
import type { ICreateEvaluation, IUpdateEvaluation } from "./score.schema.js";

export class MonthlyEvaluationService {
  constructor(private repo: MonthlyEvaluationRepo) { }

  // Helper function untuk menghitung nilai
  private calculateScores(taskAvg: number, attendancePoin: number, maxAttendPoin: number, attitudeAvg: number) {
    const taskScore = taskAvg * 0.50; // 50%
    const attendanceScore = maxAttendPoin > 0 ? (attendancePoin / maxAttendPoin) * 40 : 0; // 40%
    const attitudeScore = attitudeAvg * 0.10; // 10%

    return {
      taskScore: parseFloat(taskScore.toFixed(2)),
      attendanceScore: parseFloat(attendanceScore.toFixed(2)),
      attitudeScore: parseFloat(attitudeScore.toFixed(2)),
      finalScore: parseFloat((taskScore + attendanceScore + attitudeScore).toFixed(2))
    };
  }

  async getAll(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const { search, classId, month, year } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.MonthlyEvaluationWhereInput = {
      AND: [
        search ? { santri: { fullName: { contains: search, mode: 'insensitive' } } } : {},
        classId ? { classId: classId as string } : {},
        month ? { month: parseInt(month as string) } : {},
        year ? { year: parseInt(year as string) } : {}
      ]
    };

    const { data, total } = await this.repo.findAll({ skip, take: limit, where });

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getById(id: string) {
    const evalData = await this.repo.findById(id);
    if (!evalData) throw new AppError("Data evaluasi tidak ditemukan", 404);
    return evalData;
  }

  async create(data: ICreateEvaluation) {
    // Hitung bobot nilai dan nilai akhir otomatis
    const calculated = this.calculateScores(data.taskAvg, data.attendancePoin, data.maxAttendPoin, data.attitudeAvg);

    // Susun payload secara eksplisit untuk menghindari 'undefined' bawaan dari ...data
    const payload: Prisma.MonthlyEvaluationUncheckedCreateInput = {
      santriId: data.santriId,
      classId: data.classId,
      month: data.month,
      year: data.year,
      taskAvg: data.taskAvg,
      attendancePoin: data.attendancePoin,
      maxAttendPoin: data.maxAttendPoin,
      attitudeAvg: data.attitudeAvg,

      // Trik aman untuk memasukkan field opsional tanpa memicu error exactOptionalPropertyTypes
      ...(data.notes !== undefined && { notes: data.notes }),

      ...calculated
    };

    return await this.repo.upsert(payload);
  }

  async update(id: string, data: IUpdateEvaluation) {
    const existing = await this.getById(id);

    // 1. Ambil data baru jika ada, jika tidak gunakan data lama dari database
    const taskAvg = data.taskAvg ?? existing.taskAvg;
    const attendancePoin = data.attendancePoin ?? existing.attendancePoin;
    const maxAttendPoin = data.maxAttendPoin ?? existing.maxAttendPoin;
    const attitudeAvg = data.attitudeAvg ?? existing.attitudeAvg;

    // 2. Kalkulasi ulang nilai berdasarkan gabungan data baru & lama
    const calculated = this.calculateScores(taskAvg, attendancePoin, maxAttendPoin, attitudeAvg);

    // 3. Rangkai payload secara eksplisit (jangan gunakan ...data agar undefined tidak ikut masuk)
    const payload: Prisma.MonthlyEvaluationUpdateInput = {
      taskAvg,
      attendancePoin,
      maxAttendPoin,
      attitudeAvg,
      // Gunakan trik spread + pengecekan khusus untuk field opsional seperti notes
      ...(data.notes !== undefined && { notes: data.notes }),

      // Gabungkan hasil kalkulasi akhir
      ...calculated
    };

    return await this.repo.update(id, payload);
  }

  async delete(id: string) {
    await this.getById(id); // Pastikan data ada sebelum dihapus
    return await this.repo.delete(id);
  }

  async getMonthlyEvaluationStats() {
    const rawStats = await this.repo.stats();

    // Merapikan nilai rata-rata (jika kosong/null, jadikan 0)
    const averageScores = {
      task: rawStats.averages._avg.taskAvg ? parseFloat(rawStats.averages._avg.taskAvg.toFixed(2)) : 0,
      attitude: rawStats.averages._avg.attitudeAvg ? parseFloat(rawStats.averages._avg.attitudeAvg.toFixed(2)) : 0,
      final: rawStats.averages._avg.finalScore ? parseFloat(rawStats.averages._avg.finalScore.toFixed(2)) : 0,
    };

    // Merapikan format grouping bulan-tahun menjadi object JSON (misal: "4-2026": 150)
    const formattedByMonth = rawStats.byMonthYear.reduce((acc, curr) => {
      const key = `${curr.month}-${curr.year}`; // Format: Bulan-Tahun
      acc[key] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: rawStats.total,
      averageScores,
      evaluationsPerMonth: formattedByMonth
    };
  }
}
