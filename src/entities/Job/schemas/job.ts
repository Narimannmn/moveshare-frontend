import { z } from "zod";

export const JobTypeSchema = z.enum(["residential", "office", "storage"]);

export const BedroomCountSchema = z.enum([
  "1_bedroom",
  "2_bedroom",
  "3_bedroom",
  "4_bedroom",
  "5_bedroom",
  "6_plus_bedroom",
]);

export const JobStatusSchema = z.enum([
  "draft",
  "listed",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
]);

export const AdditionalServiceSchema = z.enum([
  "packing_boxes",
  "bulky_items",
  "inventory_list",
  "hosting",
]);

export type JobType = z.infer<typeof JobTypeSchema>;
export type BedroomCount = z.infer<typeof BedroomCountSchema>;
export type JobStatus = z.infer<typeof JobStatusSchema>;
export type AdditionalService = z.infer<typeof AdditionalServiceSchema>;

export const JobCompanySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable().optional(),
  name: z.string(),
  contact_person: z.string(),
  phone_number: z.string(),
  description: z.string().nullable(),
});

export const JobResponseSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  job_type: JobTypeSchema,
  bedroom_count: BedroomCountSchema.nullable(),
  description: z.string(),
  pickup_address: z.string(),
  delivery_address: z.string(),
  distance_meters: z.number().int().nullable().optional(),
  duration_seconds: z.number().int().nullable().optional(),
  additional_services: z.array(AdditionalServiceSchema),
  loading_assistance_count: z.number().int(),
  item_images: z.array(z.string()),
  inventory_pdf: z.string().nullable(),
  pickup_datetime: z.string().datetime(),
  delivery_datetime: z.string().datetime(),
  payout_amount: z.string(),
  cut_amount: z.string(),
  status: JobStatusSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  company: JobCompanySchema.nullable().optional(),
});

export type JobResponse = z.infer<typeof JobResponseSchema>;

const decimalPattern = /^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$/;

export const CreateJobRequestSchema = z.object({
  job_type: JobTypeSchema,
  description: z.string().min(1, "Description is required"),
  pickup_address: z.string().min(1, "Pickup address is required"),
  delivery_address: z.string().min(1, "Delivery address is required"),
  pickup_datetime: z.string().datetime("Invalid pickup datetime"),
  delivery_datetime: z.string().datetime("Invalid delivery datetime"),
  payout_amount: z.union([
    z.number().min(0, "Payout amount cannot be negative"),
    z.string().regex(decimalPattern, "Invalid payout amount format"),
  ]),
  cut_amount: z.union([
    z.number().min(0, "Cut amount cannot be negative"),
    z.string().regex(decimalPattern, "Invalid cut amount format"),
  ]),
  bedroom_count: BedroomCountSchema.optional().nullable(),
  additional_services: z.string().default(""),
  loading_assistance_count: z.number().int().min(0).default(0),
});

export type CreateJobRequest = z.infer<typeof CreateJobRequestSchema>;

export const UpdateJobRequestSchema = CreateJobRequestSchema.partial();

export type UpdateJobRequest = z.infer<typeof UpdateJobRequestSchema>;

export const JobListResponseSchema = z.object({
  jobs: z.array(JobResponseSchema),
  total: z.number().int(),
  offset: z.number().int(),
  limit: z.number().int(),
  status_counts: z.record(z.string(), z.number().int()).optional().nullable(),
});

export type JobListResponse = z.infer<typeof JobListResponseSchema>;

export const JobListParamsSchema = z.object({
  job_type: JobTypeSchema.optional().nullable(),
  bedroom_count: BedroomCountSchema.optional().nullable(),
  origin: z.string().min(1).max(255).optional().nullable(),
  destination: z.string().min(1).max(255).optional().nullable(),
  pickup_date_from: z.string().datetime().optional().nullable(),
  pickup_date_to: z.string().datetime().optional().nullable(),
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type JobListParams = z.infer<typeof JobListParamsSchema>;

export const MyJobsParamsSchema = z.object({
  status: JobStatusSchema.optional().nullable(),
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type MyJobsParams = z.infer<typeof MyJobsParamsSchema>;

export const JobFilterOptionsResponseSchema = z.object({
  bedroom_counts: z.array(BedroomCountSchema),
  distance_min_meters: z.number().int().nullable(),
  distance_max_meters: z.number().int().nullable(),
  origins: z.array(z.string()),
  destinations: z.array(z.string()),
});

export type JobFilterOptionsResponse = z.infer<typeof JobFilterOptionsResponseSchema>;

export const ExportJobsRequestSchema = z.object({
  job_ids: z.array(z.string().uuid()).optional().nullable(),
});

export type ExportJobsRequest = z.infer<typeof ExportJobsRequestSchema>;

export const CancelJobsRequestSchema = z.object({
  job_ids: z.array(z.string().uuid()).min(1, "At least one job id is required"),
});

export const CancelJobsResponseSchema = z.object({
  cancelled_count: z.number().int(),
  message: z.string(),
});

export const CreateClaimCheckoutSessionRequestSchema = z.object({
  success_url: z.string().url(),
  cancel_url: z.string().url(),
});

export const CreateClaimCheckoutSessionResponseSchema = z.object({
  checkout_session_id: z.string(),
  checkout_url: z.string().url(),
  expires_at: z.string().datetime().nullable(),
  amount_cents: z.number().int(),
  currency: z.string(),
});

export const JobApplicationStatusSchema = z.enum(["pending", "accepted", "rejected"]);

export const ConfirmClaimCheckoutSessionRequestSchema = z.object({
  session_id: z.string().min(1),
  job_id: z.string().uuid().optional().nullable(),
});

export const ConfirmClaimCheckoutSessionResponseSchema = z.object({
  job_id: z.string().uuid(),
  application_id: z.string().uuid(),
  already_confirmed: z.boolean(),
  receipt_url: z.string().nullable().optional(),
  poster_user_id: z.string().uuid().nullable().optional(),
});

export const AppliedJobItemSchema = z.object({
  job: JobResponseSchema,
  application: z.object({
    id: z.string().uuid(),
    job_id: z.string().uuid(),
    company_id: z.string().uuid(),
    message: z.string().nullable(),
    proposed_amount: z.string().nullable(),
    status: JobApplicationStatusSchema,
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  }),
});

export const AppliedJobsListResponseSchema = z.object({
  items: z.array(AppliedJobItemSchema),
  total: z.number().int(),
  skip: z.number().int(),
  limit: z.number().int(),
});

export const AppliedJobsParamsSchema = z.object({
  status: JobApplicationStatusSchema.optional().nullable(),
  skip: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CancelJobsRequest = z.infer<typeof CancelJobsRequestSchema>;
export type CancelJobsResponse = z.infer<typeof CancelJobsResponseSchema>;
export type CreateClaimCheckoutSessionRequest = z.infer<
  typeof CreateClaimCheckoutSessionRequestSchema
>;
export type CreateClaimCheckoutSessionResponse = z.infer<
  typeof CreateClaimCheckoutSessionResponseSchema
>;
export type JobApplicationStatus = z.infer<typeof JobApplicationStatusSchema>;
export type ConfirmClaimCheckoutSessionRequest = z.infer<
  typeof ConfirmClaimCheckoutSessionRequestSchema
>;
export type ConfirmClaimCheckoutSessionResponse = z.infer<
  typeof ConfirmClaimCheckoutSessionResponseSchema
>;
export type AppliedJobItem = z.infer<typeof AppliedJobItemSchema>;
export type AppliedJobsListResponse = z.infer<typeof AppliedJobsListResponseSchema>;
export type AppliedJobsParams = z.infer<typeof AppliedJobsParamsSchema>;
