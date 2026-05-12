// src/modules/monthlyEvaluation/monthlyEvaluation.schema.ts
import { z } from 'zod';

export const createEvaluationSchema = z.object({
  santriId: z.string().uuid("Format ID Santri tidak valid"),
  classId: z.string().uuid("Format ID Kelas tidak valid"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  taskAvg: z.number().min(0).max(100).default(0),
  attendancePoin: z.number().min(0).default(0),
  maxAttendPoin: z.number().min(0).default(0),
  attitudeAvg: z.number().min(0).max(100).default(0),
  notes: z.string().optional()
});

export const updateEvaluationSchema = createEvaluationSchema.partial().omit({
  santriId: true, // Tidak boleh ganti santri saat update
  classId: true,
  month: true,
  year: true
});

export type ICreateEvaluation = z.infer<typeof createEvaluationSchema>;
export type IUpdateEvaluation = z.infer<typeof updateEvaluationSchema>;
