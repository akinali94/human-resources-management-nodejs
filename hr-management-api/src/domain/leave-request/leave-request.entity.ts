export type LeaveStatus = "Draft" | "Submitted" | "Approved" | "Rejected";


export interface LeaveRequestDomain {
id: string;
employeeId: string;
leaveTypeId: string;
startDate: Date | string; // ISO
endDate: Date | string; // ISO
reason: string;
status: LeaveStatus;
managerId?: string | null;
decisionNote?: string | null;
createdAt: Date;
updatedAt: Date;
}