import type { NextFunction, Request, Response } from "express";


export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.error(err);
    return res.status(500).json({ 
        error: { 
            code: "INTERNAL", 
            message: "Internal Server Error" 
        } 
    });
}