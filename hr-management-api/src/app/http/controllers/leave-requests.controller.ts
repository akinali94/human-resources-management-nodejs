import type { Request, Response } from "express";
import { CreateLeaveRequestBody, ApproveBody, RejectBody } from "../dtos/leave-request.dto.js"
import { LeaveRequestPrismaRepo } from "../../../infra/repositories/leave-request.prisma.repo.js";
import { LeaveTypePrismaRepo } from "../../../infra/repositories/leave-types.prisma.repo.js";
import type { LeaveStatus } from "../../../domain/leave-request/leave-request.entity.js";


const leaveRepo = new LeaveRequestPrismaRepo();
const leaveTypeRepo = new LeaveTypePrismaRepo();

const ALLOWED_STATUSES = new Set(["Draft", "Submitted", "Approved", "Rejected"]);

function daysBetweenInclusive(startISO: string, endISO: string): number {
    const s = new Date(startISO);
    const e = new Date(endISO);
    const ms = e.getTime() - s.getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
    return days;
}


function sanitize(lr: any) {
    return {
        id: lr.id,
        employeeId: lr.employeeId,
        leaveTypeId: lr.leaveTypeId,
        startDate: (lr.startDate instanceof Date ? lr.startDate : new Date(lr.startDate)).toISOString().slice(0, 10),
        endDate: (lr.endDate instanceof Date ? lr.endDate : new Date(lr.endDate)).toISOString().slice(0, 10),
        reason: lr.reason,
        status: lr.status,
        managerId: lr.managerId ?? null,
        decisionNote: lr.decisionNote ?? null,
        createdAt: lr.createdAt,
        updatedAt: lr.updatedAt,
        numberOfDaysOff: daysBetweenInclusive(
            (lr.startDate instanceof Date ? lr.startDate : new Date(lr.startDate)).toISOString(),
            (lr.endDate instanceof Date ? lr.endDate : new Date(lr.endDate)).toISOString()
        ),
    };
}

function requireIdParam(req: Request): string | null {
    const id = (req.params?.id ?? "").toString().trim();
    return id.length > 0 ? id : null;
}



export async function listMy(req: Request & { auth?: { userId: string } }, res: Response) {
  if (!req.auth)
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });
  const status = req.query.status as LeaveStatus | undefined;

  const items = await leaveRepo.listByEmployee(req.auth.userId, status && ALLOWED_STATUSES.has(status) ? status : undefined);
  
  return res.json({ items: items.map(sanitize) });
}


export async function createDraft(req: Request & { auth?: { userId: string } }, res: Response) {
    try {
        if (!req.auth)
            return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });
        const body = CreateLeaveRequestBody.parse(req.body);

        const lt = await leaveTypeRepo.findById(body.leaveTypeId);
        if (!lt)
            return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid leaveTypeId" } });

        const created = await leaveRepo.createDraft({
            employeeId: req.auth.userId,
            leaveTypeId: body.leaveTypeId,
            startDate: body.startDate,
            endDate: body.endDate,
            reason: body.reason,
        });
        return res.status(201).json({ id: created.id, status: created.status, createdAt: created.createdAt });
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
        }
        console.error(err);
        return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
    }
}

export async function submit(req: Request & { auth?: { userId: string } }, res: Response) {
  if (!req.auth)
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });
  const id = requireIdParam(req)
  if (!id) 
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });
  const ok = await leaveRepo.submitDraft(id, req.auth.userId);
  if (!ok)
    return res.status(409).json({ error: { code: "CONFLICT", message: "Cannot submit" } });
  return res.json({ id, status: "Submitted" });
}

export async function listPending(_req: Request, res: Response) {
  const items = await leaveRepo.listByStatus("Submitted");
  return res.json({ items: items.map((x) => sanitize(x)) });
}

export async function approve(req: Request & { auth?: { userId: string } }, res: Response) {
  try {
    const id = requireIdParam(req)
    if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });
    const body = ApproveBody.parse(req.body);
    const ok = await leaveRepo.approve(id, req.auth!.userId, body.decisionNote ?? null);
    if (!ok)
        return res.status(409).json({ error: { code: "CONFLICT", message: "Cannot approve" } });
    return res.json({ id, status: "Approved" });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
    console.error(err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}

export async function reject(req: Request & { auth?: { userId: string } }, res: Response) {
  try {
    const id = requireIdParam(req);
    if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });
    const body = RejectBody.parse(req.body);
    const ok = await leaveRepo.reject(id, req.auth!.userId, body.decisionNote);
    if (!ok) return res.status(409).json({ error: { code: "CONFLICT", message: "Cannot reject" } });
    return res.json({ id, status: "Rejected" });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
    console.error(err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
  }
}

export async function detail(req: Request & { auth?: { userId: string; role?: string } }, res: Response) {
    const id = requireIdParam(req);
    if (!id) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "id param is required" } });
    const lr = await leaveRepo.findById(id);
    if (!lr) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Leave request not found" } });
    const role = req.auth?.role;
    if (!role) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });
    if (role === "Employee" && lr.employeeId !== req.auth!.userId) {
        return res.status(403).json({ error: { code: "FORBIDDEN", message: "Forbidden" } });
    }
    return res.json(sanitize(lr));
}