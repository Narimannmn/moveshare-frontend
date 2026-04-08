import { apiClient } from "@/shared/api/client";

import {
  type CompanyListParams,
  type CompanyManagementListResponse,
  CompanyManagementListResponseSchema,
} from "../schemas";

export const getCompanies = async (
  params?: CompanyListParams
): Promise<CompanyManagementListResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params?.status) {
    queryParams.status = params.status;
  }
  if (params?.search) {
    queryParams.search = params.search;
  }
  if (params?.offset !== undefined) {
    queryParams.offset = params.offset;
  }
  if (params?.limit !== undefined) {
    queryParams.limit = params.limit;
  }

  const response = await apiClient.get("/api/v1/admin/companies", {
    params: queryParams,
  });

  return CompanyManagementListResponseSchema.parse(response.data);
};
