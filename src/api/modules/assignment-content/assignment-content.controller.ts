import type { Request, Response } from "express";
import { AssignmentContentService } from "./assignment-content.service.js";
import { successResponse } from "../../utils/response.js";
import type { ISubmissionQuery } from "./assignment-content.dto.js";

export class AssignmentContentController {
  constructor(private submissionService: AssignmentContentService) {}

  getSubmissions = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const filter = req.query.filter as string;
    const result = await this.submissionService.getAllSubmissions({ page, limit, search, filter });
    successResponse(res, "Daftar pengumpulan tugas berhasil diambil", result, null, 200);
  };

  getSubmissionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.submissionService.getSubmissionById(id as string);
    successResponse(res, "Detail pengumpulan tugas berhasil diambil", result, null, 200);
  };

  submitAssignment = async (req: Request, res: Response) => {
    const result = await this.submissionService.submitAssignment(req.body);
    successResponse(res, "Tugas berhasil dikumpulkan", result, null, 201);
  };

  gradeSubmission = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.submissionService.gradeSubmission(id as string, req.body);
    successResponse(res, "Pengumpulan tugas berhasil dinilai/diperbarui", result, null, 200);
  };

  deleteSubmission = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.submissionService.deleteSubmission(id as string);
    successResponse(res, "Pengumpulan tugas berhasil dihapus", null, null, 200);
  };

  getSubmissionsStats = async (req: Request, res: Response) => {
    const result = await this.submissionService.getSubmissionsStats();
    successResponse(res, "Statistik pengumpulan tugas berhasil diambil", result, null, 200);
  };
}
