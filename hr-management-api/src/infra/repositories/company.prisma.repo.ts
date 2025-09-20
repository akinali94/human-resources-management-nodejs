import { prisma } from "../db/prisma.client.js";
import type { CompanyRepo } from "../../domain/company/company.repo.ts";
import type { Company, CreateCompanyInput, UpdateCompanyInput } from "../../domain/company/company.entity.ts";

export class CompanyPrismaRepo implements CompanyRepo {
  async findById(id: string): Promise<Company | null> {
    const row = await prisma.company.findUnique({ where: { id } });
    return row ? (row as Company) : null;
  }
  async findByName(name: string): Promise<Company | null> {
    const row = await prisma.company.findUnique({ where: { name } });
    return row ? (row as Company) : null;
  }
  async listAll(): Promise<Company[]> {
    const rows = await prisma.company.findMany({ orderBy: { name: "asc" } });
    return rows as Company[];
  }
  async create(input: CreateCompanyInput): Promise<Company> {
    const row = await prisma.company.create({ data: input as any });
    return row as Company;
  }
  async update(id: string, input: UpdateCompanyInput): Promise<Company> {
    const row = await prisma.company.update({ where: { id }, data: input as any });
    return row as Company;
  }
  async delete(id: string): Promise<void> {
    await prisma.company.delete({ where: { id } });
  }
}
