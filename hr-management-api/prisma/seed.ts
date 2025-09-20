import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/infra/auth/password.js";


const prisma = new PrismaClient();


async function main() {
    const pwd = await hashPassword("Passw0rd!");

    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            passwordHash: pwd,
            firstName: "Ada",
            lastName: "Min",
            role: Role.Admin,
        },
    });

    await prisma.user.upsert({
        where: { email: "manager@example.com" },
        update: {},
        create: {
        email: "manager@example.com",
            passwordHash: pwd,
            firstName: "Mona",
            lastName: "Ger",
            role: Role.Manager,
        },
    });

    await prisma.user.upsert({
        where: { email: "employee1@example.com" },
        update: {},
        create: {
            email: "employee1@example.com",
            passwordHash: pwd,
            firstName: "Emil",
            lastName: "Ployee",
            role: Role.Employee,
        },
    });

    await prisma.user.upsert({
        where: { email: "employee2@example.com" },
        update: {},
        create: {
            email: "employee2@example.com",
            passwordHash: pwd,
            firstName: "Emma",
            lastName: "Ployee",
            role: Role.Employee,
        },
    });

    // Leave types
    await prisma.leaveType.upsert({
        where: { id: "00000000-0000-0000-0000-000000000001" },
        update: { name: "Annual" },
        create: { id: "00000000-0000-0000-0000-000000000001", name: "Annual", defaultDay: 14 },
    });

    await prisma.leaveType.upsert({
        where: { id: "00000000-0000-0000-0000-000000000002" },
        update: { name: "Sick" },
        create: { id: "00000000-0000-0000-0000-000000000002", name: "Sick", defaultDay: 5 },
    });
    
    console.log("Seed completed");

}


main().finally(() => prisma.$disconnect());

