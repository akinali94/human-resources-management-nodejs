import { z } from "zod";


export const CreateLeaveRequestBody = z.object({
        leaveTypeId: z.string().uuid(),
        // YYYY-MM-DD formatı
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        reason: z.string().min(3).max(500),
    }).refine((v) => v.startDate <= v.endDate, {
        message: "startDate endDate'den büyük olamaz",
        path: ["startDate"],
    }
);
export type CreateLeaveRequestBody = z.infer<typeof CreateLeaveRequestBody>;


export const ApproveBody = z.object({
    decisionNote: z.string().min(0).max(500).optional(),
});
export type ApproveBody = z.infer<typeof ApproveBody>;


export const RejectBody = z.object({
    decisionNote: z.string().min(3).max(500),
});
export type RejectBody = z.infer<typeof RejectBody>;