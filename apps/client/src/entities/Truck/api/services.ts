import { apiClient } from "@shared/api/client";

import {
  type CreateTruckRequest,
  CreateTruckRequestSchema,
  type DeleteTruckResponse,
  DeleteTruckResponseSchema,
  type TruckResponse,
  TruckResponseSchema,
  type TrucksListResponse,
  TrucksListResponseSchema,
} from "../schemas/truck";

export const createTruck = async (data: CreateTruckRequest): Promise<TruckResponse> => {
  try {
    const validated = CreateTruckRequestSchema.parse(data);
    const response = await apiClient.post("/api/v1/trucks", validated);
    return TruckResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Failed to create truck:", error);
    throw error;
  }
};

export const getTrucks = async (params: {
  offset?: number;
  limit?: number;
}): Promise<TrucksListResponse> => {
  try {
    const response = await apiClient.get("/api/v1/trucks", { params });
    return TrucksListResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Failed to get trucks:", error);
    throw error;
  }
};

export const deleteTruck = async (truckId: string): Promise<DeleteTruckResponse> => {
  try {
    const response = await apiClient.delete(`/api/v1/trucks/${truckId}`);
    return DeleteTruckResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Failed to delete truck:", error);
    throw error;
  }
};
