import type { JobResponse } from "../schemas";
import type { JobDetailsData } from "../ui/JobDetailsModal";

const NA_VALUE = "N/A";

const BEDROOM_LABELS: Record<NonNullable<JobResponse["bedroom_count"]>, string> = {
  "1_bedroom": "1 Bedroom",
  "2_bedroom": "2 Bedroom",
  "3_bedroom": "3 Bedroom",
  "4_bedroom": "4 Bedroom",
  "5_bedroom": "5 Bedroom",
  "6_plus_bedroom": "6 Bedroom",
};

const JOB_TYPE_LABELS: Record<JobResponse["job_type"], string> = {
  residential: "Residential",
  office: "Office",
  storage: "Storage",
};

const ADDITIONAL_SERVICE_LABELS: Record<string, string> = {
  packing_boxes: "Packing Boxes",
  bulky_items: "Bulky Items",
  inventory_list: "Inventory List",
  hosting: "Hoisting",
};

const asText = (value?: string | null): string => {
  if (!value) return NA_VALUE;
  const text = value.trim();
  return text.length > 0 ? text : NA_VALUE;
};

const parseMoney = (value?: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatDate = (iso?: string | null): string => {
  if (!iso) return NA_VALUE;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return NA_VALUE;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatTime = (iso?: string | null): string => {
  if (!iso) return NA_VALUE;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return NA_VALUE;

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const formatRelativeTime = (iso?: string | null): string => {
  if (!iso) return NA_VALUE;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return NA_VALUE;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

const toCityState = (address?: string | null): string => {
  const safeAddress = asText(address);
  if (safeAddress === NA_VALUE) return NA_VALUE;

  const parts = safeAddress.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return safeAddress;

  const city = parts[parts.length - 2] ?? "";
  const stateRaw = parts[parts.length - 1] ?? "";
  const stateToken = (stateRaw.match(/[A-Za-z]{2}\b/) ?? [stateRaw.split(" ")[0]])[0] ?? "";
  const state = stateToken.toUpperCase();

  if (!city || !state) return safeAddress;
  return `${city}, ${state}`;
};

const toTitle = (job: JobResponse): string => {
  const typeLabel = JOB_TYPE_LABELS[job.job_type] ?? "Move";
  const bedroomLabel = job.bedroom_count ? BEDROOM_LABELS[job.bedroom_count] : null;

  return bedroomLabel ? `${bedroomLabel} ${typeLabel} move` : `${typeLabel} move`;
};

const toPublicJobId = (id: string): string => {
  const compact = id.replace(/-/g, "").slice(0, 8).toUpperCase();
  return compact.length > 0 ? `#${compact}` : NA_VALUE;
};

const mapAdditionalServices = (services: JobResponse["additional_services"]): string[] =>
  services.map((service) => ADDITIONAL_SERVICE_LABELS[service] ?? service);

export const createEmptyJobDetailsData = (): JobDetailsData => ({
  id: "",
  title: `${NA_VALUE} move`,
  route: NA_VALUE,
  company: {
    initials: "NA",
    name: NA_VALUE,
    reviews: null,
    avgResponseTime: NA_VALUE,
    completedJobs: null,
    badges: [],
  },
  locations: {
    pickupAddress: NA_VALUE,
    pickupAccess: NA_VALUE,
    pickupWalkDistance: NA_VALUE,
    deliveryAddress: NA_VALUE,
    deliveryAccess: NA_VALUE,
    deliveryWalkDistance: NA_VALUE,
  },
  jobDetails: {
    jobId: NA_VALUE,
    posted: NA_VALUE,
    distance: NA_VALUE,
    estimatedTime: NA_VALUE,
    truckSize: NA_VALUE,
    cargoType: NA_VALUE,
    weight: NA_VALUE,
    volume: NA_VALUE,
  },
  schedule: {
    pickupDate: NA_VALUE,
    deliveryDate: NA_VALUE,
    pickupTime: NA_VALUE,
    deliveryTime: NA_VALUE,
  },
  description: NA_VALUE,
  additionalServices: [],
  payment: {
    payout: null,
    cut: null,
    platformFee: null,
  },
});

export const transformJobToDetailsData = (job: JobResponse): JobDetailsData => ({
  id: job.id,
  title: toTitle(job),
  route: `${toCityState(job.pickup_address)} \u2192 ${toCityState(job.delivery_address)}`,
  company: {
    initials: "NA",
    name: NA_VALUE,
    reviews: null,
    avgResponseTime: NA_VALUE,
    completedJobs: null,
    badges: [],
  },
  locations: {
    pickupAddress: asText(job.pickup_address),
    pickupAccess: NA_VALUE,
    pickupWalkDistance: NA_VALUE,
    deliveryAddress: asText(job.delivery_address),
    deliveryAccess: NA_VALUE,
    deliveryWalkDistance: NA_VALUE,
  },
  jobDetails: {
    jobId: toPublicJobId(job.id),
    posted: formatRelativeTime(job.created_at),
    distance: NA_VALUE,
    estimatedTime: NA_VALUE,
    truckSize: NA_VALUE,
    cargoType: NA_VALUE,
    weight: NA_VALUE,
    volume: NA_VALUE,
  },
  schedule: {
    pickupDate: formatDate(job.pickup_datetime),
    deliveryDate: formatDate(job.delivery_datetime),
    pickupTime: formatTime(job.pickup_datetime),
    deliveryTime: formatTime(job.delivery_datetime),
  },
  description: asText(job.description),
  additionalServices: mapAdditionalServices(job.additional_services),
  payment: {
    payout: parseMoney(job.payout_amount),
    cut: parseMoney(job.cut_amount),
    platformFee: null,
  },
});
