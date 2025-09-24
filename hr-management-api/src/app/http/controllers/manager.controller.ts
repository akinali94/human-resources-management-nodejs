import type { Request, Response } from "express";
import { UserPrismaRepo } from "../../../infra/repositories/user.prisma.repo.js";
import { CreateEmployeeBodySchema, UpdateEmployeeBodySchema } from "../dtos/manager.dto.js";
import { toCreateUserInputFromEmployeeBody, toUpdateUserInputFromEmployeeBody } from "../mappers/manager.mapper.js";
import { generatePassword } from "../../../utils/password.js";
import { UserLimitedInfoDto, UserPublicDto } from "../dtos/users.dto.js";
import { CompanyPrismaRepo } from "../../../infra/repositories/company.prisma.repo.js";


const userRepo = new UserPrismaRepo();
const companyRepo = new CompanyPrismaRepo();

export async function getMyManagerInfo(req: Request, res: Response) {
  const userId = req.auth?.userId;
  if (!userId)
    return res.status(401).json({ error: "Unauthorized" });
  const user = await userRepo.findById(userId);
  if (!user) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Manager not found" } });
  if (user.role !== "Manager") {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Manager not found" } });
  }
  const company = await companyRepo.findById(user.companyId)
  const dto = UserLimitedInfoDto(user);
  dto.companyName = company?.name ?? "";

  return res.json(dto)

}

export async function listEmployeesByCompany(req: Request, res: Response) {

    const userId = req.auth?.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const user = await userRepo.findById(userId);
    if (!user)
        return res.status(401).json({ error: "User not found" });
    const items = await userRepo.listEmployeesByCompany(user.companyId);
    const safeItems = items.map(UserPublicDto);
    return res.json({ items: safeItems });
}

export async function getEmployee(req: Request, res: Response) {
  const id = (req.params?.id ?? "").toString().trim();
  if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });

  const u = await userRepo.findById(id);
  if (!u) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Manager not found" } });
  if (u.role !== "Employee") {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Employee not found" } });
  }

  const company = await companyRepo.findById(u.companyId)
  const dto = UserPublicDto(u);
  dto.companyName = company?.name ?? "";

  return res.json(dto);
}

export async function updateEmployee(req: Request, res: Response) {
  const id = (req.params?.id ?? "").toString().trim();
  if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });

  try {
    const parsed = UpdateEmployeeBodySchema.parse(req.body);

    const existing = await userRepo.findById(id);
    if (!existing) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    if (existing.role !== "Employee") {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "User is not an Employee" } });
    }

    const role = "Employee";
    const companyId = existing.companyId;

    const input = toUpdateUserInputFromEmployeeBody(parsed, role, companyId);

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

export async function createEmployee(req: Request, res: Response) {
  try{
    const parsed = CreateEmployeeBodySchema.parse(req.body);
    
    const userId = req.auth?.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });

    const user = await userRepo.findById(userId);
    if (!user) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    const compId = user?.companyId;

    const rawPassword = generatePassword(8);
    const role = "Employee";
    const companyId = compId;
    const advanceAmount = 0;
    const maxAdvanceAmount = parsed.salary * 2 / 3;

    const input = toCreateUserInputFromEmployeeBody({
      body: parsed,
      rawPassword: rawPassword,
      role,
      companyId,
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

export async function deleteEmployee(req: Request, res: Response) {
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