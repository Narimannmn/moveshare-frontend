import { queryOptions, useQuery } from "@tanstack/react-query";

import type { CompanyListParams } from "../schemas";
import { companyKeys } from "./keys";
import * as services from "./services";

export const companiesQueryOptions = (params?: CompanyListParams) =>
  queryOptions({
    queryKey: companyKeys.list(params),
    queryFn: () => services.getCompanies(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useCompanies = (params?: CompanyListParams) => {
  return useQuery(companiesQueryOptions(params));
};
