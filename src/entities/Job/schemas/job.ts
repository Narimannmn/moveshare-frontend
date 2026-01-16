import { z } from "zod";

// ============================================
// Enums
// ============================================

export const JobTypeSchema = z.enum(["residential", "office", "storage"]);
export const RoomCountSchema = z.enum([
  "1_bedroom",
  "2_bedroom",
  "3_bedroom",
  "4_bedroom",
  "5_bedroom",
  "6+_bedroom",
]);
export const JobStatusSchema = z.enum([
  "draft",
  "published",
  "in_progress",
  "completed",
  "cancelled",
]);

export type JobType = z.infer<typeof JobTypeSchema>;
export type RoomCount = z.infer<typeof RoomCountSchema>;
export type JobStatus = z.infer<typeof JobStatusSchema>;

// ============================================
// Job Image
// ============================================

export const JobImageResponseSchema = z.object({
  id: z.number(),
  file_name: z.string(),
  file_path: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  created_at: z.string(),
});

export type JobImageResponse = z.infer<typeof JobImageResponseSchema>;

// ============================================
// Create Job
// ============================================

// Decimal pattern for payment_amount and cut
const decimalPattern = /^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$/;

export const CreateJobRequestSchema = z.object({
  job_type: JobTypeSchema,
  room_count: RoomCountSchema,
  description: z.string().min(1, "Description is required"),
  pickup_location: z.string().min(1, "Pickup location is required"),
  delivery_location: z.string().min(1, "Delivery location is required"),
  additional_services: z.array(z.string()).optional().default([]),
  loading_assistance: z.number().int().min(0, "Loading assistance cannot be negative"),
  pickup_date: z.string().min(1, "Pickup date is required"),
  pickup_time_window: z.string().min(1, "Pickup time window is required"),
  delivery_date: z.string().min(1, "Delivery date is required"),
  delivery_time_window: z.string().min(1, "Delivery time window is required"),
  payment_amount: z.union([
    z.number().min(0, "Payment amount cannot be negative"),
    z.string().regex(decimalPattern, "Invalid payment amount format"),
  ]),
  cut: z.union([
    z.number().min(0, "Cut cannot be negative"),
    z.string().regex(decimalPattern, "Invalid cut format"),
  ]),
});

export const CreateJobResponseSchema = z.object({
  job_id: z.number(),
});

export type CreateJobRequest = z.infer<typeof CreateJobRequestSchema>;
export type CreateJobResponse = z.infer<typeof CreateJobResponseSchema>;

// ============================================
// Job Response (full job object)
// ============================================

export const JobResponseSchema = z.object({
  id: z.number(),
  owner_id: z.number(),
  job_type: JobTypeSchema,
  room_count: RoomCountSchema,
  description: z.string(),
  pickup_location: z.string(),
  delivery_location: z.string(),
  additional_services: z.array(z.string()),
  loading_assistance: z.number(),
  pickup_date: z.string(),
  pickup_time_window: z.string(),
  delivery_date: z.string(),
  delivery_time_window: z.string(),
  payment_amount: z.string().regex(decimalPattern),
  cut: z.string().regex(decimalPattern),
  status: JobStatusSchema,
  images: z.array(JobImageResponseSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export type JobResponse = z.infer<typeof JobResponseSchema>;

// ============================================
// Update Job
// ============================================

export const UpdateJobRequestSchema = CreateJobRequestSchema.partial();

export type UpdateJobRequest = z.infer<typeof UpdateJobRequestSchema>;

// ============================================
// List Jobs
// ============================================

export const ListJobsResponseSchema = z.object({
  jobs: z.array(JobResponseSchema),
  total: z.number(),
});

export type ListJobsResponse = z.infer<typeof ListJobsResponseSchema>;

// ============================================
// Upload Job Image
// ============================================

export const UploadJobImageResponseSchema = z.object({
  image_id: z.number(),
  file_path: z.string(),
});

export type UploadJobImageResponse = z.infer<typeof UploadJobImageResponseSchema>;
