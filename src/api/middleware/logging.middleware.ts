import type { NextFunction, Request, Response } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`Request masuk : ${req.method} ${req.path}`);
    req.startTime = Date.now();
    next();
}