import type {JobResponse} from "../schemas";
import type {JobCardProps} from "../ui/JobCard/JobCard";

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

/**
 * Formats bedroom count enum to display title
 */
const formatBedroomTitle = (
  bedroomCount: JobResponse["bedroom_count"],
  jobType: JobResponse["job_type"]
): string => {
  if (bedroomCount) {
    const bedroomMap: Record<string, string> = {
      "1_bedroom": "1 Bedroom",
      "2_bedroom": "2 Bedroom",
      "3_bedroom": "3 Bedroom",
      "4_bedroom": "4 Bedroom",
      "5_bedroom": "5 Bedroom",
      "6_plus_bedroom": "6+ Bedroom",
    };
    return `${bedroomMap[bedroomCount] || bedroomCount} Move`;
  }

  const jobTypeMap: Record<string, string> = {
    residential: "Residential Move",
    office: "Office Move",
    storage: "Storage Move",
  };

  return jobTypeMap[jobType] || "Move";
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


const getTruckSize = (
  bedroomCount: JobResponse["bedroom_count"]
): {type: string; length: string} => {
  if (!bedroomCount) {
    return {type: "Standard", length: "26'"};
  }

  const truckSizeMap: Record<string, {type: string; length: string}> = {
    "1_bedroom": {type: "Small", length: "16'"},
    "2_bedroom": {type: "Medium", length: "26'"},
    "3_bedroom": {type: "Medium", length: "40'"},
    "4_bedroom": {type: "Large", length: "40'"},
    "5_bedroom": {type: "Large", length: "53'"},
    "6_plus_bedroom": {type: "Extra Large", length: "53'"},
  };

  return truckSizeMap[bedroomCount] || {type: "Medium", length: "26'"};
};

/**
 * Estimates weight and volume based on bedroom count
 */
const getWeightAndVolume = (
  bedroomCount: JobResponse["bedroom_count"]
): {weight: number; volume: number} => {
  if (!bedroomCount) {
    return {weight: 3000, volume: 800};
  }

  const estimateMap: Record<string, {weight: number; volume: number}> = {
    "1_bedroom": {weight: 2000, volume: 500},
    "2_bedroom": {weight: 4000, volume: 1000},
    "3_bedroom": {weight: 6000, volume: 1500},
    "4_bedroom": {weight: 8000, volume: 2000},
    "5_bedroom": {weight: 10000, volume: 2500},
    "6_plus_bedroom": {weight: 12000, volume: 3000},
  };

  return estimateMap[bedroomCount] || {weight: 4000, volume: 1000};
};

/**
 * Transforms a JobResponse from the API to JobCardProps for the UI
 */
export const transformJobToCardProps = (job: JobResponse): JobCardProps => {
  const origin = parseAddress(job.pickup_address);
  const destination = parseAddress(job.delivery_address);
  const dates = formatDateRange(job.pickup_datetime, job.delivery_datetime);
  const truckSize = getTruckSize(job.bedroom_count);
  const {weight, volume} = getWeightAndVolume(job.bedroom_count);

  return {
    id: job.id,
    title: formatBedroomTitle(job.bedroom_count, job.job_type),
    distance: 0, // Distance not provided by API - would need geo calculation
    isHotDeal: false, // Not provided by API
    isNewListing: isNewListing(job.created_at),
    origin,
    destination,
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
