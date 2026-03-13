import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { Button, ErrorMessage, Input, Textarea, Typography } from "@shared/ui";

import { useRegisterCompany } from "@entities/Auth";
import {
  type PlacePrediction,
  getPlaceAutocomplete,
  getPlaceDetails,
} from "@features/postJob/api/places";

const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  mcLicenseNumber: z.string().min(1, "MC license number is required"),
  dotNumber: z.string().min(1, "DOT number is required"),
  contactPerson: z
    .string()
    .min(1, "Contact person is required")
    .regex(/^[\p{L}\s'-]+$/u, "Contact person must contain only letters"),
  phoneNumber: z
    .string()
    .min(2, "Phone number is required")
    .regex(/^\+\d+$/, "Phone number must start with + and contain only digits"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CompanyInfoFormProps {
  onSuccess?: () => void;
}

const createSessionToken = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ onSuccess }) => {
  const registerCompany = useRegisterCompany();
  const tempToken = useAuthStore((state) => state.tempToken);
  const [addressPredictions, setAddressPredictions] = useState<PlacePrediction[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [addressActiveIndex, setAddressActiveIndex] = useState(-1);
  const [selectedAddressPlaceId, setSelectedAddressPlaceId] = useState<string | null>(null);
  const [selectedAddressText, setSelectedAddressText] = useState<string | null>(null);

  const addressSessionTokenRef = useRef<string | null>(null);
  const addressRequestIdRef = useRef(0);
  const addressBlurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      state: "",
      city: "",
      zipCode: "",
      mcLicenseNumber: "",
      dotNumber: "",
      contactPerson: "",
      phoneNumber: "",
      description: "",
    },
  });
  const addressValue = useWatch({ control, name: "address" }) ?? "";

  useEffect(() => {
    const query = addressValue.trim();

    if (selectedAddressPlaceId && selectedAddressText && query === selectedAddressText) {
      setAddressPredictions([]);
      setAddressLoading(false);
      setAddressActiveIndex(-1);
      setShowAddressDropdown(false);
      return;
    }

    if (query.length < 3) {
      setAddressPredictions([]);
      setAddressLoading(false);
      setAddressActiveIndex(-1);
      setShowAddressDropdown(false);
      return;
    }

    const requestId = ++addressRequestIdRef.current;
    setAddressLoading(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await getPlaceAutocomplete(query, addressSessionTokenRef.current ?? undefined);
        if (requestId !== addressRequestIdRef.current) return;

        setAddressPredictions(result.predictions);
        setAddressActiveIndex(result.predictions.length > 0 ? 0 : -1);
        setShowAddressDropdown(true);
      } catch {
        if (requestId !== addressRequestIdRef.current) return;
        setAddressPredictions([]);
        setAddressActiveIndex(-1);
      } finally {
        if (requestId === addressRequestIdRef.current) {
          setAddressLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [addressValue, selectedAddressPlaceId, selectedAddressText]);

  useEffect(() => {
    return () => {
      if (addressBlurTimeoutRef.current) {
        clearTimeout(addressBlurTimeoutRef.current);
      }
    };
  }, []);

  const onSubmit = (values: FormData) => {
    if (!tempToken) {
      console.error("No temp token available");
      return;
    }

    // Map camelCase to snake_case for API
    registerCompany.mutate(
      {
        name: values.name,
        address: values.address,
        state: values.state,
        city: values.city,
        zip_code: values.zipCode,
        mc_license_number: values.mcLicenseNumber,
        dot_number: values.dotNumber,
        contact_person: values.contactPerson,
        phone_number: values.phoneNumber,
        description: values.description,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  const handleAddressChange = (value: string, onChange: (value: string) => void) => {
    onChange(value);

    if (selectedAddressText && value.trim() !== selectedAddressText) {
      setSelectedAddressPlaceId(null);
      setSelectedAddressText(null);
    }

    if (!addressSessionTokenRef.current) {
      addressSessionTokenRef.current = createSessionToken();
    }
  };

  const handleAddressFocus = () => {
    if (!addressSessionTokenRef.current) {
      addressSessionTokenRef.current = createSessionToken();
    }

    if (!selectedAddressPlaceId && (addressPredictions.length > 0 || addressValue.trim().length >= 3)) {
      setShowAddressDropdown(true);
    }
  };

  const handleAddressBlur = () => {
    addressBlurTimeoutRef.current = setTimeout(() => {
      setShowAddressDropdown(false);
      setAddressActiveIndex(-1);
    }, 140);
  };

  const handleAddressSelect = async (
    prediction: PlacePrediction,
    onChange: (value: string) => void
  ) => {
    addressRequestIdRef.current += 1;
    const sessionToken = addressSessionTokenRef.current ?? undefined;

    onChange(prediction.description);
    setSelectedAddressPlaceId(prediction.place_id);
    setSelectedAddressText(prediction.description);
    setShowAddressDropdown(false);
    setAddressPredictions([]);
    setAddressActiveIndex(-1);

    try {
      const details = await getPlaceDetails(prediction.place_id, sessionToken);
      const resolvedAddress = details.formatted_address || prediction.description;

      setValue("address", resolvedAddress, { shouldDirty: true, shouldValidate: true });
      setSelectedAddressText(resolvedAddress);

      if (details.city) {
        setValue("city", details.city, { shouldDirty: true, shouldValidate: true });
      }
      if (details.state) {
        setValue("state", details.state, { shouldDirty: true, shouldValidate: true });
      }
      if (details.postal_code) {
        setValue("zipCode", details.postal_code, { shouldDirty: true, shouldValidate: true });
      }
    } catch {
      // Keep selected prediction text even if details endpoint fails.
    } finally {
      addressSessionTokenRef.current = null;
    }
  };

  const handleAddressKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    if (!showAddressDropdown || addressPredictions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setAddressActiveIndex((prev) => Math.min(prev + 1, addressPredictions.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setAddressActiveIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = addressPredictions[addressActiveIndex] ?? addressPredictions[0];
      if (selected) {
        void handleAddressSelect(selected, onChange);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setShowAddressDropdown(false);
      setAddressActiveIndex(-1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-6  rounded-lg">
      {/* Header with bottom border */}
      <div className="border-b border-[#D8D8D8] pb-4">
        <Typography variant="bold_20">Company Information</Typography>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        {/* Row 1: Company Name + Contact Person */}
        <div className="grid grid-cols-2 gap-8">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Company Name"
                placeholder="Enter company name"
                error={errors.name?.message}
                disabled={registerCompany.isPending}
              />
            )}
          />

          <Controller
            name="contactPerson"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Contact Person"
                placeholder="Enter contact person"
                error={errors.contactPerson?.message}
                disabled={registerCompany.isPending}
                onChange={(event) => {
                  const lettersOnly = event.target.value.replace(/[^\p{L}\s'-]/gu, "");
                  field.onChange(lettersOnly);
                }}
              />
            )}
          />
        </div>

        {/* Row 2: Phone Number + Address */}
        <div className="grid grid-cols-2 gap-8">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Phone Number"
                type="tel"
                placeholder="+1234567890"
                error={errors.phoneNumber?.message}
                disabled={registerCompany.isPending}
                inputMode="numeric"
                onChange={(event) => {
                  const digitsOnly = event.target.value.replace(/\D/g, "");
                  field.onChange(digitsOnly.length > 0 ? `+${digitsOnly}` : "");
                }}
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <div className="text-sm font-medium text-[#202224]">Address</div>
                <div className="relative">
                  <Input
                    {...field}
                    id="company-address"
                    placeholder="Street address, city, state"
                    error={errors.address?.message}
                    disabled={registerCompany.isPending}
                    autoComplete="off"
                    onChange={(event) => handleAddressChange(event.target.value, field.onChange)}
                    onFocus={handleAddressFocus}
                    onBlur={handleAddressBlur}
                    onKeyDown={(event) => handleAddressKeyDown(event, field.onChange)}
                  />

                  {showAddressDropdown && (
                    <div className="absolute z-30 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-[#D8D8D8] bg-white shadow-md">
                      {addressLoading && (
                        <div className="px-4 py-3 text-sm text-[#666C72]">Searching addresses...</div>
                      )}

                      {!addressLoading &&
                        addressPredictions.map((prediction, index) => (
                          <button
                            key={prediction.place_id}
                            type="button"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              void handleAddressSelect(prediction, field.onChange);
                            }}
                            className={`w-full px-4 py-3 text-left transition-colors ${
                              addressActiveIndex === index ? "bg-[#E9F2FE]" : "hover:bg-[#F5F6FA]"
                            }`}
                          >
                            <div className="text-sm font-semibold text-[#202224]">
                              {prediction.primary_text}
                            </div>
                            {prediction.secondary_text && (
                              <div className="mt-0.5 text-xs text-[#8B8B8B]">
                                {prediction.secondary_text}
                              </div>
                            )}
                          </button>
                        ))}

                      {!addressLoading &&
                        addressValue.trim().length >= 3 &&
                        addressPredictions.length === 0 && (
                          <div className="px-4 py-3 text-sm text-[#8B8B8B]">No addresses found</div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            )}
          />
        </div>

        {/* Row 3: City + State */}
        <div className="grid grid-cols-2 gap-8">
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="City"
                placeholder="Enter city"
                error={errors.city?.message}
                disabled={registerCompany.isPending}
              />
            )}
          />

          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="State"
                placeholder="Enter state"
                error={errors.state?.message}
                disabled={registerCompany.isPending}
              />
            )}
          />
        </div>

        {/* Row 4: ZIP Code + MC License Number */}
        <div className="grid grid-cols-2 gap-8">
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="ZIP Code"
                placeholder="Enter ZIP code"
                error={errors.zipCode?.message}
                disabled={registerCompany.isPending}
              />
            )}
          />

          <Controller
            name="mcLicenseNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="MC License Number"
                placeholder="Enter MC license number"
                error={errors.mcLicenseNumber?.message}
                disabled={registerCompany.isPending}
              />
            )}
          />
        </div>

        {/* Row 5: DOT Number */}
        <div className="grid grid-cols-2 gap-8">
          <Controller
            name="dotNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="DOT Number"
                placeholder="Enter DOT number"
                error={errors.dotNumber?.message}
                disabled={registerCompany.isPending}
              />
            )}
          />
        </div>

        {/* Row 6: Company Description (full width) */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Company Description"
              placeholder="Enter company description"
              error={errors.description?.message}
              disabled={registerCompany.isPending}
              className="min-h-[120px]"
            />
          )}
        />
      </div>

      {registerCompany.error && <ErrorMessage error={registerCompany.error} />}

      {/* Button - right aligned */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isValid || registerCompany.isPending}
          className="h-[44px] px-4 py-2.5 rounded-lg bg-[#60A5FA] hover:bg-[#60A5FA]/90 disabled:bg-[#60A5FA]/60"
        >
          {registerCompany.isPending ? "Submitting..." : "Next"}
        </Button>
      </div>
    </form>
  );
};
