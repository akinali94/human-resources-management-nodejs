import type { UserRepo } from "../../domain/user/user.repo.ts";
import type { CreateUserInput, UpdateUserInput, Role, User } from "../../domain/user/user.entity.ts";
import { prisma } from "../db/prisma.client.js"
import { Prisma } from "@prisma/client";
import { mapUser } from "./mappers/user.mapper.repo.js";

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

        secondName: input.secondName ?? null,
        secondLastName: input.secondLastName ?? null,
        birthPlace: input.birthPlace ?? null,
        identityNumber: input.identityNumber ?? null,
        hiredDate: input.hiredDate ?? null,
        resignationDate: input.resignationDate ?? null,


        salary: input.salary,
        advanceAmount: input.advanceAmount,
        maxAdvanceAmount: input.maxAdvanceAmount,

        company: { connect: { id: input.companyId } },
        ...(input.managerId ? { manager: { connect: { id: input.managerId } } } : {}),
        };

        const row = await prisma.user.create({ data });

        const mappedUser = mapUser(row)

        return mappedUser as unknown as User;
    }

    async update(id: string, input: UpdateUserInput): Promise<User> {

        const data: Prisma.UserUpdateInput = {
            // required
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            role: input.role,
            title: input.title,
            section: input.section,
            phoneNo: input.phoneNo,
            address: input.address,
        }

        if("isActive" in input) {
            data.isActive = input.isActive!;
        }

        // Nullable texts
        if ("secondName" in input) {
            data.secondName = input.secondName; // string | null
        }
        if ("secondLastName" in input) {
            data.secondLastName = input.secondLastName;
        }
        if ("birthPlace" in input) {
            data.birthPlace = input.birthPlace;
        }
        if ("identityNumber" in input) {
            data.identityNumber = input.identityNumber;
        }


        if ("hiredDate" in input) {
            data.hiredDate = input.hiredDate;
        }
        if ("resignationDate" in input) {
            data.resignationDate = input.resignationDate;
        }


        if ("imageUrl" in input) {
            data.imageUrl = input.imageUrl;
        }
        if ("backgroundImageUrl" in input) {
            data.backgroundImageUrl = input.backgroundImageUrl;
        }


        if ("salary" in input) {
            data.salary = input.salary!;
        }
        if ("maxAdvanceAmount" in input) {
            data.maxAdvanceAmount = input.maxAdvanceAmount!;
        }

        // relations — company
        if (input.companyId) {
            data.company = { connect: { id: input.companyId } };
        }

        // relations
        if (input.companyId !== undefined) {
        (data.company = { connect: { id: input.companyId } });
        }

        const row = await prisma.user.update({ where: { id }, data });

        const mappedUser = mapUser(row)

        return mappedUser;
    }

    async delete(id: string): Promise<User> {
        const row = await prisma.user.delete({where: { id }});
        const mappedUser = mapUser(row);
        return mappedUser;
    }


    async updateName(id: string, firstName: string, lastName: string): Promise<User> {
        const row = prisma.user.update({ where: { id }, data: { firstName, lastName } }) as any;
        const mappedUser = mapUser(row);
        return mappedUser;
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
        return rows.map(mapUser)
    }
}