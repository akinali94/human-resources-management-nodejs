import type { Request, Response } from "express";
import { CompanyPrismaRepo } from "../../../infra/repositories/company.prisma.repo.js"
import { CreateCompanyBody, UpdateCompanyBody } from "../dtos/company.dto.js"
import type { CreateCompanyInput, UpdateCompanyInput } from "../../../domain/company/company.entity.ts";

const repo = new CompanyPrismaRepo();

function sanitize(c: any) {
  return {
    id: c.id, name: c.name, title: c.title ?? null,
    mersisNo: c.mersisNo ?? null, taxNumber: c.taxNumber ?? null, logo: c.logo ?? null,
    telephoneNumber: c.telephoneNumber ?? null, address: c.address ?? null, email: c.email ?? null,
    employeeNumber: c.employeeNumber ?? null,
    foundationYear: c.foundationYear ?? null,
    contractStartDate: c.contractStartDate ?? null,
    contractEndDate: c.contractEndDate ?? null,
    isActive: !!c.isActive, createdAt: c.createdAt, updatedAt: c.updatedAt
  };
}


 function normalizeCreate(body: ReturnType<typeof CreateCompanyBody.parse>): CreateCompanyInput {
   return {
     name: body.name,
     title: body.title ?? null,
     mersisNo: body.mersisNo ?? null,
     taxNumber: body.taxNumber ?? null,
     logo: body.logo ?? null,
     telephoneNumber: body.telephoneNumber ?? null,
     address: body.address ?? null,
     email: body.email ?? null,
     employeeNumber: body.employeeNumber ?? null,
     foundationYear: body.foundationYear ?? null,
     contractStartDate: body.contractStartDate ?? null,
     contractEndDate: body.contractEndDate ?? null,
     // isActive prisma default:true; gönderildiyse kullan
     ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
   };
}

 function normalizeUpdate(body: ReturnType<typeof UpdateCompanyBody.parse>): UpdateCompanyInput {
   const out: UpdateCompanyInput = {};
   if (body.name !== undefined) out.name = body.name;
   if (body.title !== undefined) out.title = body.title ?? null;
   if (body.mersisNo !== undefined) out.mersisNo = body.mersisNo ?? null;
   if (body.taxNumber !== undefined) out.taxNumber = body.taxNumber ?? null;
   if (body.logo !== undefined) out.logo = body.logo ?? null;
   if (body.telephoneNumber !== undefined) out.telephoneNumber = body.telephoneNumber ?? null;
   if (body.address !== undefined) out.address = body.address ?? null;
   if (body.email !== undefined) out.email = body.email ?? null;
   if (body.employeeNumber !== undefined) out.employeeNumber = body.employeeNumber ?? null;
   if (body.foundationYear !== undefined) out.foundationYear = body.foundationYear ?? null;
   if (body.contractStartDate !== undefined) out.contractStartDate = body.contractStartDate ?? null;
   if (body.contractEndDate !== undefined) out.contractEndDate = body.contractEndDate ?? null;
   if (body.isActive !== undefined) out.isActive = body.isActive;
   return out;
 }

function requireIdParam(req: Request): string | null {
  const id = (req.params?.id ?? "").toString().trim();
  return id.length > 0 ? id : null;
}

// List
export async function list(_req: Request, res: Response) {
  const items = await repo.listAll();
  res.json({ items: items.map(sanitize) });
}

// Create (Admin)
export async function create(req: Request, res: Response) {
  try {
    const body = CreateCompanyBody.parse(req.body);
    const created = await repo.create(normalizeCreate(body));
    res.status(201).json(sanitize(created));
  } catch (err: any) {
    if (err?.name === "ZodError") return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    console.error(err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}

// Detail
export async function detail(req: Request, res: Response) {
  const id = requireIdParam(req);
  if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });
  const c = await repo.findById(id);
  if (!c) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Company not found" } });
  res.json(sanitize(c));
}

// Update (Admin)
export async function update(req: Request, res: Response) {
  try {
    const id = requireIdParam(req);
    if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });
    const body = UpdateCompanyBody.parse(req.body);
    const updated = await repo.update(id, normalizeUpdate(body));
    res.json(sanitize(updated));
  } catch (err: any) {
    if (err?.name === "ZodError") return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    console.error(err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}

// Delete (Admin)
export async function remove(req: Request, res: Response) {
  const id = requireIdParam(req);
  if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });
  await repo.delete(id);
  res.status(204).send();
}

export async function myCompany(req: Request & { auth?: { userId: string } }, res: Response) {
  if (!req.auth) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });
  // simple join: find user then company
  // (istersen UserPrismaRepo ile tek adımda çekebiliriz)
  const user = await (await import("../../../infra/db/prisma.client.js")).prisma.user.findUnique({
    where: { id: req.auth.userId }, select: { company: true }
  });
  if (!user?.company) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Company not found" } });
  res.json(sanitize(user.company));
}