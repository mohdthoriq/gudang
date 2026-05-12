import type { NextFunction, Request, Response } from "express"
import { ZodError, type ZodSchema } from "zod"
import { errorResponse } from "./response.js"

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body)
            return next()
        } catch (error) {
            if (error instanceof ZodError) {
                const errorList = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
                return errorResponse(res, 'Validation Error', 400, errorList)
            }
            return next(error)
        }
    }
}