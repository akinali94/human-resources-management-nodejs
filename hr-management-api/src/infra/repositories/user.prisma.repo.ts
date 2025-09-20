import type { UserRepo } from "../../domain/user/user.repo.ts";
import type { CreateUserInput, Role, User } from "../../domain/user/user.entity.ts";
import { prisma } from "../db/prisma.client.js" 


export class UserPrismaRepo implements UserRepo {
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } }) as any;
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } }) as any;
    }

    async create(input: CreateUserInput): Promise<User> {
        return prisma.user.create({ data: input }) as any;
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
}