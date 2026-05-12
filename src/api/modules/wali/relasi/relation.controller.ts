import type { Request, Response } from "express";
import { WaliRelationService } from "./relation.service.js";
import { successResponse } from "../../../utils/response.js"; // Sesuaikan path

export class WaliRelationController {
  constructor(private service: WaliRelationService) {}

  getAllRelations = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const filter = req.query.filter as string;
    const result = await this.service.getAllRelations({ page, limit, search, filter });
    
    // Asumsi: successResponse(res, message, data, meta, statusCode)
    return successResponse(res, "Berhasil mengambil data relasi", result.data, result.meta, 200);
  };

  createRelation = async (req: Request, res: Response) => {
    const result = await this.service.createRelation(req.body);
    return successResponse(res, "Relasi berhasil ditambahkan", result, null, 201);
  };

  updateRelation = async (req: Request, res: Response) => {
    const { id } = req.params; // Ini adalah ID Relasi (Primary Key)
    const result = await this.service.updateRelation(id as string, req.body);
    return successResponse(res, "Relasi berhasil diupdate", result, null, 200);
  };

  deleteRelation = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.deleteRelation(id as string);
    return successResponse(res, "Relasi berhasil dihapus", null, null, 200);
  };

  getRelationStats = async (req: Request, res: Response) => {
    const result = await this.service.getRelationStats(); 
    successResponse(res, "Statistik relasi wali dan santri berhasil diambil", result, null, 200);
  };
}
