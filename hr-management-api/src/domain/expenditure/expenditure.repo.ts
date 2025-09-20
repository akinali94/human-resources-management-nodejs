import type {
  CreateExpenditureTypeInput,
  UpdateExpenditureTypeInput,
  ExpenditureType,
  ExpenditureRequest,
  CreateExpenditureRequestInput,
  ExpenditureApprovalStatus,
  DecideExpenditureRequestInput,
} from "./expenditure.entity.ts";


export interface ExpenditureRepo {
  // ---- Types ----
  findTypeById(id: string): Promise<ExpenditureType | null>;
  listTypes(): Promise<ExpenditureType[]>;
  createType(input: CreateExpenditureTypeInput): Promise<ExpenditureType>;
  updateType(id: string, input: UpdateExpenditureTypeInput): Promise<ExpenditureType>;
  deleteType(id: string): Promise<void>;

  // ---- Requests ----
  listRequestsByEmployee(employeeId: string, status?: ExpenditureApprovalStatus): Promise<ExpenditureRequest[]>;
  listRequestsByStatus(status: ExpenditureApprovalStatus): Promise<ExpenditureRequest[]>;
  listPendingForManager(managerId: string, companyId: string): Promise<ExpenditureRequest[]>;
  createRequest(input: CreateExpenditureRequestInput): Promise<{ id: string; status: ExpenditureApprovalStatus; createdAt: Date }>;
  approveRequest(id: string, input: DecideExpenditureRequestInput): Promise<boolean>;
  rejectRequest(id: string, input: DecideExpenditureRequestInput & { reason?: string | null }): Promise<boolean>;
  findRequestById(id: string): Promise<ExpenditureRequest | null>;
}
