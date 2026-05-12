import type { Request, Response } from "express";
import { AssignmentService } from "./assignment.service.js";
import { successResponse } from "../../utils/response.js";

export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  getAllAssignments = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const filter = req.query.filter as string;
    const result = await this.assignmentService.getAllAssignments({ page, limit, search, filter });
    successResponse(res, "Daftar penugasan berhasil diambil", result, null, 200);
  };

  getAssignmentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.assignmentService.getAssignmentById(id as string);
    successResponse(res, "Detail penugasan berhasil diambil", result, null, 200);
  };

  createAssignment = async (req: Request, res: Response) => {
    const result = await this.assignmentService.createAssignment(req.body);
    successResponse(res, "Penugasan berhasil dibuat", result, null, 201);
  };

  updateAssignment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.assignmentService.updateAssignment(id as string, req.body);
    successResponse(res, "Penugasan berhasil diperbarui", result, null, 200);
  };

  deleteAssignment = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.assignmentService.deleteAssignment(id as string);
    successResponse(res, "Penugasan berhasil dihapus", null, null, 200);
  };

  getAssignmentStats = async (req: Request, res: Response) => {
    const result = await this.assignmentService.getAssignmentStats();
    successResponse(res, "Statistik penugasan berhasil diambil", result, null, 200);
  };
}
