// repositories/mappers/user.mapper.ts
import { Prisma } from "@prisma/client";
import type { User } from "../../../domain/user/user.entity.js";

type PrismaUserRow = Prisma.UserGetPayload<{}>;

export function mapUser(row: PrismaUserRow): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    firstName: row.firstName,
    secondName: row.secondName ?? null,
    lastName: row.lastName,
    secondLastName: row.secondLastName ?? null,
    role: row.role,
    birthPlace: row.birthPlace ?? null,
    identityNumber: row.identityNumber ?? null,
    hiredDate: row.hiredDate ?? null,
    resignationDate: row.resignationDate ?? null,
    title: row.title,
    section: row.section,
    phoneNo: row.phoneNo,
    address: row.address,
    isActive: row.isActive,
    companyId: row.companyId,

    // Decimal → number --> Typescript has no decimal, because of this we convert this.
    salary: row.salary.toNumber(),
    advanceAmount: row.advanceAmount.toNumber(),
    maxAdvanceAmount: row.maxAdvanceAmount.toNumber(),

    imageUrl: row.imageUrl ?? null,
    backgroundImageUrl: row.backgroundImageUrl ?? null,

    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
