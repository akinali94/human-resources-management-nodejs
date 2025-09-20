import type { Company, CreateCompanyInput, UpdateCompanyInput } from "./company.entity.ts";

export interface CompanyRepo {
  findById(id: string): Promise<Company | null>;
  findByName(name: string): Promise<Company | null>;
  listAll(): Promise<Company[]>;
  create(input: CreateCompanyInput): Promise<Company>;
  update(id: string, input: UpdateCompanyInput): Promise<Company>;
  delete(id: string): Promise<void>;
}
