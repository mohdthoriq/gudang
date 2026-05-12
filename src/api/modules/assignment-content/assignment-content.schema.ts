import { z } from "zod";

export const contentTypeEnum = z.enum(["VIDEO", "FOTO", "TEXT"]);
export const gradingStatusEnum = z.enum(["PENDING", "GRADED"]);

export const submitAssignmentSchema = z.object({
  assignmentId: z.string().uuid("assignmentId harus berupa UUID yang valid"),
  santriId: z.string().uuid("santriId harus berupa UUID yang valid"),
  contentType: contentTypeEnum,
  fileUrl: z.array(z.string().url("Setiap fileUrl harus berupa URL yang valid")),
});

export const gradeSubmissionSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  mentorFeedback: z.string().optional(),
  status: gradingStatusEnum.optional(),
});

export type ISubmitAssignmentData = z.infer<typeof submitAssignmentSchema>;
export type IGradeSubmissionData = z.infer<typeof gradeSubmissionSchema>;
