import type { LeaveRequestDomain, LeaveStatus } from "./leave-request.entity.js";


export interface LeaveRequestRepo {
listByEmployee(employeeId: string, status?: LeaveStatus): Promise<LeaveRequestDomain[]>;
listByStatus(status: LeaveStatus): Promise<LeaveRequestDomain[]>;
listPendingForManager(managerId: string, companyId: string): Promise<LeaveRequestDomain[]>;
createDraft(input: {
employeeId: string;
leaveTypeId: string;
startDate: string; // YYYY-MM-DD
endDate: string; // YYYY-MM-DD
reason: string;
}): Promise<{ id: string; status: LeaveStatus; createdAt: Date }>;
submitDraft(id: string, employeeId: string): Promise<boolean>;
approve(id: string, managerId: string, decisionNote: string | null): Promise<boolean>;
reject(id: string, managerId: string, decisionNote: string): Promise<boolean>;
findById(id: string): Promise<LeaveRequestDomain | null>;
}