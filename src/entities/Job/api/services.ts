import {apiClient} from "@shared/api/client";

import {
  type CreateJobRequest,
  CreateJobRequestSchema,
  type JobListParams,
  type JobListResponse,
  JobListResponseSchema,
  type JobResponse,
  JobResponseSchema,
} from "../schemas";

// ============================================
// Get Available Jobs (with filters)
// GET /api/v1/jobs
// ============================================

export const getAvailableJobs = async (params?: JobListParams): Promise<JobListResponse> => {
  try {
    // Filter out undefined/null values for cleaner query string
    const queryParams: Record<string, string | number> = {};

    if (params?.job_type) {
      queryParams.job_type = params.job_type;
    }
    if (params?.bedroom_count) {
      queryParams.bedroom_count = params.bedroom_count;
    }
    if (params?.skip !== undefined) {
      queryParams.skip = params.skip;
    }
    if (params?.limit !== undefined) {
      queryParams.limit = params.limit;
    }

    const response = await apiClient.get("/api/v1/jobs", {params: queryParams});
    return JobListResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error getting available jobs:", error);
    throw error;
  }
};

// ============================================
// Create Job (multipart/form-data)
// POST /api/v1/jobs
// ============================================

export const createJob = async (
  data: CreateJobRequest,
  itemImages?: File[],
  inventoryPdf?: File
): Promise<JobResponse> => {
  try {
    const validated = CreateJobRequestSchema.parse(data);

    const formData = new FormData();
    formData.append("job_type", validated.job_type);
    formData.append("description", validated.description);
    formData.append("pickup_address", validated.pickup_address);
    formData.append("delivery_address", validated.delivery_address);
    formData.append("pickup_datetime", validated.pickup_datetime);
    formData.append("delivery_datetime", validated.delivery_datetime);
    formData.append("payout_amount", String(validated.payout_amount));
    formData.append("cut_amount", String(validated.cut_amount));

    if (validated.bedroom_count) {
      formData.append("bedroom_count", validated.bedroom_count);
    }

    formData.append("additional_services", validated.additional_services || "");
    formData.append("loading_assistance_count", String(validated.loading_assistance_count || 0));

    if (itemImages) {
      itemImages.forEach((file) => {
        formData.append("item_images", file);
      });
    }

    if (inventoryPdf) {
      formData.append("inventory_pdf", inventoryPdf);
    }

    const response = await apiClient.post("/api/v1/jobs", formData, {
      headers: {"Content-Type": "multipart/form-data"},
    });

    return JobResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// ============================================
// Get Job By ID
// GET /api/v1/jobs/{job_id}
// ============================================

export const getJobById = async (jobId: string): Promise<JobResponse> => {
  try {
    const response = await apiClient.get(`/api/v1/jobs/${jobId}`);
    return JobResponseSchema.parse(response.data);
  } catch (error) {
    console.error(`Error getting job ${jobId}:`, error);
    throw error;
  }
};
