import type { Request, Response } from "express";
import { UserPrismaRepo } from "../../../infra/repositories/user.prisma.repo.js";
import { CreateManagerBodySchema, UpdateManagerBodySchema } from "../dtos/admin.dto.js";
import { toCreateUserInputFromManagerBody, toUpdateUserInputFromManagerBody } from "../mappers/admin.mapper.js";
import { generatePassword } from "../../../utils/password.js";
import { UserPublicDto } from "../dtos/users.dto.js";
import { CompanyPrismaRepo } from "../../../infra/repositories/company.prisma.repo.js";

const userRepo = new UserPrismaRepo();
const companyRepo = new CompanyPrismaRepo();

export async function listManagers(_req: Request, res: Response) {
  const items = await userRepo.listManagers();
  const safeItems = items.map(UserPublicDto);
  return res.json({ items: safeItems });
}

export async function getManager(req: Request, res: Response) {
  const id = (req.params?.id ?? "").toString().trim();
  if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });

  const u = await userRepo.findById(id);
  if (!u) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Manager not found" } });
  if (u.role !== "Manager") {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Manager not found" } });
  }

  const company = await companyRepo.findById(u.companyId)
  const dto = UserPublicDto(u);
  dto.companyName = company?.name ?? "";

  return res.json(dto);
}

export async function updateManager(req: Request, res: Response) {
  const id = (req.params?.id ?? "").toString().trim();
  if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });

  try {
    const parsed = UpdateManagerBodySchema.parse(req.body);

    const existing = await userRepo.findById(id);
    if (!existing) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    if (existing.role !== "Manager") {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "User is not a Manager" } });
    }

    const input = toUpdateUserInputFromManagerBody(parsed);

    const updated = await userRepo.update(id, input);
    return res.json(UserPublicDto(updated));
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
    console.error(err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}

export async function createManager(req: Request, res: Response) {
  try{
    const parsed = CreateManagerBodySchema.parse(req.body);
    
    const rawPassword = generatePassword(8);

    const role = "Manager";
    const advanceAmount = 0;
    const maxAdvanceAmount = parsed.salary * 2 / 3;

    const input = toCreateUserInputFromManagerBody({
      body: parsed,
      rawPassword: rawPassword,
      role,
      advanceAmount,
      maxAdvanceAmount,
    })

    const created = await userRepo.create(input);

    return res.status(201).json(UserPublicDto(created));
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
    console.error(err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}

export async function deleteManager(req: Request, res: Response) {
  const id = (req.params?.id ?? "").toString().trim();
  if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });

  try{

    const deleted = await userRepo.delete(id);

    return res.status(201).json(deleted.id);
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
    console.error(err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}