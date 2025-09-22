import type { UserRepo } from "../../domain/user/user.repo.ts";
import type { CreateUserInput, UpdateUserInput, Role, User } from "../../domain/user/user.entity.ts";
import { prisma } from "../db/prisma.client.js"
import type { Prisma } from "@prisma/client";

const numOrUndef = (v: number | undefined) => (typeof v === "number" ? v : undefined);

export class UserPrismaRepo implements UserRepo {
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } }) as any;
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } }) as any;
    }


    async create(input: CreateUserInput): Promise<User> {
        const data: Prisma.UserCreateInput = {
        email: input.email,
        passwordHash: input.passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role,
        title: input.title,
        section: input.section,
        phoneNo: input.phoneNo,
        address: input.address,
        isActive: input.isActive ?? true,

        secondName: input.secondName ?? undefined,
        secondLastName: input.secondLastName ?? undefined,
        birthPlace: input.birthPlace ?? undefined,
        identityNumber: input.identityNumber ?? undefined,
        hiredDate: input.hiredDate ?? undefined,
        resignationDate: input.resignationDate ?? undefined,


        salary: numOrUndef(input.salary),
        advanceAmount: numOrUndef(input.advanceAmount),
        maxAdvanceAmount: numOrUndef(input.maxAdvanceAmount),

        company: { connect: { id: input.companyId } },
        ...(input.managerId ? { manager: { connect: { id: input.managerId } } } : {}),
        };

        const row = await prisma.user.create({ data });
        return row as unknown as User;
    }

    async update(id: string, input: UpdateUserInput): Promise<User> {
        const data: Prisma.UserUpdateInput = {
        // primitives
        email: input.email ?? undefined,
        firstName: input.firstName ?? undefined,
        lastName: input.lastName ?? undefined,
        role: input.role ?? undefined,
        isActive: input.isActive ?? undefined,
        title: input.title === undefined ? undefined : input.title,
        section: input.section === undefined ? undefined : input.section,
        phoneNo: input.phoneNo === undefined ? undefined : input.phoneNo,
        address: input.address === undefined ? undefined : input.address,


        // nullable strings (explicit null clears)
        secondName: input.secondName === undefined ? undefined : input.secondName,
        secondLastName: input.secondLastName === undefined ? undefined : input.secondLastName,
        birthPlace: input.birthPlace === undefined ? undefined : input.birthPlace,
        identityNumber: input.identityNumber === undefined ? undefined : input.identityNumber,
        hiredDate: input.hiredDate === undefined ? undefined : input.hiredDate,
        resignationDate: input.resignationDate === undefined ? undefined : input.resignationDate,

        // decimals (not nullable)
        salary: input.salary === undefined ? undefined : input.salary,
        advanceAmount: input.advanceAmount === undefined ? undefined : input.advanceAmount,
        maxAdvanceAmount: input.maxAdvanceAmount === undefined ? undefined : input.maxAdvanceAmount,
        };

        // relations
        if (input.companyId !== undefined) {
        (data.company = { connect: { id: input.companyId } });
        }
        if (input.managerId !== undefined) {
        data.manager = input.managerId
            ? { connect: { id: input.managerId } }
            : { disconnect: true };
        }

        const row = await prisma.user.update({ where: { id }, data });
        return row as unknown as User;
    }


    async updateName(id: string, firstName: string, lastName: string): Promise<User> {
        return prisma.user.update({ where: { id }, data: { firstName, lastName } }) as any;
    }

    async setRole(id: string, role: Role): Promise<void> {
        await prisma.user.update({ where: { id }, data: { role } });
    }

    async setActive(id: string, isActive: boolean): Promise<void> {
        await prisma.user.update({ where: { id }, data: { isActive } });
    }

    async listManagers(): Promise<User[]> {
        const rows = await prisma.user.findMany({
            where: { role: "Manager" },
            orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        });
        return rows as User[];
    }
}