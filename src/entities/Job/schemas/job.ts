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

export const JobResponseSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  job_type: JobTypeSchema,
  bedroom_count: BedroomCountSchema.nullable(),
  description: z.string(),
  pickup_address: z.string(),
  delivery_address: z.string(),
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
});

export type JobListResponse = z.infer<typeof JobListResponseSchema>;

export const JobListParamsSchema = z.object({
  job_type: JobTypeSchema.optional().nullable(),
  bedroom_count: BedroomCountSchema.optional().nullable(),
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

export type CancelJobsRequest = z.infer<typeof CancelJobsRequestSchema>;
export type CancelJobsResponse = z.infer<typeof CancelJobsResponseSchema>;
