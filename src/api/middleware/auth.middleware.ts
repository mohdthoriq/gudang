import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../utils/env.js';
import { errorResponse } from '../utils/response.js';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        const err = new Error("Token tidak ditemukan") as Error & { statusCode?: number };
        err.statusCode = 401;
        throw err;
    }

    const token = authHeader?.split(' ')[1];

    try {
        const payload = jwt.verify(token!, config.JWT_SECRET as string) as { id: string, role: string };

        req.user = payload;

        next();
    } catch (error) {
        errorResponse(res, "Token tidak valid", 401);
    }
};
