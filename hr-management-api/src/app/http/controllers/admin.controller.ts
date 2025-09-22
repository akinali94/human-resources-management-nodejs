import type { Request, Response } from "express";
import { UserPrismaRepo } from "../../../infra/repositories/user.prisma.repo.js";
import { UpdateManagerBody } from "../dtos/admin.dto.js";
import type { UpdateUserInput } from "../../../domain/user/user.entity.js";

const users = new UserPrismaRepo();

function sanitize(u: any) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    isActive: u.isActive,
    companyId: u.companyId ?? null,
    managerId: u.managerId ?? null,
  };
}

export async function listManagers(_req: Request, res: Response) {
  const items = await users.listManagers();
  return res.json({ items: items.map(sanitize) });
}

export async function getManager(req: Request, res: Response) {
  const id = (req.params?.id ?? "").toString().trim();
  if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });

  const u = await users.findById(id);
  if (!u) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Manager not found" } });
  if (u.role !== "Manager") {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Manager not found" } });
  }

  return res.json(sanitize(u));
}

export async function updateManager(req: Request, res: Response) {
  const id = (req.params?.id ?? "").toString().trim();
  if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });

  try {
    const body = UpdateManagerBody.parse(req.body);

    const existing = await users.findById(id);
    if (!existing) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    if (existing.role !== "Manager") {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "User is not a Manager" } });
    }

    const input: UpdateUserInput = {};
    if (body.email !== undefined) input.email = body.email;
    if (body.firstName !== undefined) input.firstName = body.firstName;
    if (body.lastName !== undefined) input.lastName = body.lastName;
    if (body.isActive !== undefined) input.isActive = body.isActive;
    if (body.managerId !== undefined) input.managerId = body.managerId ?? null;
    if (body.companyId !== undefined) input.companyId = body.companyId;
    if (body.role !== undefined) input.role = body.role; // "Manager"

    const updated = await users.update(id, input);
    return res.json(sanitize(updated));
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
    console.error(err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}