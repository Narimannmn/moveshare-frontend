import { z } from "zod";

export const CompanyVerificationStatusSchema = z.enum(["pending", "approved", "rejected"]);

export type CompanyVerificationStatus = z.infer<typeof CompanyVerificationStatusSchema>;

export const CompanyManagementItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  joined_at: z.string().datetime(),
  truck_count: z.number().int(),
  orders_total: z.number().int(),
  status: CompanyVerificationStatusSchema,
});

export type CompanyManagementItem = z.infer<typeof CompanyManagementItemSchema>;

export const CompanyManagementListResponseSchema = z.object({
  companies: z.array(CompanyManagementItemSchema),
  total: z.number().int(),
  offset: z.number().int(),
  limit: z.number().int(),
});

export type CompanyManagementListResponse = z.infer<typeof CompanyManagementListResponseSchema>;

export const CompanyListParamsSchema = z.object({
  status: CompanyVerificationStatusSchema.optional().nullable(),
  search: z.string().min(1).max(255).optional().nullable(),
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CompanyListParams = z.infer<typeof CompanyListParamsSchema>;
