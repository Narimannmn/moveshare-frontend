import { apiClient } from "@shared/api/client";

import {
  type CreateJobRequest,
  CreateJobRequestSchema,
  type CreateJobResponse,
  CreateJobResponseSchema,
  type JobResponse,
  JobResponseSchema,
  type ListJobsResponse,
  ListJobsResponseSchema,
  type UpdateJobRequest,
  UpdateJobRequestSchema,
  type UploadJobImageResponse,
  UploadJobImageResponseSchema,
} from "../schemas";

// ============================================
// Create Job
// ============================================

export const createJob = async (data: CreateJobRequest): Promise<CreateJobResponse> => {
  try {
    const validated = CreateJobRequestSchema.parse(data);
    const response = await apiClient.post("/api/v1/jobs", validated);
    return CreateJobResponseSchema.parse(response.data);
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
    const response = await apiClient.get("/api/v1/jobs/my", { params });
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
    const response = await apiClient.get("/api/v1/jobs/available", { params });
    return ListJobsResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error listing available jobs:", error);
    throw error;
  }
};

// ============================================
// Get Job
// ============================================

export const getJob = async (jobId: number): Promise<JobResponse> => {
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

export const updateJob = async (jobId: number, data: UpdateJobRequest): Promise<JobResponse> => {
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

export const cancelJob = async (jobId: number): Promise<void> => {
  try {
    await apiClient.post(`/api/v1/jobs/${jobId}/cancel`);
  } catch (error) {
    console.error(`Error cancelling job ${jobId}:`, error);
    throw error;
  }
};

// ============================================
// Job Images
// ============================================

export const uploadJobImage = async (
  jobId: number,
  file: File
): Promise<UploadJobImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(`/api/v1/jobs/${jobId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return UploadJobImageResponseSchema.parse(response.data);
  } catch (error) {
    console.error(`Error uploading image for job ${jobId}:`, error);
    throw error;
  }
};

export const deleteJobImage = async (jobId: number, imageId: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/jobs/${jobId}/images/${imageId}`);
  } catch (error) {
    console.error(`Error deleting image ${imageId} for job ${jobId}:`, error);
    throw error;
  }
};
