import { prisma } from "../db/prisma.client.js";
import type {
  ExpenditureRepo,
} from "../../domain/expenditure/expenditure.repo.ts";
import type {
  ExpenditureType,
  ExpenditureRequest,
  ExpenditureApprovalStatus,
  CreateExpenditureTypeInput,
  UpdateExpenditureTypeInput,
  CreateExpenditureRequestInput,
  DecideExpenditureRequestInput,
} from "../../domain/expenditure/expenditure.entity.ts";


function toNumberMaybe(d: any): number | null {
  if (d == null) return null;
  return typeof d === "object" && d && "toNumber" in d ? (d as any).toNumber() : Number(d);
}

function toType(row: any): ExpenditureType {
  return {
    id: row.id,
    name: row.name,
    minPrice: toNumberMaybe(row.minPrice),
    maxPrice: toNumberMaybe(row.maxPrice),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toRequest(row: any): ExpenditureRequest {
  return {
    id: row.id,
    title: row.title,
    currency: row.currency ?? null,
    amount: toNumberMaybe(row.amount) ?? 0,
    imageUrl: row.imageUrl ?? null,
    expenditureTypeId: row.expenditureTypeId,
    employeeId: row.employeeId,
    status: row.status,
    requestDate: row.requestDate,
    approvalDate: row.approvalDate ?? null,
    managerId: row.managerId ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class ExpenditurePrismaRepo implements ExpenditureRepo {
  
  async findTypeById(id: string): Promise<ExpenditureType | null> {
    const row = await prisma.expenditureType.findUnique({ where: { id } });
    return row ? toType(row) : null;
  }

  async listTypes(): Promise<ExpenditureType[]> {
    const rows = await prisma.expenditureType.findMany({ orderBy: { name: "asc" } });
    return rows.map(toType);
  }

  async createType(input: CreateExpenditureTypeInput): Promise<ExpenditureType> {
    const row = await prisma.expenditureType.create({
      data: {
        name: input.name,
        // number | string | null
        minPrice: input.minPrice ?? null,
        maxPrice: input.maxPrice ?? null,
      },
    });
    return toType(row);
  }

  async updateType(id: string, input: UpdateExpenditureTypeInput): Promise<ExpenditureType> {
    const row = await prisma.expenditureType.update({
      where: { id },
      data: {
        name: input.name,
        minPrice: input.minPrice === undefined ? undefined : (input.minPrice ?? null),
        maxPrice: input.maxPrice === undefined ? undefined : (input.maxPrice ?? null),
      },
    });
    return toType(row);
  }

  async deleteType(id: string): Promise<void> {
    await prisma.expenditureType.delete({ where: { id } });
  }


  async listRequestsByEmployee(employeeId: string, status?: ExpenditureApprovalStatus): Promise<ExpenditureRequest[]> {
    const where: any = { employeeId };
    if (status) where.status = status;
    const rows = await prisma.expenditureRequest.findMany({
      where, orderBy: { createdAt: "desc" },
    });
    return rows.map(toRequest);
  }

  async listRequestsByStatus(status: ExpenditureApprovalStatus): Promise<ExpenditureRequest[]> {
    const rows = await prisma.expenditureRequest.findMany({
      where: { status }, orderBy: { createdAt: "asc" },
    });
    return rows.map(toRequest);
  }

  async listPendingForManager(managerId: string, companyId: string): Promise<ExpenditureRequest[]> {
    const rows = await prisma.expenditureRequest.findMany({
      where: {
        status: "Pending",
        employee: { managerId, companyId },
      },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(toRequest);
  }

  async createRequest(input: CreateExpenditureRequestInput): Promise<{ id: string; status: ExpenditureApprovalStatus; createdAt: Date }> {
    const row = await prisma.expenditureRequest.create({
      data: {
        title: input.title,
        currency: input.currency ?? null,
        amount: input.amount,
        imageUrl: input.imageUrl ?? null,
        expenditureTypeId: input.expenditureTypeId,
        employeeId: input.employeeId,
        status: "Pending",
      },
    });
    return { id: row.id, status: row.status, createdAt: row.createdAt };
  }

  async approveRequest(id: string, input: DecideExpenditureRequestInput): Promise<boolean> {
    const res = await prisma.expenditureRequest.updateMany({
      where: { id, status: "Pending" },
      data: {
        status: "Approved",
        managerId: input.managerId,
        approvalDate: new Date(),
      },
    });
    return res.count > 0;
  }

  async rejectRequest(id: string, input: DecideExpenditureRequestInput & { reason?: string | null }): Promise<boolean> {
    const res = await prisma.expenditureRequest.updateMany({
      where: { id, status: "Pending" },
      data: {
        status: "Rejected",
        managerId: input.managerId,
        approvalDate: new Date(),
        // decisionNote: input.reason ?? null,
      },
    });
    return res.count > 0;
  }

  async findRequestById(id: string): Promise<ExpenditureRequest | null> {
    const row = await prisma.expenditureRequest.findUnique({ where: { id } });
    return row ? toRequest(row) : null;
  }
}
