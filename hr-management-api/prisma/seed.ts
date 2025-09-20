import { PrismaClient } from "@prisma/client";
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
            role: "Admin",
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
            role: "Manager",
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
            role: "Employee",
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
            role: "Employee",
        },
    });

    const manager = await prisma.user.findUnique({ where: { email: "manager@example.com" } });
    const employee1 = await prisma.user.findUnique({ where: { email: "employee1@example.com" } });
    const employee2 = await prisma.user.findUnique({ where: { email: "employee2@example.com" } });
    if (!manager || !employee1 || !employee2)
        throw new Error("Seed: users not found after upsert");

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
    await prisma.leaveType.upsert({
        where: { id: "00000000-0000-0000-0000-000000000003" },
        update: { name: "Unpaid", defaultDay: null, gender: null },
        create: { id: "00000000-0000-0000-0000-000000000003", name: "Unpaid" },
    });
    await prisma.leaveType.upsert({
        where: { id: "00000000-0000-0000-0000-000000000004" },
        update: { name: "Maternity", defaultDay: 90, gender: "Female" },
        create: { id: "00000000-0000-0000-0000-000000000004", name: "Maternity", defaultDay: 90, gender: "Female" },
    });
    
    const annualId = "00000000-0000-0000-0000-000000000001";
    const sickId   = "00000000-0000-0000-0000-000000000002";

    // employee1 → Draft
    await prisma.leaveRequest.upsert({
        where: { id: "11111111-1111-1111-1111-111111111001" },
        update: {
        employeeId: employee1.id,
        leaveTypeId: annualId,
        startDate: new Date("2025-09-22"),
        endDate:   new Date("2025-09-24"),
        reason: "Aile ziyareti",
        status: "Draft",
        managerId: null,
        decisionNote: null,
        },
        create: {
        id: "11111111-1111-1111-1111-111111111001",
        employeeId: employee1.id,
        leaveTypeId: annualId,
        startDate: new Date("2025-09-22"),
        endDate:   new Date("2025-09-24"),
        reason: "Aile ziyareti",
        status: "Draft",
        },
    });

    // employee1 → Submitted
    await prisma.leaveRequest.upsert({
        where: { id: "11111111-1111-1111-1111-111111111002" },
        update: {
        employeeId: employee1.id,
        leaveTypeId: sickId,
        startDate: new Date("2025-10-02"),
        endDate:   new Date("2025-10-03"),
        reason: "Grip",
        status: "Submitted",
        managerId: null,
        decisionNote: null,
        },
        create: {
        id: "11111111-1111-1111-1111-111111111002",
        employeeId: employee1.id,
        leaveTypeId: sickId,
        startDate: new Date("2025-10-02"),
        endDate:   new Date("2025-10-03"),
        reason: "Grip",
        status: "Submitted",
        },
    });

    // employee2 → Approved (manager tarafından)
    await prisma.leaveRequest.upsert({
        where: { id: "11111111-1111-1111-1111-111111111003" },
        update: {
        employeeId: employee2.id,
        leaveTypeId: annualId,
        startDate: new Date("2025-08-10"),
        endDate:   new Date("2025-08-12"),
        reason: "Kısa tatil",
        status: "Approved",
        managerId: manager.id,
        decisionNote: "Onaylandı, iyi tatiller",
        },
        create: {
        id: "11111111-1111-1111-1111-111111111003",
        employeeId: employee2.id,
        leaveTypeId: annualId,
        startDate: new Date("2025-08-10"),
        endDate:   new Date("2025-08-12"),
        reason: "Kısa tatil",
        status: "Approved",
        managerId: manager.id,
        decisionNote: "Onaylandı, iyi tatiller",
        },
    });

    // employee2 → Rejected (manager tarafından)
    await prisma.leaveRequest.upsert({
        where: { id: "11111111-1111-1111-1111-111111111004" },
        update: {
        employeeId: employee2.id,
        leaveTypeId: sickId,
        startDate: new Date("2025-09-05"),
        endDate:   new Date("2025-09-06"),
        reason: "Kısa rahatsızlık",
        status: "Rejected",
        managerId: manager.id,
        decisionNote: "Ekip yoğun",
        },
        create: {
        id: "11111111-1111-1111-1111-111111111004",
        employeeId: employee2.id,
        leaveTypeId: sickId,
        startDate: new Date("2025-09-05"),
        endDate:   new Date("2025-09-06"),
        reason: "Kısa rahatsızlık",
        status: "Rejected",
        managerId: manager.id,
        decisionNote: "Ekip yoğun",
        },
    });
    // ---- Expenditure Types ----
    await prisma.expenditureType.upsert({
        where: { id: "20000000-0000-0000-0000-000000000001" },
        update: { name: "Travel", minPrice: 0, maxPrice: 1000 },
        create: { id: "20000000-0000-0000-0000-000000000001", name: "Travel", minPrice: 0, maxPrice: 1000 },
    });
    await prisma.expenditureType.upsert({
        where: { id: "20000000-0000-0000-0000-000000000002" },
        update: { name: "Meal", minPrice: 0, maxPrice: 150 },
        create: { id: "20000000-0000-0000-0000-000000000002", name: "Meal", minPrice: 0, maxPrice: 150 },
    });
    await prisma.expenditureType.upsert({
        where: { id: "20000000-0000-0000-0000-000000000003" },
        update: { name: "Lodging", minPrice: 0, maxPrice: 500 },
        create: { id: "20000000-0000-0000-0000-000000000003", name: "Lodging", minPrice: 0, maxPrice: 500 },
    });

    const travelTypeId = "20000000-0000-0000-0000-000000000001";
    const mealTypeId   = "20000000-0000-0000-0000-000000000002";

    // ---- Expenditure Requests (sample) ----
    // employee1 → Pending
    await prisma.expenditureRequest.upsert({
        where: { id: "21111111-1111-1111-1111-111111111001" },
        update: {
        employeeId: employee1.id,
        expenditureTypeId: travelTypeId,
        title: "İstanbul - Ankara otobüs bileti",
        currency: "TRY",
        amount: 450.0,
        imageUrl: null,
        status: "Pending",
        managerId: null,
        approvalDate: null,
        },
        create: {
        id: "21111111-1111-1111-1111-111111111001",
        employeeId: employee1.id,
        expenditureTypeId: travelTypeId,
        title: "İstanbul - Ankara otobüs bileti",
        currency: "TRY",
        amount: 450.0,
        imageUrl: null,
        status: "Pending",
        },
    });

    // employee2 → Approved
    await prisma.expenditureRequest.upsert({
        where: { id: "21111111-1111-1111-1111-111111111002" },
        update: {
        employeeId: employee2.id,
        expenditureTypeId: mealTypeId,
        title: "Müşteri toplantısı öğle yemeği",
        currency: "EUR",
        amount: 32.5,
        imageUrl: null,
        status: "Approved",
        managerId: manager.id,
        approvalDate: new Date("2025-09-10"),
        },
        create: {
        id: "21111111-1111-1111-1111-111111111002",
        employeeId: employee2.id,
        expenditureTypeId: mealTypeId,
        title: "Müşteri toplantısı öğle yemeği",
        currency: "EUR",
        amount: 32.5,
        imageUrl: null,
        status: "Approved",
        managerId: manager.id,
        approvalDate: new Date("2025-09-10"),
        },
    });

    // employee2 → Rejected
    await prisma.expenditureRequest.upsert({
        where: { id: "21111111-1111-1111-1111-111111111003" },
        update: {
        employeeId: employee2.id,
        expenditureTypeId: travelTypeId,
        title: "Şehir içi taksi",
        currency: "EUR",
        amount: 120,
        imageUrl: null,
        status: "Rejected",
        managerId: manager.id,
        approvalDate: new Date("2025-09-12"),
        },
        create: {
        id: "21111111-1111-1111-1111-111111111003",
        employeeId: employee2.id,
        expenditureTypeId: travelTypeId,
        title: "Şehir içi taksi",
        currency: "EUR",
        amount: 120,
        imageUrl: null,
        status: "Rejected",
        managerId: manager.id,
        approvalDate: new Date("2025-09-12"),
        },
    });

    console.log("Seed completed");
}


main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());