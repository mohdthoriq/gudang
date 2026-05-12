// src/modules/monthlyEvaluation/monthlyEvaluation.repo.ts
import { PrismaClient, Prisma } from "../../../generated/index.js";

export class MonthlyEvaluationRepo {
  constructor(private prisma: PrismaClient) {}

  async findAll(params: { skip: number; take: number; where: Prisma.MonthlyEvaluationWhereInput }) {
    const { skip, take, where } = params;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.monthlyEvaluation.findMany({
        skip,
        take,
        where,
        include: {
          santri: { select: { fullName: true, nis: true } },
          class: { select: { name: true } }
        },
        orderBy: [{ year: 'desc' }, { month: 'desc' }]
      }),
      this.prisma.monthlyEvaluation.count({ where })
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return await this.prisma.monthlyEvaluation.findUnique({
      where: { id },
      include: {
        santri: { select: { fullName: true, nis: true } },
        class: { select: { name: true } }
      }
    });
  }

  // Menggunakan upsert untuk menghindari error duplikasi bulan yang sama
  async upsert(data: Prisma.MonthlyEvaluationUncheckedCreateInput) {
    return await this.prisma.monthlyEvaluation.upsert({
      where: {
        santriId_classId_month_year: {
          santriId: data.santriId,
          classId: data.classId,
          month: data.month,
          year: data.year
        }
      },
      update: data,
      create: data
    });
  }

  async update(id: string, data: Prisma.MonthlyEvaluationUpdateInput) {
    return await this.prisma.monthlyEvaluation.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return await this.prisma.monthlyEvaluation.delete({
      where: { id }
    });
  }

  async stats() {
    // 1. Hitung total semua evaluasi bulanan yang pernah dibuat
    const total = await this.prisma.monthlyEvaluation.count();
    
    // 2. Hitung rata-rata dari masing-masing komponen nilai
    const averages = await this.prisma.monthlyEvaluation.aggregate({
      _avg: {
        taskAvg: true,
        attitudeAvg: true,
        finalScore: true,
      }
    });

    // 3. Kelompokkan jumlah evaluasi berdasarkan kombinasi Bulan dan Tahun
    const byMonthYear = await this.prisma.monthlyEvaluation.groupBy({
      by: ['month', 'year'],
      _count: {
        id: true
      },
      // Urutkan dari tahun dan bulan terbaru
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    });

    return { total, averages, byMonthYear };
  }
}
