import { Prisma, PrismaClient } from "../../../generated/index.js"

export class DailyJournalRepo {
    constructor(private prisma: PrismaClient) { }

    async findAll(params: {
        skip: number;
        take:number;
        where: Prisma.DailyJournalWhereInput
    }) {
        const { skip, take, where } = params;

        const [data, total] = await this.prisma.$transaction([
            this.prisma.dailyJournal.findMany({
                skip,
                take,
                where,
                include: {
                    santri: {
                        select: {
                            fullName: true,
                            nis: true
                        }
                    },
                    mentor : {
                        select : {
                            fullName: true
                        }
                    },
                    class: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    date: 'desc'
                }
            }),
            this.prisma.dailyJournal.count({
                where
            })
        ])
        return {data, total};
    }

    async findById(id: string) {
        return await this.prisma.dailyJournal.findUnique({
            where: { id },
            include: {
                santri: true,
                mentor: true,
                class: true
            }
        })
    }

    async create(data: Prisma.DailyJournalCreateInput) {
        return await this.prisma.dailyJournal.create({ data })
    }

    async update(id: string, data: Prisma.DailyJournalUpdateInput) {
        return await this.prisma.dailyJournal.update({
            where: { id },
            data
        })
    }

    async delete(id: string) {
        return await this.prisma.dailyJournal.delete({
            where: { id }
        })
    }

    async stats() {
    // 1. Hitung total semua jurnal harian
    const total = await this.prisma.dailyJournal.count();
    
    // 2. Kelompokkan jumlah jurnal berdasarkan tipe tugas
    const byTugasType = await this.prisma.dailyJournal.groupBy({
      by: ['tugasType'],
      _count: {
        id: true
      }
    });

    // 3. Hitung rata-rata nilai sikap (attitudeScore) dari seluruh data
    const averageAttitude = await this.prisma.dailyJournal.aggregate({
      _avg: {
        attitudeScore: true
      }
    });

    return { total, byTugasType, averageAttitude };
  }
}