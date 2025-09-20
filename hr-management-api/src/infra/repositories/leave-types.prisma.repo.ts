import { prisma } from "../db/prisma.client.js";


export class LeaveTypePrismaRepo {
    async findById(id: string) {
        return prisma.leaveType.findUnique({ where: { id } });
    }
    async listAll() {
        return prisma.leaveType.findMany({ orderBy: { name: "asc" } });
    }
}