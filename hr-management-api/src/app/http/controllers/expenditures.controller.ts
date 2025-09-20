import type { Request, Response } from "express";
import {
  CreateExpenditureRequestBody,
  ApproveExpenditureBody,
  RejectExpenditureBody,
} from "../dtos/expenditures.dto.js";
import { ExpenditurePrismaRepo } from "../../../infra/repositories/expenditure.prisma.repo.js";
import type { ExpenditureApprovalStatus } from "../../../domain/expenditure/expenditure.entity.ts";

const repo = new ExpenditurePrismaRepo();

const ALLOWED_STATUSES: ReadonlySet<ExpenditureApprovalStatus> =
  new Set(["Pending", "Approved", "Rejected"]);

function requireIdParam(req: Request): string | null {
  const id = (req.params?.id ?? "").toString().trim();
  return id.length > 0 ? id : null;
}

function sanitizeType(t: any) {
  return {
    id: t.id,
    name: t.name,
    minPrice: t.minPrice ?? null,
    maxPrice: t.maxPrice ?? null,
  };
}

function sanitizeReq(r: any) {
  return {
    id: r.id,
    title: r.title,
    currency: r.currency ?? null,
    amount: r.amount,
    imageUrl: r.imageUrl ?? null,
    expenditureTypeId: r.expenditureTypeId,
    employeeId: r.employeeId,
    status: r.status,
    requestDate: r.requestDate,
    approvalDate: r.approvalDate ?? null,
    managerId: r.managerId ?? null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

// ---- TYPES ----
export async function listTypes(_req: Request, res: Response) {
  const items = await repo.listTypes();
  return res.json({ items: items.map(sanitizeType) });
}

// ---- REQUESTS (Employee) ----
export async function listMyRequests(
  req: Request & { auth?: { userId: string } },
  res: Response
) {
  if (!req.auth)
    return res
      .status(401)
      .json({ error: { code: "UNAUTHORIZED", message: "No session" } });

  const status = req.query.status as ExpenditureApprovalStatus | undefined;
  const items = await repo.listRequestsByEmployee(
    req.auth.userId,
    status && ALLOWED_STATUSES.has(status) ? status : undefined
  );
  return res.json({ items: items.map(sanitizeReq) });
}

export async function createRequest(
  req: Request & { auth?: { userId: string } },
  res: Response
) {
  try {
    if (!req.auth)
      return res
        .status(401)
        .json({ error: { code: "UNAUTHORIZED", message: "No session" } });

    const body = CreateExpenditureRequestBody.parse(req.body);

    const created = await repo.createRequest({
      employeeId: req.auth.userId,
      title: body.title,
      currency: body.currency ?? null,
      amount: body.amount,
      imageUrl: body.imageUrl ?? null, 
      expenditureTypeId: body.expenditureTypeId,
    });

    return res
      .status(201)
      .json({ id: created.id, status: created.status, createdAt: created.createdAt });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res
        .status(400)
        .json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
    console.error(err);
    return res
      .status(500)
      .json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}

// ---- REQUESTS (Manager/Admin) ----
export async function listPendingRequests(_req: Request, res: Response) {
  const items = await repo.listRequestsByStatus("Pending");
  return res.json({ items: items.map(sanitizeReq) });
}

export async function approveRequest(
  req: Request & { auth?: { userId: string } },
  res: Response
) {
  try {
    const id = requireIdParam(req);
    if (!id)
      return res
        .status(400)
        .json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });

    const body = ApproveExpenditureBody.parse(req.body);

    const ok = await repo.approveRequest(id, {
      managerId: req.auth!.userId,
      decisionNote: body.decisionNote ?? null,
    });
    if (!ok)
      return res
        .status(409)
        .json({ error: { code: "CONFLICT", message: "Cannot approve" } });

    return res.json({ id, status: "Approved" });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res
        .status(400)
        .json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
    console.error(err);
    return res
      .status(500)
      .json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}

export async function rejectRequest(
  req: Request & { auth?: { userId: string } },
  res: Response
) {
  try {
    const id = requireIdParam(req);
    if (!id)
      return res
        .status(400)
        .json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });

    const body = RejectExpenditureBody.parse(req.body);

    const ok = await repo.rejectRequest(id, {
      managerId: req.auth!.userId,
      decisionNote: body.decisionNote ?? null,
    });
    if (!ok)
      return res
        .status(409)
        .json({ error: { code: "CONFLICT", message: "Cannot reject" } });

    return res.json({ id, status: "Rejected" });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res
        .status(400)
        .json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
    console.error(err);
    return res
      .status(500)
      .json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}

export async function requestDetail(
  req: Request & { auth?: { userId: string; role?: string } },
  res: Response
) {
  const id = requireIdParam(req);
  if (!id)
    return res
      .status(400)
      .json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });

  const r = await repo.findRequestById(id);
  if (!r)
    return res
      .status(404)
      .json({ error: { code: "NOT_FOUND", message: "Expenditure request not found" } });

  // Erişim: employee → kendi talebi; manager/admin → hepsi
  const role = req.auth?.role;
  if (!role)
    return res
      .status(401)
      .json({ error: { code: "UNAUTHORIZED", message: "No session" } });
  if (role === "Employee" && r.employeeId !== req.auth!.userId) {
    return res.status(403).json({ error: { code: "FORBIDDEN", message: "Forbidden" } });
  }
  return res.json(sanitizeReq(r));
}
