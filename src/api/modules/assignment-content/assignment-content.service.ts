import { AssignmentContentRepository } from "./assignment-content.repo.js";
import type { ISubmitAssignmentData, IGradeSubmissionData } from "./assignment-content.schema.js";
import type { ISubmissionQuery } from "./assignment-content.dto.js";
import type { Prisma } from "../../../generated/index.js";

export class AssignmentContentService {
  constructor(private submissionRepo: AssignmentContentRepository) {}

  async getAllSubmissions(params: { page: number; limit: number; search?: string; filter?: string }) {
    const { page, limit, search, filter } = params;
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.submissionRepo.findAll(skip, take, search, filter);
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

  async getSubmissionById(id: string) {
    const submission = await this.submissionRepo.findById(id);
    if (!submission) throw new Error("Pengumpulan tugas tidak ditemukan");
    return submission;
  }

  async submitAssignment(data: ISubmitAssignmentData) {
    const payload: Prisma.AssignmentContentCreateInput = {
        assignment: { connect: { id: data.assignmentId } },
        santri: { connect: { id: data.santriId } },
        contentType: data.contentType,
        fileUrl: data.fileUrl,
        status: "PENDING",
    };
    return await this.submissionRepo.create(payload);
  }

  async gradeSubmission(id: string, data: IGradeSubmissionData) {
    const existing = await this.submissionRepo.findById(id);
    if (!existing) throw new Error("Pengumpulan tugas tidak ditemukan");

    const payload: Prisma.AssignmentContentUpdateInput = {
      ...(data.score !== undefined && { score: data.score }),
      ...(data.mentorFeedback !== undefined && { mentorFeedback: data.mentorFeedback }),
      ...(data.status !== undefined && { status: data.status }),
    };

    return await this.submissionRepo.update(id, payload);
  }

  async deleteSubmission(id: string) {
    const existing = await this.submissionRepo.findById(id);
    if (!existing) throw new Error("Pengumpulan tugas tidak ditemukan");

    return await this.submissionRepo.delete(id);
  }

  async getSubmissionsStats() {
    const rawStats = await this.submissionRepo.stats();

    // Merapikan format dari array Prisma menjadi object JSON yang mudah dibaca frontend
    const formattedStats = rawStats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return formattedStats;
  }
}
