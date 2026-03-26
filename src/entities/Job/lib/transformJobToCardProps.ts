import type {JobResponse} from "../schemas";
import type {JobCardProps} from "../ui/JobCard/JobCard";
import { getJobTitle, getTruckSize, getWeightAndVolume } from "./constants";

const US_STATE_NAME_TO_ABBREVIATION: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  "district of columbia": "DC",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

const US_STATE_ABBREVIATIONS = new Set(Object.values(US_STATE_NAME_TO_ABBREVIATION));

const normalizeState = (rawState: string): string => {
  const abbreviationMatches = rawState.match(/\b([A-Za-z]{2})\b/g) ?? [];
  for (const match of abbreviationMatches) {
    const upper = match.toUpperCase();
    if (US_STATE_ABBREVIATIONS.has(upper)) {
      return upper;
    }
  }

  const cleanedState = rawState
    .toLowerCase()
    .replace(/[0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanedState) {
    return "";
  }

  if (US_STATE_NAME_TO_ABBREVIATION[cleanedState]) {
    return US_STATE_NAME_TO_ABBREVIATION[cleanedState];
  }

  let matchedStateName = "";
  for (const stateName of Object.keys(US_STATE_NAME_TO_ABBREVIATION)) {
    if (cleanedState.includes(stateName) && stateName.length > matchedStateName.length) {
      matchedStateName = stateName;
    }
  }

  if (matchedStateName) {
    return US_STATE_NAME_TO_ABBREVIATION[matchedStateName];
  }

  const fallbackToken = cleanedState.split(" ")[0] ?? "";
  if (fallbackToken.length === 2) {
    return fallbackToken.toUpperCase();
  }

  return rawState.trim();
};

/**
 * Parses an address string to extract city and state
 * Expected format: "123 Street, City, State ZIP" or similar
 */
const parseAddress = (address: string): {city: string; state: string} => {
  const parts = address.split(",").map((p) => p.trim());

  if (parts.length >= 2) {
    // Expected shape: street, city, state zip
    const city = parts[parts.length - 2] || "Unknown";
    const stateSource = parts[parts.length - 1] || "";
    const state = normalizeState(stateSource);
    return {city, state};
  }

  return {city: address, state: ""};
};


const formatDateRange = (
  pickupDatetime: string,
  deliveryDatetime: string
): {start: string; end: string} => {
  const pickup = new Date(pickupDatetime);
  const delivery = new Date(deliveryDatetime);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const pickupMonth = monthNames[pickup.getMonth()];
  const pickupDay = pickup.getDate();
  const deliveryDay = delivery.getDate();
  const year = delivery.getFullYear().toString();

  return {
    start: `${pickupMonth} ${pickupDay}-${deliveryDay}`,
    end: year,
  };
};




export const transformJobToCardProps = (job: JobResponse): JobCardProps => {
  const origin = parseAddress(job.pickup_address);
  const destination = parseAddress(job.delivery_address);
  const dates = formatDateRange(job.pickup_datetime, job.delivery_datetime);
  const truckSize = getTruckSize(job.bedroom_count);
  const {weight, volume} = getWeightAndVolume(job.bedroom_count);

  return {
    id: job.id,
    title: getJobTitle(job.bedroom_count, job.job_type),
    distance: 0, // Distance not provided by API - would need geo calculation
    isHotDeal: false, // Not provided by API
    isNewListing: isNewListing(job.created_at),
    origin,
    destination,
    originAddress: job.pickup_address,
    destinationAddress: job.delivery_address,
    dates,
    truckSize,
    weight,
    volume,
    price: parseFloat(job.payout_amount),
  };
};

/**
 * Checks if a job is new (created within the last 24 hours)
 */
const isNewListing = (createdAt: string): boolean => {
  const created = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return hoursDiff < 24;
};
