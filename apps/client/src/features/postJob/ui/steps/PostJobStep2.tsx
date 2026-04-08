import { memo, useEffect, useMemo, useRef, useState } from "react";

import { Clock, MapPin } from "lucide-react";

import {
  type PlacePrediction,
  getPlaceAutocomplete,
  getPlaceDetails,
} from "../../api/places";
import { usePostJobStore } from "../../model/usePostJobStore";
import { MoveDetailsChecklist } from "../MoveDetailsChecklist";

// Haversine formula for straight-line distance estimate
const haversineDistance = (
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number => {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const RouteEstimates = memo(({ pickupLat, pickupLng, deliveryLat, deliveryLng }: {
  pickupLat: number; pickupLng: number;
  deliveryLat: number; deliveryLng: number;
}) => {
  const { distance, duration } = useMemo(() => {
    const miles = haversineDistance(pickupLat, pickupLng, deliveryLat, deliveryLng);
    // Rough driving estimate: ~1.3x straight line, ~50mph average
    const drivingMiles = Math.round(miles * 1.3);
    const hours = Math.floor(drivingMiles / 50);
    const minutes = Math.round((drivingMiles / 50 - hours) * 60);
    const time = hours > 0
      ? (minutes > 0 ? `~${hours}h ${minutes}m` : `~${hours}h`)
      : `~${minutes}m`;
    return { distance: `~${drivingMiles} miles`, duration: time };
  }, [pickupLat, pickupLng, deliveryLat, deliveryLng]);

  return (
    <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex gap-6">
      <div className="flex items-center gap-2">
        <MapPin className="size-4 text-[#60A5FA]" />
        <span className="text-sm text-[#202224]">
          <span className="font-semibold">{distance}</span>
          <span className="text-[#90A4AE] ml-1">est. distance</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="size-4 text-[#60A5FA]" />
        <span className="text-sm text-[#202224]">
          <span className="font-semibold">{duration}</span>
          <span className="text-[#90A4AE] ml-1">est. drive time</span>
        </span>
      </div>
    </div>
  );
});
RouteEstimates.displayName = "RouteEstimates";

interface PostJobStep2Props {
  onCancel: () => void;
}

/* LocationButtonProps — hidden until building type is re-enabled
interface LocationButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}
*/

interface AddressMeta {
  placeId: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
}

interface AddressAutocompleteFieldProps {
  label: string;
  value: string;
  predictions: PlacePrediction[];
  loading: boolean;
  showDropdown: boolean;
  activeIndex: number;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (prediction: PlacePrediction) => void;
}

const EMPTY_ADDRESS_META: AddressMeta = {
  placeId: null,
  city: null,
  state: null,
  postalCode: null,
  country: null,
  lat: null,
  lng: null,
};

/* selectChevronStyle — hidden until floor select is re-enabled
const selectChevronStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23202224' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  backgroundSize: "14px",
} as const;
*/

const createSessionToken = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

/* LocationButton — hidden until building type is re-enabled
const LocationButton = ({ label, selected, onClick }: LocationButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 h-11 border rounded-lg px-4 text-sm font-normal ${
      selected
        ? "border-[#60A5FA] bg-[#60A5FA] text-white"
        : "border-[#D8D8D8] bg-white text-[#202224]"
    }`}
  >
    {label}
  </button>
);
*/

const AddressAutocompleteField = ({
  label,
  value,
  predictions,
  loading,
  showDropdown,
  activeIndex,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onSelect,
}: AddressAutocompleteFieldProps) => {
  const hasNoResults = value.trim().length >= 3 && !loading && predictions.length === 0;

  return (
    <div className="space-y-2">
      <p className="text-base font-normal text-[#202224]">
        {label} <span className="text-red-600">*</span>
      </p>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder="Street address, city, state"
          autoComplete="off"
          className="w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal text-[#202224] placeholder:text-[#A6A6A6] focus:outline-none focus:border-[#60A5FA]"
        />

        {showDropdown && (
          <div className="absolute z-30 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-[#D8D8D8] bg-white shadow-md">
            {loading && <div className="px-4 py-3 text-sm text-[#666C72]">Searching addresses...</div>}

            {!loading &&
              predictions.map((prediction, index) => (
                <button
                  key={prediction.place_id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onSelect(prediction);
                  }}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    activeIndex === index ? "bg-[#E9F2FE]" : "hover:bg-[#F5F6FA]"
                  }`}
                >
                  <div className="text-sm font-semibold text-[#202224]">{prediction.primary_text}</div>
                  {prediction.secondary_text && (
                    <div className="mt-0.5 text-xs text-[#8B8B8B]">{prediction.secondary_text}</div>
                  )}
                </button>
              ))}

            {!loading && hasNoResults && (
              <div className="px-4 py-3 text-sm text-[#8B8B8B]">No addresses found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const PostJobStep2 = ({ onCancel: _onCancel }: PostJobStep2Props) => {
  const formData = usePostJobStore((state) => state.formData);
  const updateFormData = usePostJobStore((state) => state.actions.updateFormData);
  const nextStep = usePostJobStore((state) => state.actions.nextStep);
  const prevStep = usePostJobStore((state) => state.actions.prevStep);

  const [pickupAddress, setPickupAddress] = useState(formData.pickupAddress);
  const [pickupMeta, setPickupMeta] = useState<AddressMeta>({
    placeId: formData.pickupPlaceId,
    city: formData.pickupCity,
    state: formData.pickupState,
    postalCode: formData.pickupPostalCode,
    country: formData.pickupCountry,
    lat: formData.pickupLat,
    lng: formData.pickupLng,
  });
  // TODO: re-enable when building type UI is restored
  // const [pickupBuildingType, setPickupBuildingType] = useState<"house" | "stairs" | "elevator">("house");
  const [pickupFloor, setPickupFloor] = useState(formData.pickupFloor);
  // const [pickupDistance, setPickupDistance] = useState<"<50" | "50-100" | "100-200" | ">200">();
  const [pickupPredictions, setPickupPredictions] = useState<PlacePrediction[]>([]);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [pickupActiveIndex, setPickupActiveIndex] = useState(-1);

  const [deliveryAddress, setDeliveryAddress] = useState(formData.deliveryAddress);
  const [deliveryMeta, setDeliveryMeta] = useState<AddressMeta>({
    placeId: formData.deliveryPlaceId,
    city: formData.deliveryCity,
    state: formData.deliveryState,
    postalCode: formData.deliveryPostalCode,
    country: formData.deliveryCountry,
    lat: formData.deliveryLat,
    lng: formData.deliveryLng,
  });
  // TODO: re-enable when building type UI is restored
  // const [deliveryBuildingType, setDeliveryBuildingType] = useState<"house" | "stairs" | "elevator">("house");
  const [deliveryFloor, setDeliveryFloor] = useState(formData.deliveryFloor);
  // const [deliveryDistance, setDeliveryDistance] = useState<"<50" | "50-100" | "100-200" | ">200">();
  const [deliveryPredictions, setDeliveryPredictions] = useState<PlacePrediction[]>([]);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);
  const [deliveryActiveIndex, setDeliveryActiveIndex] = useState(-1);

  const pickupSessionTokenRef = useRef<string | null>(null);
  const deliverySessionTokenRef = useRef<string | null>(null);
  const pickupRequestIdRef = useRef(0);
  const deliveryRequestIdRef = useRef(0);
  const pickupBlurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deliveryBlurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPickupAddress(formData.pickupAddress);
    setDeliveryAddress(formData.deliveryAddress);
    setPickupFloor(formData.pickupFloor);
    setDeliveryFloor(formData.deliveryFloor);
    setPickupMeta({
      placeId: formData.pickupPlaceId,
      city: formData.pickupCity,
      state: formData.pickupState,
      postalCode: formData.pickupPostalCode,
      country: formData.pickupCountry,
      lat: formData.pickupLat,
      lng: formData.pickupLng,
    });
    setDeliveryMeta({
      placeId: formData.deliveryPlaceId,
      city: formData.deliveryCity,
      state: formData.deliveryState,
      postalCode: formData.deliveryPostalCode,
      country: formData.deliveryCountry,
      lat: formData.deliveryLat,
      lng: formData.deliveryLng,
    });
  }, [
    formData.deliveryAddress,
    formData.deliveryCity,
    formData.deliveryCountry,
    formData.deliveryFloor,
    formData.deliveryLat,
    formData.deliveryLng,
    formData.deliveryPlaceId,
    formData.deliveryPostalCode,
    formData.deliveryState,
    formData.pickupAddress,
    formData.pickupCity,
    formData.pickupCountry,
    formData.pickupFloor,
    formData.pickupLat,
    formData.pickupLng,
    formData.pickupPlaceId,
    formData.pickupPostalCode,
    formData.pickupState,
  ]);

  useEffect(() => {
    const query = pickupAddress.trim();
    if (pickupMeta.placeId) {
      setPickupPredictions([]);
      setPickupLoading(false);
      setPickupActiveIndex(-1);
      setShowPickupDropdown(false);
      return;
    }

    if (query.length < 3) {
      setPickupPredictions([]);
      setPickupLoading(false);
      setPickupActiveIndex(-1);
      setShowPickupDropdown(false);
      return;
    }

    const requestId = ++pickupRequestIdRef.current;
    const timeout = setTimeout(async () => {
      setPickupLoading(true);
      try {
        const result = await getPlaceAutocomplete(query, pickupSessionTokenRef.current ?? undefined);
        if (requestId !== pickupRequestIdRef.current) return;
        setPickupPredictions(result.predictions);
        setPickupActiveIndex(result.predictions.length > 0 ? 0 : -1);
        setShowPickupDropdown(true);
      } catch (error) {
        if (requestId !== pickupRequestIdRef.current) return;
        setPickupPredictions([]);
      } finally {
        if (requestId === pickupRequestIdRef.current) {
          setPickupLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [pickupAddress, pickupMeta.placeId]);

  useEffect(() => {
    const query = deliveryAddress.trim();
    if (deliveryMeta.placeId) {
      setDeliveryPredictions([]);
      setDeliveryLoading(false);
      setDeliveryActiveIndex(-1);
      setShowDeliveryDropdown(false);
      return;
    }

    if (query.length < 3) {
      setDeliveryPredictions([]);
      setDeliveryLoading(false);
      setDeliveryActiveIndex(-1);
      setShowDeliveryDropdown(false);
      return;
    }

    const requestId = ++deliveryRequestIdRef.current;
    const timeout = setTimeout(async () => {
      setDeliveryLoading(true);
      try {
        const result = await getPlaceAutocomplete(query, deliverySessionTokenRef.current ?? undefined);
        if (requestId !== deliveryRequestIdRef.current) return;
        setDeliveryPredictions(result.predictions);
        setDeliveryActiveIndex(result.predictions.length > 0 ? 0 : -1);
        setShowDeliveryDropdown(true);
      } catch (error) {
        if (requestId !== deliveryRequestIdRef.current) return;
        setDeliveryPredictions([]);
      } finally {
        if (requestId === deliveryRequestIdRef.current) {
          setDeliveryLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [deliveryAddress, deliveryMeta.placeId]);

  useEffect(() => {
    return () => {
      if (pickupBlurTimeoutRef.current) clearTimeout(pickupBlurTimeoutRef.current);
      if (deliveryBlurTimeoutRef.current) clearTimeout(deliveryBlurTimeoutRef.current);
    };
  }, []);

  const handlePickupAddressChange = (value: string) => {
    if (!pickupSessionTokenRef.current) {
      pickupSessionTokenRef.current = createSessionToken();
    }
    setPickupAddress(value);
    setPickupMeta(EMPTY_ADDRESS_META);
    setShowPickupDropdown(true);
  };

  const handleDeliveryAddressChange = (value: string) => {
    if (!deliverySessionTokenRef.current) {
      deliverySessionTokenRef.current = createSessionToken();
    }
    setDeliveryAddress(value);
    setDeliveryMeta(EMPTY_ADDRESS_META);
    setShowDeliveryDropdown(true);
  };

  const handlePickupSelect = async (prediction: PlacePrediction) => {
    pickupRequestIdRef.current += 1;
    const sessionToken = pickupSessionTokenRef.current ?? undefined;

    setPickupMeta({
      ...EMPTY_ADDRESS_META,
      placeId: prediction.place_id,
    });
    setPickupAddress(prediction.description);
    setPickupPredictions([]);
    setPickupActiveIndex(-1);
    setShowPickupDropdown(false);

    try {
      const details = await getPlaceDetails(prediction.place_id, sessionToken);
      setPickupAddress(details.formatted_address || prediction.description);
      setPickupMeta({
        placeId: details.place_id,
        city: details.city,
        state: details.state,
        postalCode: details.postal_code,
        country: details.country,
        lat: details.lat,
        lng: details.lng,
      });
    } catch (error) {
      setPickupMeta({
        ...EMPTY_ADDRESS_META,
        placeId: prediction.place_id,
      });
    } finally {
      pickupSessionTokenRef.current = null;
    }
  };

  const handleDeliverySelect = async (prediction: PlacePrediction) => {
    deliveryRequestIdRef.current += 1;
    const sessionToken = deliverySessionTokenRef.current ?? undefined;

    setDeliveryMeta({
      ...EMPTY_ADDRESS_META,
      placeId: prediction.place_id,
    });
    setDeliveryAddress(prediction.description);
    setDeliveryPredictions([]);
    setDeliveryActiveIndex(-1);
    setShowDeliveryDropdown(false);

    try {
      const details = await getPlaceDetails(prediction.place_id, sessionToken);
      setDeliveryAddress(details.formatted_address || prediction.description);
      setDeliveryMeta({
        placeId: details.place_id,
        city: details.city,
        state: details.state,
        postalCode: details.postal_code,
        country: details.country,
        lat: details.lat,
        lng: details.lng,
      });
    } catch (error) {
      setDeliveryMeta({
        ...EMPTY_ADDRESS_META,
        placeId: prediction.place_id,
      });
    } finally {
      deliverySessionTokenRef.current = null;
    }
  };

  const handlePickupKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showPickupDropdown || pickupPredictions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setPickupActiveIndex((prev) => Math.min(prev + 1, pickupPredictions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setPickupActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const selected = pickupPredictions[pickupActiveIndex] ?? pickupPredictions[0];
      if (selected) {
        void handlePickupSelect(selected);
      }
    } else if (event.key === "Escape") {
      setShowPickupDropdown(false);
    }
  };

  const handleDeliveryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDeliveryDropdown || deliveryPredictions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setDeliveryActiveIndex((prev) => Math.min(prev + 1, deliveryPredictions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setDeliveryActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const selected = deliveryPredictions[deliveryActiveIndex] ?? deliveryPredictions[0];
      if (selected) {
        void handleDeliverySelect(selected);
      }
    } else if (event.key === "Escape") {
      setShowDeliveryDropdown(false);
    }
  };

  const handleNext = () => {
    updateFormData({
      pickupAddress,
      deliveryAddress,
      pickupPlaceId: pickupMeta.placeId,
      deliveryPlaceId: deliveryMeta.placeId,
      pickupCity: pickupMeta.city,
      pickupState: pickupMeta.state,
      pickupPostalCode: pickupMeta.postalCode,
      pickupCountry: pickupMeta.country,
      pickupLat: pickupMeta.lat,
      pickupLng: pickupMeta.lng,
      deliveryCity: deliveryMeta.city,
      deliveryState: deliveryMeta.state,
      deliveryPostalCode: deliveryMeta.postalCode,
      deliveryCountry: deliveryMeta.country,
      deliveryLat: deliveryMeta.lat,
      deliveryLng: deliveryMeta.lng,
      pickupFloor,
      deliveryFloor,
    });
    nextStep();
  };

  const handleBack = () => {
    updateFormData({
      pickupAddress,
      deliveryAddress,
      pickupPlaceId: pickupMeta.placeId,
      deliveryPlaceId: deliveryMeta.placeId,
      pickupCity: pickupMeta.city,
      pickupState: pickupMeta.state,
      pickupPostalCode: pickupMeta.postalCode,
      pickupCountry: pickupMeta.country,
      pickupLat: pickupMeta.lat,
      pickupLng: pickupMeta.lng,
      deliveryCity: deliveryMeta.city,
      deliveryState: deliveryMeta.state,
      deliveryPostalCode: deliveryMeta.postalCode,
      deliveryCountry: deliveryMeta.country,
      deliveryLat: deliveryMeta.lat,
      deliveryLng: deliveryMeta.lng,
      pickupFloor,
      deliveryFloor,
    });
    prevStep();
  };

  const isValid = pickupAddress.trim() && deliveryAddress.trim();

  return (
    <div className="flex gap-6">
      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col min-h-[500px]">
        <div className="space-y-6 flex-1">
        {/* Progress */}
        <div className="space-y-2">
          <p className="text-sm font-normal text-[#202224]">Step 2/4</p>
          <div className="w-full flex">
            <div className="flex-1 h-1.5 bg-[#60A5FA]" />
            <div className="flex-1 h-1.5 bg-[#60A5FA] rounded-br-[50px] rounded-tr-[50px]" />
            <div className="flex-1 h-1.5 bg-[#F5F6FA]" />
            <div className="flex-1 h-1.5 bg-[#F5F6FA]" />
          </div>
        </div>

        {/* Pickup Location */}
        <AddressAutocompleteField
          label="Pickup Location"
          value={pickupAddress}
          predictions={pickupPredictions}
          loading={pickupLoading}
          showDropdown={showPickupDropdown}
          activeIndex={pickupActiveIndex}
          onChange={handlePickupAddressChange}
          onFocus={() => {
            if (!pickupSessionTokenRef.current) {
              pickupSessionTokenRef.current = createSessionToken();
            }
            if (!pickupMeta.placeId && (pickupPredictions.length > 0 || pickupAddress.trim().length >= 3)) {
              setShowPickupDropdown(true);
            }
          }}
          onBlur={() => {
            pickupBlurTimeoutRef.current = setTimeout(() => {
              setShowPickupDropdown(false);
            }, 150);
          }}
          onKeyDown={handlePickupKeyDown}
          onSelect={(prediction) => {
            void handlePickupSelect(prediction);
          }}
        />

        {/* Building type, floor & distance — hidden until backend supports
        <div className="flex gap-4">
          <LocationButton
            label="House"
            selected={pickupBuildingType === "house"}
            onClick={() => setPickupBuildingType("house")}
          />
          <LocationButton
            label="Stairs"
            selected={pickupBuildingType === "stairs"}
            onClick={() => setPickupBuildingType("stairs")}
          />
          <LocationButton
            label="Elevator"
            selected={pickupBuildingType === "elevator"}
            onClick={() => setPickupBuildingType("elevator")}
          />
        </div>

        <div className="space-y-2">
          <p className="text-base font-normal text-[#202224]">
            Floor <span className="text-red-600">*</span>
          </p>
          <select
            value={pickupFloor}
            onChange={(event) => setPickupFloor(event.target.value)}
            className="w-full h-11 border border-[#D8D8D8] rounded-lg appearance-none px-4 pr-10 text-base font-normal text-[#202224] focus:outline-none focus:border-[#60A5FA] bg-white"
            style={selectChevronStyle}
          >
            <option value="">Select floor</option>
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Floor {i + 1}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <LocationButton
              label="< 50 ft"
              selected={pickupDistance === "<50"}
              onClick={() => setPickupDistance("<50")}
            />
            <LocationButton
              label="50-100 ft"
              selected={pickupDistance === "50-100"}
              onClick={() => setPickupDistance("50-100")}
            />
            <LocationButton
              label="100-200 ft"
              selected={pickupDistance === "100-200"}
              onClick={() => setPickupDistance("100-200")}
            />
            <LocationButton
              label="> 200 ft"
              selected={pickupDistance === ">200"}
              onClick={() => setPickupDistance(">200")}
            />
          </div>
        </div>
        */}

        {/* Delivery Location */}
        <AddressAutocompleteField
          label="Delivery Location"
          value={deliveryAddress}
          predictions={deliveryPredictions}
          loading={deliveryLoading}
          showDropdown={showDeliveryDropdown}
          activeIndex={deliveryActiveIndex}
          onChange={handleDeliveryAddressChange}
          onFocus={() => {
            if (!deliverySessionTokenRef.current) {
              deliverySessionTokenRef.current = createSessionToken();
            }
            if (
              !deliveryMeta.placeId &&
              (deliveryPredictions.length > 0 || deliveryAddress.trim().length >= 3)
            ) {
              setShowDeliveryDropdown(true);
            }
          }}
          onBlur={() => {
            deliveryBlurTimeoutRef.current = setTimeout(() => {
              setShowDeliveryDropdown(false);
            }, 150);
          }}
          onKeyDown={handleDeliveryKeyDown}
          onSelect={(prediction) => {
            void handleDeliverySelect(prediction);
          }}
        />

        {/* Building type, floor & distance — hidden until backend supports
        <div className="flex gap-4">
          <LocationButton
            label="House"
            selected={deliveryBuildingType === "house"}
            onClick={() => setDeliveryBuildingType("house")}
          />
          <LocationButton
            label="Stairs"
            selected={deliveryBuildingType === "stairs"}
            onClick={() => setDeliveryBuildingType("stairs")}
          />
          <LocationButton
            label="Elevator"
            selected={deliveryBuildingType === "elevator"}
            onClick={() => setDeliveryBuildingType("elevator")}
          />
        </div>

        <div className="space-y-2">
          <p className="text-base font-normal text-[#202224]">
            Floor <span className="text-red-600">*</span>
          </p>
          <select
            value={deliveryFloor}
            onChange={(event) => setDeliveryFloor(event.target.value)}
            className="w-full h-11 border border-[#D8D8D8] rounded-lg appearance-none px-4 pr-10 text-base font-normal text-[#202224] focus:outline-none focus:border-[#60A5FA] bg-white"
            style={selectChevronStyle}
          >
            <option value="">Select floor</option>
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Floor {i + 1}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <LocationButton
              label="< 50 ft"
              selected={deliveryDistance === "<50"}
              onClick={() => setDeliveryDistance("<50")}
            />
            <LocationButton
              label="50-100 ft"
              selected={deliveryDistance === "50-100"}
              onClick={() => setDeliveryDistance("50-100")}
            />
            <LocationButton
              label="100-200 ft"
              selected={deliveryDistance === "100-200"}
              onClick={() => setDeliveryDistance("100-200")}
            />
            <LocationButton
              label="> 200 ft"
              selected={deliveryDistance === ">200"}
              onClick={() => setDeliveryDistance(">200")}
            />
          </div>
        </div>
        */}

        {/* Route Preview */}
        {pickupMeta.placeId && deliveryMeta.placeId && (
          <div className="rounded-lg border border-[#D8D8D8] bg-[#F9FAFB] p-5">
            <div className="flex items-stretch gap-4">
              {/* Route visualization */}
              <div className="flex flex-col items-center py-1">
                <div className="size-3 rounded-full border-2 border-[#60A5FA] bg-white" />
                <div className="w-px flex-1 border-l-2 border-dashed border-[#60A5FA]/40 my-1" />
                <div className="size-3 rounded-full bg-[#60A5FA]" />
              </div>

              {/* Addresses */}
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#90A4AE] uppercase tracking-wide">Pickup</p>
                  <p className="text-sm font-semibold text-[#202224] mt-0.5">
                    {pickupMeta.city && pickupMeta.state
                      ? `${pickupMeta.city}, ${pickupMeta.state}`
                      : pickupAddress}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#90A4AE] uppercase tracking-wide">Delivery</p>
                  <p className="text-sm font-semibold text-[#202224] mt-0.5">
                    {deliveryMeta.city && deliveryMeta.state
                      ? `${deliveryMeta.city}, ${deliveryMeta.state}`
                      : deliveryAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Distance & Time estimates */}
            {pickupMeta.lat && pickupMeta.lng && deliveryMeta.lat && deliveryMeta.lng && (
              <RouteEstimates
                pickupLat={pickupMeta.lat}
                pickupLng={pickupMeta.lng}
                deliveryLat={deliveryMeta.lat}
                deliveryLng={deliveryMeta.lng}
              />
            )}
          </div>
        )}

        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end pt-6 mt-auto">
          <button
            type="button"
            onClick={handleBack}
            className="h-11 rounded-lg px-4 py-2.5 text-base font-normal text-[#202224] border border-[#D8D8D8] bg-white hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!isValid}
            className={`h-11 rounded-lg px-4 py-2.5 text-base font-normal text-white min-w-[120px] ${
              isValid
                ? "bg-[#60A5FA] hover:bg-[#5094E0]"
                : "bg-[rgba(96,165,250,0.6)] cursor-not-allowed"
            }`}
          >
            Next Step
          </button>
        </div>
      </div>

      <MoveDetailsChecklist
        step={2}
        preview={{
          pickupAddress,
          deliveryAddress,
        }}
      />
    </div>
  );
};
