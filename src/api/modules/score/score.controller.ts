// src/modules/monthlyEvaluation/monthlyEvaluation.controller.ts
import type { Request, Response } from "express";
import { MonthlyEvaluationService } from "./score.service.js";
import { successResponse } from "../../utils/response.js";
import { createEvaluationSchema, updateEvaluationSchema } from "./score.schema.js";

export class MonthlyEvaluationController {
  constructor(private service: MonthlyEvaluationService) {}

  getAll = async (req: Request, res: Response) => {
    const result = await this.service.getAll(req.query);
    successResponse(res, "Berhasil mengambil data evaluasi bulanan", result.data, result.meta, 200);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.service.getById(id as string);
    successResponse(res, "Detail evaluasi berhasil diambil", result, null, 200);
  };

  create = async (req: Request, res: Response) => {
    // Validasi Zod
    const validatedData = createEvaluationSchema.parse(req.body);
    
    const result = await this.service.create(validatedData);
    successResponse(res, "Evaluasi bulanan berhasil disimpan", result, null, 201);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    // Validasi Zod (Partial)
    const validatedData = updateEvaluationSchema.parse(req.body);
    
    const result = await this.service.update(id as string, validatedData);
    successResponse(res, "Evaluasi bulanan berhasil diperbarui", result, null, 200);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.delete(id as string);
    successResponse(res, "Evaluasi bulanan berhasil dihapus", null, null, 200);
  };

  getMonthlyEvaluationStats = async (req: Request, res: Response) => {
    const result = await this.service.getMonthlyEvaluationStats();
    successResponse(res, "Statistik evaluasi bulanan berhasil diambil", result, null, 200);
  };
}
