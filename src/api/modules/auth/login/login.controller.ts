import type { Request, Response } from "express";
import { loginService, refreshTokenService } from "./login.service.js";
import type { ILoginData } from "./login.schema.js";
import { successResponse } from "../../../utils/response.js";

export const loginController = async (req: Request, res: Response) => {
    const data: ILoginData = req.body;
    const result = await loginService(data);
    successResponse(res, "Login success", result);
} 

export const refreshTokenController = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    const result = await refreshTokenService(refreshToken);
    successResponse(res, "Refresh token success", result);
} 