import type { Request, Response } from "express";
import { DivisionService } from "./division.service.js";
import { successResponse } from "../../utils/response.js";

export class DivisionController {
  constructor(private divisionService: DivisionService) {}

  getAllDivisions = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const filter = req.query.filter as string;
    const result = await this.divisionService.getAllDivisions({ page, limit, search, filter });
    successResponse(res, "Daftar divisi berhasil diambil", result, null, 200);
  };

  getDivisionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.divisionService.getDivisionById(id as string);
    successResponse(res, "Detail divisi berhasil diambil", result, null, 200);
  };

  createDivision = async (req: Request, res: Response) => {
    const result = await this.divisionService.createDivision(req.body);
    successResponse(res, "Divisi berhasil dibuat", result, null, 201);
  };

  updateDivision = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.divisionService.updateDivision(id as string, req.body);
    successResponse(res, "Divisi berhasil diperbarui", result, null, 200);
  };

  deleteDivision = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.divisionService.deleteDivision(id as string);
    successResponse(res, "Divisi berhasil dihapus", null, null, 200);
  };

  getDivisionStats = async (req: Request, res: Response) => {
    const result = await this.divisionService.getDivisionStats();
    successResponse(res, "Statistik divisi berhasil diambil", result, null, 200);
  };
}
