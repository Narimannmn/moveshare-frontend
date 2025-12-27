import { z } from "zod";

export const LocationSchema = z.object({
  city: z.string(),
  state: z.string(),
});

export const DatesSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const TruckSizeSchema = z.object({
  type: z.string(),
  length: z.string(),
});

export const BadgesSchema = z.object({
  verifiedMover: z.boolean().optional(),
  paymentProtected: z.boolean().optional(),
  escrow: z.boolean().optional(),
});

export const JobSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  distance: z.number(),
  isHotDeal: z.boolean().optional(),
  isNewListing: z.boolean().optional(),
  origin: LocationSchema,
  destination: LocationSchema,
  dates: DatesSchema,
  truckSize: TruckSizeSchema,
  weight: z.number(),
  volume: z.number(),
  badges: BadgesSchema.optional(),
  price: z.number(),
});

export const JobListSchema = z.array(JobSchema);

export type Location = z.infer<typeof LocationSchema>;
export type Dates = z.infer<typeof DatesSchema>;
export type TruckSize = z.infer<typeof TruckSizeSchema>;
export type Badges = z.infer<typeof BadgesSchema>;
export type Job = z.infer<typeof JobSchema>;
export type JobList = z.infer<typeof JobListSchema>;
