import type { UserRepo } from "../../domain/user/user.repo.ts";
import type { CreateUserInput, UpdateUserInput, Role, User } from "../../domain/user/user.entity.ts";
import { prisma } from "../db/prisma.client.js"
import type { Prisma } from "@prisma/client";


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
            isActive: input.isActive ?? true,
            company: { connect: { id: input.companyId } }, // relation connect
        };
        if (input.managerId) {
            data.manager = { connect: { id: input.managerId } };
        }
        
        const row = await prisma.user.create({ data });
        return row as User;
    }

    async update(id: string, input: UpdateUserInput): Promise<User> {
        const data: any = {};
        if (input.email !== undefined) data.email = input.email;
        if (input.firstName !== undefined) data.firstName = input.firstName;
        if (input.lastName !== undefined) data.lastName = input.lastName;
        if (input.role !== undefined) data.role = input.role;
        if (input.isActive !== undefined) data.isActive = input.isActive;
        if (input.managerId !== undefined) data.managerId = input.managerId ?? null;
        if (input.companyId !== undefined) data.companyId = input.companyId;

        const row = await prisma.user.update({ where: { id }, data });
        return row as User;
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