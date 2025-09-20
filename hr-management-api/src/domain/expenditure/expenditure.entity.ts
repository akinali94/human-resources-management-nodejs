// Para birimi seti — gerekirse genişlet
export type Currency = "TRY" | "USD" | "EUR" | "GBP";

export type ExpenditureApprovalStatus = "Pending" | "Approved" | "Rejected";


export interface ExpenditureType {
  id: string;                 // UUID
  name: string;               
  maxPrice?: number | null;
  minPrice?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenditureTypeInput {
  name: string;
  maxPrice?: number | null;
  minPrice?: number | null;
}
export interface UpdateExpenditureTypeInput {
  name?: string;
  maxPrice?: number | null;
  minPrice?: number | null;
}


export interface ExpenditureRequest {
  id: string;                     // UUID
  title: string;
  currency?: Currency | null;
  amount: number;                 // AmountOfExpenditure
  imageUrl?: string | null;

  expenditureTypeId: string;
  employeeId: string;

  status: ExpenditureApprovalStatus; // Pending -> Approved/Rejected
  requestDate: Date;
  approvalDate?: Date | null;

  managerId?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenditureRequestInput {
  title: string;
  currency?: Currency | null;
  amount: number;
  imageUrl?: string | null;
  expenditureTypeId: string;
  employeeId: string;
}

export interface DecideExpenditureRequestInput {
  managerId: string;
  decisionNote?: string | null;
}


export function isAmountWithinTypeRange(
  amount: number,
  t: Pick<ExpenditureType, "minPrice" | "maxPrice" | "name">
): boolean {
  if (typeof amount !== "number" || Number.isNaN(amount)) return false;
  if (t.minPrice != null && amount < t.minPrice) return false;
  if (t.maxPrice != null && amount > t.maxPrice) return false;
  return true;
}

export function approvalStatusLabel(status: ExpenditureApprovalStatus): string {
  switch (status) {
    case "Pending":  return "Waiting for Approval";
    case "Approved": return "Confirmed";
    case "Rejected": return "Not Confirmed";
  }
}

export function canApprove(status: ExpenditureApprovalStatus): boolean {
  return status === "Pending";
}
export function canReject(status: ExpenditureApprovalStatus): boolean {
  return status === "Pending";
}
