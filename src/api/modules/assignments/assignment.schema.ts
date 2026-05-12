import { z } from "zod";

export const submissionTypeEnum = z.enum(["TEXT", "FILE"]);

export const createAssignmentSchema = z.object({
  classId: z.string().uuid("classId harus berupa UUID yang valid"),
  mentorId: z.string().uuid("mentorId harus berupa UUID yang valid"),
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  submissionType: submissionTypeEnum,
  attachmentUrl: z.string().url("attachmentUrl harus berupa URL yang valid").optional().or(z.literal("")),
  due_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  }),
});

export const updateAssignmentSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").optional(),
  description: z.string().optional(),
  submissionType: submissionTypeEnum.optional(),
  attachmentUrl: z.string().url("attachmentUrl harus berupa URL yang valid").optional().or(z.literal("")),
  due_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  }).optional(),
});

export type ICreateAssignmentData = z.infer<typeof createAssignmentSchema>;
export type IUpdateAssignmentData = z.infer<typeof updateAssignmentSchema>;
