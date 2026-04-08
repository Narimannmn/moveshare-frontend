import { apiClient } from "@shared/api/client";

import {
  type AppliedJobsListResponse,
  AppliedJobsListResponseSchema,
  type AppliedJobsParams,
  type CancelJobsRequest,
  CancelJobsRequestSchema,
  type CancelJobsResponse,
  CancelJobsResponseSchema,
  type ConfirmClaimCheckoutSessionRequest,
  ConfirmClaimCheckoutSessionRequestSchema,
  type ConfirmClaimCheckoutSessionResponse,
  ConfirmClaimCheckoutSessionResponseSchema,
  type CreateClaimCheckoutSessionRequest,
  CreateClaimCheckoutSessionRequestSchema,
  type CreateClaimCheckoutSessionResponse,
  CreateClaimCheckoutSessionResponseSchema,
  type CreateJobRequest,
  CreateJobRequestSchema,
  type ExportJobsRequest,
  ExportJobsRequestSchema,
  type JobListParams,
  type JobLocationsResponse,
  JobLocationsResponseSchema,
  type JobListResponse,
  JobListResponseSchema,
  type JobResponse,
  JobResponseSchema,
  type MyJobsParams,
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
    if (params?.offset !== undefined) {
      queryParams.offset = params.offset;
    }
    if (params?.limit !== undefined) {
      queryParams.limit = params.limit;
    }
    if (params?.origin) {
      queryParams.origin = params.origin;
    }
    if (params?.destination) {
      queryParams.destination = params.destination;
    }

    const response = await apiClient.get("/api/v1/jobs", { params: queryParams });
    return JobListResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error getting available jobs:", error);
    throw error;
  }
};

// ============================================
// Get Available Job Locations for Filters
// GET /api/v1/jobs/locations
// ============================================

export const getAvailableJobLocations = async (): Promise<JobLocationsResponse> => {
  try {
    const response = await apiClient.get("/api/v1/jobs/locations");
    return JobLocationsResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error getting available job locations:", error);
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
      headers: { "Content-Type": "multipart/form-data" },
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

// ============================================
// Get My Jobs (jobs created by current user)
// GET /api/v1/jobs/my
// ============================================

export const getMyJobs = async (params?: MyJobsParams): Promise<JobListResponse> => {
  try {
    const queryParams: Record<string, string | number> = {};

    if (params?.status) {
      queryParams.status = params.status;
    }
    if (params?.offset !== undefined) {
      queryParams.offset = params.offset;
    }
    if (params?.limit !== undefined) {
      queryParams.limit = params.limit;
    }

    const response = await apiClient.get("/api/v1/jobs/my", { params: queryParams });
    return JobListResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error getting my jobs:", error);
    throw error;
  }
};

// ============================================
// Export Jobs CSV
// POST /api/v1/jobs/export/csv
// ============================================

export const exportJobsCsv = async (request?: ExportJobsRequest): Promise<Blob> => {
  try {
    const validated = ExportJobsRequestSchema.parse(request ?? {});
    const response = await apiClient.post("/api/v1/jobs/export/csv", validated, {
      responseType: "blob",
    });

    return response.data as Blob;
  } catch (error) {
    console.error("Error exporting jobs csv:", error);
    throw error;
  }
};

// ============================================
// Cancel Jobs (bulk)
// POST /api/v1/jobs/bulk/cancel
// ============================================

export const cancelJobs = async (request: CancelJobsRequest): Promise<CancelJobsResponse> => {
  try {
    const validated = CancelJobsRequestSchema.parse(request);
    const response = await apiClient.post("/api/v1/jobs/bulk/cancel", validated);
    return CancelJobsResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error cancelling jobs:", error);
    throw error;
  }
};

// ============================================
// Create claim checkout session
// POST /api/v1/jobs/{job_id}/claim/checkout-session
// ============================================

export const createClaimCheckoutSession = async (
  jobId: string,
  request: CreateClaimCheckoutSessionRequest
): Promise<CreateClaimCheckoutSessionResponse> => {
  try {
    const validated = CreateClaimCheckoutSessionRequestSchema.parse(request);
    const response = await apiClient.post(`/api/v1/jobs/${jobId}/claim/checkout-session`, validated);
    return CreateClaimCheckoutSessionResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error creating claim checkout session:", error);
    throw error;
  }
};

// ============================================
// Confirm claim checkout session
// POST /api/v1/jobs/claim/confirm
// ============================================

export const confirmClaimCheckoutSession = async (
  request: ConfirmClaimCheckoutSessionRequest
): Promise<ConfirmClaimCheckoutSessionResponse> => {
  try {
    const validated = ConfirmClaimCheckoutSessionRequestSchema.parse(request);
    const response = await apiClient.post("/api/v1/jobs/claim/confirm", validated);
    return ConfirmClaimCheckoutSessionResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error confirming claim checkout session:", error);
    throw error;
  }
};

// ============================================
// Get applied/claimed jobs for current mover
// GET /api/v1/jobs/applied
// ============================================

export const getAppliedJobs = async (params?: AppliedJobsParams): Promise<AppliedJobsListResponse> => {
  try {
    const queryParams: Record<string, string | number> = {};

    if (params?.status) {
      queryParams.status = params.status;
    }
    if (params?.skip !== undefined) {
      queryParams.skip = params.skip;
    }
    if (params?.limit !== undefined) {
      queryParams.limit = params.limit;
    }

    const response = await apiClient.get("/api/v1/jobs/applied", { params: queryParams });
    return AppliedJobsListResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error getting applied jobs:", error);
    throw error;
  }
};
