// Domain model for Company

export interface Company {
  id: string;                // UUID
  name: string;              
  title?: string | null;     
  mersisNo?: string | null;
  taxNumber?: string | null;
  logo?: string | null;
  telephoneNumber?: string | null;
  address?: string | null;
  email?: string | null;
  employeeNumber?: string | null; 
  foundationYear?: Date | null;
  contractStartDate?: Date | null;
  contractEndDate?: Date | null;

  isActive: boolean;         
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyInput {
  name: string;
  title?: string | null;
  mersisNo?: string | null;
  taxNumber?: string | null;
  logo?: string | null;
  telephoneNumber?: string | null;
  address?: string | null;
  email?: string | null;
  employeeNumber?: string | null;
  foundationYear?: Date | null;
  contractStartDate?: Date | null;
  contractEndDate?: Date | null;
  isActive?: boolean; // default true
}

export interface UpdateCompanyInput {
  name?: string;
  title?: string | null;
  mersisNo?: string | null;
  taxNumber?: string | null;
  logo?: string | null;
  telephoneNumber?: string | null;
  address?: string | null;
  email?: string | null;
  employeeNumber?: string | null;
  foundationYear?: Date | null;
  contractStartDate?: Date | null;
  contractEndDate?: Date | null;
  isActive?: boolean;
}

export function isContractActive(
  company: Pick<Company, "contractStartDate" | "contractEndDate">,
  at: Date = new Date()
): boolean {
  const { contractStartDate: s, contractEndDate: e } = company;
  if (s && at < s) return false;
  if (e && at > e) return false;
  return true;
}


export function isCompanyActive(
  company: Pick<Company, "isActive" | "contractStartDate" | "contractEndDate">,
  at: Date = new Date()
): boolean {
  return company.isActive && isContractActive(company, at);
}
