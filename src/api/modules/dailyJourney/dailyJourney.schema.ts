// src/modules/dailyJournal/dailyJournal.schema.ts
import { z } from 'zod';

export const createDailyJournalSchema = z.object({
  santriId: z.string().uuid(),
  classId: z.string().uuid(),
  attitudeScore: z.number().min(0).max(100),
  tugasType: z.enum(["HARIAN", "MINGGUAN", "BULANAN"]),
  notes: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format harus YYYY-MM-DD"),
});

export const updateDailyJournalSchema = createDailyJournalSchema.partial();

export type ICreateDailyJournal = z.infer<typeof createDailyJournalSchema>;
export type IUpdateDailyJournal = z.infer<typeof updateDailyJournalSchema>;
