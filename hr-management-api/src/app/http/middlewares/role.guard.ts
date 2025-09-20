import type { NextFunction, Request, Response } from "express";


export function requireRole(...roles: string[]) {
    return (req: Request & { auth?: { role?: string } }, res: Response, next: NextFunction) => {
        const role = req.auth?.role;
        if (!role)
            return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });
        if (!roles.includes(role))
            return res.status(403).json({ error: { code: "FORBIDDEN", message: "Insufficient role" } });
        next();
    };
}