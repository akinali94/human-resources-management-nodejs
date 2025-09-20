import { prisma } from "../db/prisma.client.js";
import type { LeaveRequestRepo } from "../../domain/leave-request/leave-request.repo.js"
import type { LeaveRequestDomain, LeaveStatus } from "../../domain/leave-request/leave-request.entity.js"


function toDomain(lr: any): LeaveRequestDomain {
    return {
        id: lr.id,
        employeeId: lr.employeeId,
        leaveTypeId: lr.leaveTypeId,
        startDate: lr.startDate,
        endDate: lr.endDate,
        reason: lr.reason,
        status: lr.status,
        managerId: lr.managerId ?? null,
        decisionNote: lr.decisionNote ?? null,
        createdAt: lr.createdAt,
        updatedAt: lr.updatedAt,
    };
}


export class LeaveRequestPrismaRepo implements LeaveRequestRepo {
async listByEmployee(employeeId: string, status?: LeaveStatus): Promise<LeaveRequestDomain[]> {
const where: any = { employeeId };
if (status) where.status = status
const rows = await prisma.leaveRequest.findMany({ where, orderBy: { createdAt: "desc" } });
return rows.map(toDomain);
}


async listByStatus(status: LeaveStatus): Promise<LeaveRequestDomain[]> {
const rows = await prisma.leaveRequest.findMany({ where: { status: status }, orderBy: { createdAt: "asc" } });
return rows.map(toDomain);
}


async createDraft(input: { employeeId: string; leaveTypeId: string; startDate: string; endDate: string; reason: string; }): Promise<{ id: string; status: LeaveStatus; createdAt: Date; }> {
const created = await prisma.leaveRequest.create({
data: {
employeeId: input.employeeId,
leaveTypeId: input.leaveTypeId,
startDate: new Date(input.startDate),
endDate: new Date(input.endDate),
reason: input.reason,
status: "Draft",
},
});
return { id: created.id, status: created.status as LeaveStatus, createdAt: created.createdAt };
}


async submitDraft(id: string, employeeId: string): Promise<boolean> {
const result = await prisma.leaveRequest.updateMany({
where: { id, employeeId, status: "Draft" },
data: { status: "Submitted" },
});
return result.count > 0;
}


async approve(id: string, managerId: string, decisionNote: string | null): Promise<boolean> {
const result = await prisma.leaveRequest.updateMany({
where: { id, status: "Submitted" },
data: { status: "Approved", managerId, decisionNote },
});
return result.count > 0;
}


async reject(id: string, managerId: string, decisionNote: string): Promise<boolean> {
const result = await prisma.leaveRequest.updateMany({
where: { id, status: "Submitted" },
data: { status: "Rejected", managerId, decisionNote },
});
return result.count > 0;
}


async findById(id: string): Promise<LeaveRequestDomain | null> {
const row = await prisma.leaveRequest.findUnique({ where: { id } });
return row ? toDomain(row) : null;
}
}

