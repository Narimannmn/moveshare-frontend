import {apiClient} from "@shared/api/client";

import {
  type CreateJobRequest,
  CreateJobRequestSchema,
  type JobResponse,
  JobResponseSchema,
  type ListJobsResponse,
  ListJobsResponseSchema,
  type UpdateJobRequest,
  UpdateJobRequestSchema,
} from "../schemas";

// ============================================
// Create Job (multipart/form-data)
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
// List Jobs
// ============================================

export const listMyJobs = async (params?: {
  limit?: number;
  offset?: number;
}): Promise<ListJobsResponse> => {
  try {
    const response = await apiClient.get("/api/v1/jobs/my", {params});
    return ListJobsResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error listing my jobs:", error);
    throw error;
  }
};

export const listAvailableJobs = async (params?: {
  limit?: number;
  offset?: number;
}): Promise<ListJobsResponse> => {
  try {
    const response = await apiClient.get("/api/v1/jobs/available", {params});
    return ListJobsResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error listing available jobs:", error);
    throw error;
  }
};

// ============================================
// Get Job
// ============================================

export const getJob = async (jobId: string): Promise<JobResponse> => {
  try {
    const response = await apiClient.get(`/api/v1/jobs/${jobId}`);
    return JobResponseSchema.parse(response.data);
  } catch (error) {
    console.error(`Error getting job ${jobId}:`, error);
    throw error;
  }
};

// ============================================
// Update Job
// ============================================

export const updateJob = async (jobId: string, data: UpdateJobRequest): Promise<JobResponse> => {
  try {
    const validated = UpdateJobRequestSchema.parse(data);
    const response = await apiClient.put(`/api/v1/jobs/${jobId}`, validated);
    return JobResponseSchema.parse(response.data);
  } catch (error) {
    console.error(`Error updating job ${jobId}:`, error);
    throw error;
  }
};

// ============================================
// Cancel Job
// ============================================

export const cancelJob = async (jobId: string): Promise<void> => {
  try {
    await apiClient.post(`/api/v1/jobs/${jobId}/cancel`);
  } catch (error) {
    console.error(`Error cancelling job ${jobId}:`, error);
    throw error;
  }
};
