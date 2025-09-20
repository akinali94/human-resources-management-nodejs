import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../infra/db/prisma.client.js";

//Checks company id
export async function requireCompanyScope(req: Request & { auth?: { companyId?: string } }, res: Response, next: NextFunction) {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });
  }
  if (!req.auth.companyId) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Company scope missing" } });
  }
  const user = await prisma.user.findUnique({
    where: { id: req.auth.userId },
    select: { companyId: true },
  });
  if (!user?.companyId) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Company scope missing" } });
  }
  next();
}