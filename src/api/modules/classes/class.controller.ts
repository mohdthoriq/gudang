import type { Request, Response } from "express";
import { ClassService } from "./class.service.js";
import { successResponse } from "../../utils/response.js";

export class ClassController {
  constructor(private classService: ClassService) {}

  getAllClasses = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const filter = req.query.filter as string;
    const result = await this.classService.getAllClasses({ page, limit, search, filter });
    successResponse(res, "Daftar kelas berhasil diambil", result, null, 200);
  };

  getClassById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.classService.getClassById(id as string);
    successResponse(res, "Detail kelas berhasil diambil", result, null, 200);
  };

  createClass = async (req: Request, res: Response) => {
    const result = await this.classService.createClass(req.body);
    successResponse(res, "Kelas berhasil dibuat", result, null, 201);
  };

  updateClass = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.classService.updateClass(id as string, req.body);
    successResponse(res, "Kelas berhasil diperbarui", result, null, 200);
  };

  deleteClass = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.classService.deleteClass(id as string);
    successResponse(res, "Kelas berhasil dihapus", null, null, 200);
  };

  getClassStats = async (req: Request, res: Response) => {
    const result = await this.classService.getClassStats();
    successResponse(res, "Statistik kelas berhasil diambil", result, null, 200);
  };
}
