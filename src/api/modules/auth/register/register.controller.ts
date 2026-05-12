import { registerService } from "./register.service.js";
import type { IRegisterData } from "./register.schema.js";
import type { Request, Response } from "express";
import { successResponse } from "../../../utils/response.js";

export const registerController = async (req: Request, res: Response) => {
    const data: IRegisterData = req.body;
    const result = await registerService(data);
    successResponse(res, "Register success", result, null, 201);
}