import type { BedroomCount, JobType } from "../schemas";

// ============================================
// Bedroom Labels
// ============================================

export const BEDROOM_LABELS: Record<BedroomCount, string> = {
  "1_bedroom": "1 Bedroom",
  "2_bedroom": "2 Bedroom",
  "3_bedroom": "3 Bedroom",
  "4_bedroom": "4 Bedroom",
  "5_bedroom": "5 Bedroom",
  "6_plus_bedroom": "6+ Bedroom",
};

export const BEDROOM_MOVE_LABELS: Record<BedroomCount, string> = {
  "1_bedroom": "1 Bedroom Move",
  "2_bedroom": "2 Bedroom Move",
  "3_bedroom": "3 Bedroom Move",
  "4_bedroom": "4 Bedroom Move",
  "5_bedroom": "5 Bedroom Move",
  "6_plus_bedroom": "6+ Bedroom Move",
};

// ============================================
// Job Type Labels
// ============================================

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  residential: "Residential",
  office: "Office",
  storage: "Storage",
};

export const JOB_TYPE_MOVE_LABELS: Record<JobType, string> = {
  residential: "Residential Move",
  office: "Office Move",
  storage: "Storage Move",
};

// ============================================
// Truck Size
// ============================================

export const TRUCK_SIZE_MAP: Record<BedroomCount, string> = {
  "1_bedroom": "Small (16')",
  "2_bedroom": "Medium (26')",
  "3_bedroom": "Medium (40')",
  "4_bedroom": "Large (40')",
  "5_bedroom": "Large (53')",
  "6_plus_bedroom": "Extra Large (53')",
};

export const TRUCK_SIZE_DETAILS: Record<BedroomCount, { type: string; length: string }> = {
  "1_bedroom": { type: "Small", length: "16'" },
  "2_bedroom": { type: "Medium", length: "26'" },
  "3_bedroom": { type: "Medium", length: "40'" },
  "4_bedroom": { type: "Large", length: "40'" },
  "5_bedroom": { type: "Large", length: "53'" },
  "6_plus_bedroom": { type: "Extra Large", length: "53'" },
};

// ============================================
// Weight & Volume Estimates
// ============================================

export const WEIGHT_VOLUME_MAP: Record<BedroomCount, { weight: number; volume: number }> = {
  "1_bedroom": { weight: 2000, volume: 500 },
  "2_bedroom": { weight: 4000, volume: 1000 },
  "3_bedroom": { weight: 6000, volume: 1500 },
  "4_bedroom": { weight: 8000, volume: 2000 },
  "5_bedroom": { weight: 10000, volume: 2500 },
  "6_plus_bedroom": { weight: 12000, volume: 3000 },
};

// ============================================
// Truck Info (for PostJob step)
// ============================================

export interface TruckSizeInfo {
  vehicleLabel: string;
  volume: string;
  items: string[];
  imageSrc: string;
  imageClassName: string;
}

export const TRUCK_SIZE_INFO: Record<BedroomCount, TruckSizeInfo> = {
  "1_bedroom": {
    vehicleLabel: "Small Van (15+)",
    volume: "1 Bedroom - 10–15 m³",
    items: ["Bed or sofa", "Small wardrobe", "Up to 10 boxes", "TV, chairs, nightstand"],
    imageSrc: "/assets/figma/post-job/van-1.svg",
    imageClassName: "w-20 h-10",
  },
  "2_bedroom": {
    vehicleLabel: "Medium Truck",
    volume: "2 Bedroom - 20–25 m³",
    items: ["2 beds or a bed + sofa", "Wardrobe, chest of drawers", "Refrigerator, washing machine", "Up to 20 boxes"],
    imageSrc: "/assets/figma/post-job/van-1.svg",
    imageClassName: "w-20 h-10",
  },
  "3_bedroom": {
    vehicleLabel: "Medium (20+')",
    volume: "3 Bedroom - 30–35 m³",
    items: ["Sofa set, 2–3 beds", "Several wardrobes and tables", "Home appliances", "Up to 30 boxes"],
    imageSrc: "/assets/figma/post-job/trailer-1.svg",
    imageClassName: "w-[73px] h-[37px]",
  },
  "4_bedroom": {
    vehicleLabel: "Medium (20+')",
    volume: "4 Bedroom - 40–45 m³",
    items: ["Complete furniture set for a large apartment", "Sports or baby equipment", "Home appliances", "Up to 40 boxes"],
    imageSrc: "/assets/figma/post-job/trailer-1.svg",
    imageClassName: "w-[73px] h-[37px]",
  },
  "5_bedroom": {
    vehicleLabel: "Large (26+')",
    volume: "5 Bedroom - 50–55 m³",
    items: ["Full set of furniture and appliances", "Outdoor and garage items", "Home appliances", "Up to 50 boxes"],
    imageSrc: "/assets/figma/post-job/truck-1.svg",
    imageClassName: "w-[78px] h-[42px]",
  },
  "6_plus_bedroom": {
    vehicleLabel: "Large (26+')",
    volume: "6+ Bedroom - 65+ m³",
    items: ["Furniture and appliances for the entire house", "Garden and garage equipment", "Large volume of boxes and miscellaneous items"],
    imageSrc: "/assets/figma/post-job/truck-1.svg",
    imageClassName: "w-[78px] h-[42px]",
  },
};

// ============================================
// Helper Functions
// ============================================

export const getBedroomLabel = (count: BedroomCount | null | undefined): string => {
  if (!count) return "N/A";
  return BEDROOM_LABELS[count] ?? count;
};

export const getJobTitle = (
  bedroomCount: BedroomCount | null | undefined,
  jobType: JobType
): string => {
  if (bedroomCount) {
    return BEDROOM_MOVE_LABELS[bedroomCount] ?? JOB_TYPE_MOVE_LABELS[jobType] ?? "Move";
  }
  return JOB_TYPE_MOVE_LABELS[jobType] ?? "Move";
};

export const getTruckSize = (
  bedroomCount: BedroomCount | null | undefined
): { type: string; length: string } => {
  if (!bedroomCount) return { type: "Standard", length: "26'" };
  return TRUCK_SIZE_DETAILS[bedroomCount] ?? { type: "Medium", length: "26'" };
};

export const getWeightAndVolume = (
  bedroomCount: BedroomCount | null | undefined
): { weight: number; volume: number } => {
  if (!bedroomCount) return { weight: 3000, volume: 800 };
  return WEIGHT_VOLUME_MAP[bedroomCount] ?? { weight: 4000, volume: 1000 };
};

export const getTruckLabel = (bedroomCount: BedroomCount | null | undefined): string => {
  if (!bedroomCount) return "Select";
  return TRUCK_SIZE_INFO[bedroomCount]?.vehicleLabel ?? "Standard";
};
