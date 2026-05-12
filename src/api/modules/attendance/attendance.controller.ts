import type { Request, Response } from "express";
import { AttendanceService } from "./attendance.service.js";
import { successResponse } from "../../utils/response.js";

export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  getAllAttendances = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const filter = req.query.filter as string;
    const result = await this.attendanceService.getAllAttendances({ page, limit, search, filter });
    successResponse(res, "Daftar absensi berhasil diambil", result, null, 200);
  };

  getAttendanceById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.attendanceService.getAttendanceById(id as string);
    successResponse(res, "Detail absensi berhasil diambil", result, null, 200);
  };

  markAttendance = async (req: Request, res: Response) => {
    const result = await this.attendanceService.markAttendance(req.body);
    successResponse(res, "Absensi berhasil dicatat", result, null, 201);
  };

  updateAttendance = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.attendanceService.updateAttendance(id as string, req.body);
    successResponse(res, "Data absensi berhasil diperbarui", result, null, 200);
  };

  deleteAttendance = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.attendanceService.deleteAttendance(id as string);
    successResponse(res, "Data absensi berhasil dihapus", null, null, 200);
  };

  getAttendanceStats = async (req: Request, res: Response) => {
    const result = await this.attendanceService.getAttendanceStats();
    successResponse(res, "Statistik absensi berhasil diambil", result, null, 200);
  };
}
