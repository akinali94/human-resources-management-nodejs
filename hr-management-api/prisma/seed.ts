import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/infra/auth/password.js";


const prisma = new PrismaClient();


async function main() {
    const pwd = await hashPassword("password");

    const now = new Date();

    const contractStartDate1 = new Date();
    contractStartDate1.setFullYear(now.getFullYear() - 2);

    const contractEndDate1 = new Date();
    contractEndDate1.setFullYear(now.getFullYear() + 2);

    const contractStartDate2 = new Date();
    contractStartDate1.setFullYear(now.getFullYear() - 1);

    const contractEndDate2 = new Date();
    contractEndDate1.setFullYear(now.getFullYear() + 1);

    await prisma.company.upsert({
        where: { id: "30000000-0000-0000-0000-000000000001" },
        update: { name: "Bugbusters Hr Management Company", isActive: true },
        create: {
            id: "30000000-0000-0000-0000-000000000001",
            name: "Bugbusters Hr Management Company",
            title: "Technology",
            mersisNo: "1234567890123456",
            taxNumber: "1234567890",
            logo: "https://picsum.photos/seed/bugbusters/120",
            telephoneNumber: "+90 212 000 00 00",
            address: "İstanbul",
            email: "info@bugbustershrmanagement.com",
            foundationYear: new Date(2015, 0, 1),
            contractStartDate: contractStartDate1,
            contractEndDate: contractEndDate1,
            isActive: true,
        },
    });

    await prisma.company.upsert({
        where: { id: "30000000-0000-0000-0000-000000000002" },
        update: { name: "Acme Corp", isActive: true },
        create: {
        id: "30000000-0000-0000-0000-000000000002",
        name: "Acme Corp",
        title: "Consulting",
        mersisNo: "1234567899876543",
        taxNumber: "0987654321",
        logo: "https://picsum.photos/id/120/140",
        telephoneNumber: "+352 20 00 00",
        address: "Luxembourg",
        email: "contact@acme.example",
        foundationYear: new Date(1990, 0, 1),
        contractStartDate: contractStartDate2,
        contractEndDate: contractEndDate2,
        isActive: true,
        },
    });

    const hrCompanyId = "30000000-0000-0000-0000-000000000001";
    const acmeId  = "30000000-0000-0000-0000-000000000002";

    await prisma.user.upsert({
        where: { email: "admin@bugbusters.com" },
        update: {},
        create: {
            email: "admin@bugbusters.com",
            passwordHash: pwd,
            firstName: "Ada",
            lastName: "Min",
            role: "Admin",
            companyId: hrCompanyId,
            birthPlace: "Istanbul",
            identityNumber: "11223344556",
            hiredDate: new Date(2024, 10, 15),
            title: "Hr Admin",
            section: "Human Resources",
            phoneNo: "05350000001",
            address: "Ankara Cad. No:100",
            salary: 3000,
            imageUrl: "https://picsum.photos/seed/admin/200",
            backgroundImageUrl: "https://picsum.photos/1200/300",
            advanceAmount: 0,
            maxAdvanceAmount: 20000,
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
            companyId: acmeId,
            birthPlace: "Izmir",
            identityNumber: "22334455667",
            hiredDate: new Date(2023, 8, 12),
            title: "Hr Manager",
            section: "Hr",
            phoneNo: "05350000002",
            address: "Istanbul Cad. No:101",
            salary: 5000,
            imageUrl: "https://picsum.photos/seed/manager1/200",
            backgroundImageUrl: "https://picsum.photos/1200/300",
            advanceAmount: 0,
            maxAdvanceAmount: 20000,
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
            companyId: acmeId,
            birthPlace: "Frankfurt",
            identityNumber: "44556677889",
            hiredDate: new Date(2025, 1, 12),
            title: "Backend Developer",
            section: "Ecommerce",
            phoneNo: "05350000003",
            address: "London Cad. No:102",
            salary: 4500,
            imageUrl: "https://picsum.photos/seed/manager2/200",
            backgroundImageUrl: "https://picsum.photos/1200/300",
            advanceAmount: 0,
            maxAdvanceAmount: 30000,
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
            companyId: acmeId,
            birthPlace: "Madrid",
            identityNumber: "11223344556",
            hiredDate: new Date(2023, 12, 3),
            title: "Frontend Developer",
            section: "Mobile",
            phoneNo: "05350000004",
            address: "Barcelona Cad. No:104",
            salary: 2500,
            imageUrl: "https://picsum.photos/seed/employee1/200",
            backgroundImageUrl: "https://picsum.photos/1200/300",
            advanceAmount: 0,
            maxAdvanceAmount: 10000,
        },
    });

    await prisma.user.upsert({
        where: { email: "employee.mark@example.com" },
        update: {},
        create: {
            email: "employee.mark@example.com",
            passwordHash: pwd,
            firstName: "Mark",
            lastName: "Close",
            role: "Employee",
            companyId: hrCompanyId,
            birthPlace: "Bremen",
            identityNumber: "44556677889",
            hiredDate: new Date(2023, 1, 12),
            title: "Senior Architect",
            section: "Ecommerce",
            phoneNo: "05350000003",
            address: "Porto Cad. No:102",
            salary: 14500,
            imageUrl: "https://picsum.photos/seed/employee3/200",
            backgroundImageUrl: "https://picsum.photos/1200/300",
            advanceAmount: 0,
            maxAdvanceAmount: 120000,
        },
    });

    await prisma.user.upsert({
        where: { email: "employee.anthony@example.com" },
        update: {},
        create: {
            email: "employee.anthony@example.com",
            passwordHash: pwd,
            firstName: "Anthony",
            lastName: "Bullet",
            role: "Employee",
            companyId: hrCompanyId,
            birthPlace: "Van",
            identityNumber: "001122334456",
            hiredDate: new Date(2022, 7, 3),
            title: "AWS Cloud Architect",
            section: "Ecommerce",
            phoneNo: "05350000006",
            address: "Moskova Cad. No:104",
            salary: 12500,
            imageUrl: "https://picsum.photos/seed/employee2/200",
            backgroundImageUrl: "hhttps://picsum.photos/1200/300",
            advanceAmount: 0,
            maxAdvanceAmount: 85000,
        },
    });

    const manager = await prisma.user.findUnique({ where: { email: "manager@example.com" } });
    const employee1 = await prisma.user.findUnique({ where: { email: "employee1@example.com" } });
    const employee2 = await prisma.user.findUnique({ where: { email: "employee2@example.com" } });
    if (!manager || !employee1 || !employee2)
        throw new Error("Seed: users not found after upsert");

    await prisma.user.update({ where: { id: employee1.id }, data: { managerId: manager.id } });
    await prisma.user.update({ where: { id: employee2.id }, data: { managerId: manager.id } });    
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