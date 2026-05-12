import type { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { successResponse, errorResponse } from "../../../utils/response.js"; 

export class UserController {
  constructor(private userService: UserService) { }

  getAllUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const role = req.query.role as string;

    let isActive: boolean | undefined;
    if (req.query.isActive === "true") isActive = true;
    else if (req.query.isActive === "false") isActive = false;

    const result = await this.userService.getAllUsers({page, limit, search, role, isActive});
    successResponse(res, "Data user berhasil diambil", result.data, result.meta, 200);
  };

  getUserById = async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await this.userService.getUserById(id as string);
      successResponse(res, "Data user berhasil diambil", result, null, 200);
  };

  createUser = async (req: Request, res: Response) => {
      const result = await this.userService.createUser(req.body);
      successResponse(res, "User berhasil dibuat", result, null, 201);
  };

  updateUser = async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await this.userService.updateUser(id as string, req.body);
      successResponse(res, "User berhasil diupdate", result, null, 200);
  };

  deleteUser = async (req: Request, res: Response) => {
      const { id } = req.params;
      await this.userService.deleteUser(id as string);
      successResponse(res, "User berhasil dihapus", null, null, 200);
  };

  getStats = async (req: Request, res: Response) => {
    const result = await this.userService.getStats(); 
    successResponse(res, "Statistik pengguna berhasil diambil", result, null, 200);
  };
}
