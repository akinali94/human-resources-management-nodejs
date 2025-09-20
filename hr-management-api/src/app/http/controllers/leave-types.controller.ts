import type { Request, Response } from "express";
import { LeaveTypePrismaRepo } from "../../../infra/repositories/leave-types.prisma.repo.js";

const repo = new LeaveTypePrismaRepo();

function sanitize(t: any) {
  return {
    id: t.id,
    name: t.name,
    defaultDay: t.defaultDay ?? null,
    gender: t.gender ?? null,
  };
}

export async function list(_req: Request, res: Response) {
  const items = await repo.listAll();
  return res.json({ items: items.map(sanitize) });
}
