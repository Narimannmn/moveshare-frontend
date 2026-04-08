import type { JobResponse } from "../schemas";
import type { JobDetailsData } from "../ui/JobDetailsModal";
import { JOB_TYPE_LABELS, TRUCK_SIZE_MAP, getJobTitle } from "./constants";

const NA_VALUE = "N/A";

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

const toInitials = (name?: string | null): string => {
  const text = asText(name);
  if (text === NA_VALUE) return "NA";

  const words = text
    .split(" ")
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) return "NA";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
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

const formatDistance = (meters: number | null | undefined): string => {
  if (meters === null || meters === undefined) return NA_VALUE;
  const miles = meters / 1609.34;
  return `${miles.toFixed(1)} mi`;
};

const formatDuration = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined) return NA_VALUE;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours === 0) return `${minutes} min`;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const toTitle = (job: JobResponse): string =>
  getJobTitle(job.bedroom_count, job.job_type);

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
    initials: toInitials(job.company?.name),
    name: asText(job.company?.name),
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
    distance: formatDistance(job.distance_meters),
    estimatedTime: formatDuration(job.duration_seconds),
    truckSize: job.bedroom_count ? (TRUCK_SIZE_MAP[job.bedroom_count] ?? NA_VALUE) : NA_VALUE,
    cargoType: JOB_TYPE_LABELS[job.job_type] ?? NA_VALUE,
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
    platformFee: 30,
  },
});
