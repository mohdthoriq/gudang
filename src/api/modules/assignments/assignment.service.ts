import { AssignmentRepository } from "./assignment.repo.js";
import type { ICreateAssignmentData, IUpdateAssignmentData } from "./assignment.schema.js";

export class AssignmentService {
  constructor(private assignmentRepo: AssignmentRepository) {}

  async getAllAssignments(params: { page: number; limit: number; search?: string; filter?: string }) {
    const { page, limit, search, filter } = params;
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.assignmentRepo.findAll(skip, take, search, filter);
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

  async getAssignmentById(id: string) {
    const assignment = await this.assignmentRepo.findById(id);
    if (!assignment) throw new Error("Penugasan tidak ditemukan");
    return assignment;
  }

  async createAssignment(data: ICreateAssignmentData) {
    return await this.assignmentRepo.create({
      title: data.title,
      description: data.description ?? null,
      submissionType: data.submissionType,
      attachmentUrl: data.attachmentUrl ?? null,
      due_date: new Date(data.due_date),
      class: { connect: { id: data.classId } },
      mentor: { connect: { id: data.mentorId } },
    });
  }

  async updateAssignment(id: string, data: IUpdateAssignmentData) {
    const existing = await this.assignmentRepo.findById(id);
    if (!existing) throw new Error("Penugasan tidak ditemukan");

    // Pre-processing to avoid Prisma issues with undefined values
    const payload: any = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.description !== undefined) payload.description = data.description;
    if (data.submissionType !== undefined) payload.submissionType = data.submissionType;
    if (data.attachmentUrl !== undefined) payload.attachmentUrl = data.attachmentUrl;
    if (data.due_date !== undefined) payload.due_date = new Date(data.due_date);

    return await this.assignmentRepo.update(id, payload);
  }

  async deleteAssignment(id: string) {
    const existing = await this.assignmentRepo.findById(id);
    if (!existing) throw new Error("Penugasan tidak ditemukan");

    return await this.assignmentRepo.delete(id);
  }

  async getAssignmentStats() {
    const rawStats = await this.assignmentRepo.stats();

    // Merapikan format array dari Prisma menjadi object JSON
    const formattedByType = rawStats.bySubmissionType.reduce((acc, curr) => {
      // curr.submissionType berisi 'TEXT' atau 'FILE'
      acc[curr.submissionType] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: rawStats.totalAssignments,
      bySubmissionType: formattedByType
    };
  }
}
