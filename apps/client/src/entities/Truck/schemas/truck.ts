import { z } from "zod";

export const CreateTruckRequestSchema = z.object({
  name: z.string().min(2, "Truck name must be at least 2 characters").max(255),
  license_plate: z.string().min(2, "License plate must be at least 2 characters").max(50),
  make: z.string().min(2, "Make must be at least 2 characters").max(100),
  model: z.string().min(2, "Model must be at least 2 characters").max(100),
  weight_lbs: z.number().int().positive("Weight must be a positive number"),
  color: z.string().max(50).optional().nullable(),
  length_ft: z.number().positive("Length must be a positive number"),
  width_ft: z.number().positive("Width must be a positive number"),
  height_ft: z.number().positive("Height must be a positive number"),
  max_weight_lbs: z.number().int().positive("Max weight must be a positive number"),
  truck_type: z.enum(["small", "medium", "large"]),
  has_climate_control: z.boolean().default(false),
  has_liftgate: z.boolean().default(false),
  has_pallet_jack: z.boolean().default(false),
  has_security_system: z.boolean().default(false),
  has_refrigeration: z.boolean().default(false),
  has_furniture_pads: z.boolean().default(false),
  photos: z.array(z.string().url()).default([]),
});

export type CreateTruckRequest = z.infer<typeof CreateTruckRequestSchema>;

export const TruckResponseSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  name: z.string(),
  license_plate: z.string(),
  make: z.string(),
  model: z.string(),
  weight_lbs: z.number(),
  color: z.string().nullable(),
  length_ft: z.number(),
  width_ft: z.number(),
  height_ft: z.number(),
  max_weight_lbs: z.number(),
  truck_type: z.string(),
  has_climate_control: z.boolean(),
  has_liftgate: z.boolean(),
  has_pallet_jack: z.boolean(),
  has_security_system: z.boolean(),
  has_refrigeration: z.boolean(),
  has_furniture_pads: z.boolean(),
  photos: z.array(z.string()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type TruckResponse = z.infer<typeof TruckResponseSchema>;

export const TrucksListResponseSchema = z.object({
  trucks: z.array(TruckResponseSchema),
  total: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export type TrucksListResponse = z.infer<typeof TrucksListResponseSchema>;

export const DeleteTruckResponseSchema = z.object({
  message: z.string(),
  truck_id: z.string().uuid(),
});

export type DeleteTruckResponse = z.infer<typeof DeleteTruckResponseSchema>;
