import { z } from "zod";

export const attendanceStatusEnum = z.enum(["HADIR", "SAKIT", "IZIN", "ALFA"]);

export const markAttendanceSchema = z.object({
  classId: z.string().uuid("classId harus berupa UUID yang valid"),
  santriId: z.string().uuid("santriId harus berupa UUID yang valid"),
  mentorId: z.string().uuid("mentorId harus berupa UUID yang valid"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  }),
  status: attendanceStatusEnum,
  notes: z.string().optional(),
  imageUrl: z.string().url("imageUrl harus berupa URL yang valid").optional().or(z.literal("")),
});

export const updateAttendanceSchema = z.object({
  status: attendanceStatusEnum.optional(),
  notes: z.string().optional(),
  imageUrl: z.string().url("imageUrl harus berupa URL yang valid").optional().or(z.literal("")),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  }).optional(),
});

export type IMarkAttendanceData = z.infer<typeof markAttendanceSchema>;
export type IUpdateAttendanceData = z.infer<typeof updateAttendanceSchema>;
