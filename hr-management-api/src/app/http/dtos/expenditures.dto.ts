import { z } from "zod";

export const CurrencyEnum = z.enum(["TRY", "USD", "EUR", "GBP"]);

export const CreateExpenditureRequestBody = z.object({
  title: z.string().min(3).max(200),
  currency: CurrencyEnum.nullish(),          
  amount: z.number().positive(),             
  imageUrl: z.string().url().nullish(),      
  expenditureTypeId: z.string().uuid(),
});
export type CreateExpenditureRequestBody = z.infer<typeof CreateExpenditureRequestBody>;

export const ApproveExpenditureBody = z.object({
  decisionNote: z.string().max(500).optional(),
});
export type ApproveExpenditureBody = z.infer<typeof ApproveExpenditureBody>;

export const RejectExpenditureBody = z.object({
  decisionNote: z.string().min(1).max(500).optional(),
});
export type RejectExpenditureBody = z.infer<typeof RejectExpenditureBody>;
