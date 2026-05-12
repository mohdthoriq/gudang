// src/modules/dailyJournal/dailyJournal.controller.ts
import type { Request, Response } from "express";
import { DailyJournalService } from "./dailyJourney.service.js";
import { successResponse } from "../../utils/response.js";

export class DailyJournalController {
  constructor(private service: DailyJournalService) {}

  getAll = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { search, classId, date } = req.query;

    const result = await this.service.getAllJournals({
      page,
      limit,
      search: search as string,
      classid: classId as string,
      date: date as string
    });

    successResponse(res, "Data jurnal harian berhasil diambil", result.data, result.meta, 200);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.service.findById(id as string);
    successResponse(res, "Detail jurnal berhasil diambil", result, null, 200);
  };

  create = async (req: Request, res: Response) => {
    const mentorId = (req as any).user.id; 
    const result = await this.service.create(mentorId, req.body);
    successResponse(res, "Jurnal harian berhasil dicatat", result, null, 201);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.service.update(id as string, req.body);
    successResponse(res, "Jurnal harian berhasil diperbarui", result, null, 200);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.delete(id as string);
    successResponse(res, "Jurnal harian berhasil dihapus", null, null, 200);
  };

  getDailyJournalStats = async (req: Request, res: Response) => {
    const result = await this.service.getDailyJournalStats();
    successResponse(res, "Statistik jurnal harian berhasil diambil", result, null, 200);
  };
}