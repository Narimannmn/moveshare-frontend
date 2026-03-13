import { useEffect, useRef, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/shared/ui/Button/Button";
import { Input } from "@/shared/ui/Input/Input";
import { Textarea } from "@/shared/ui/Textarea/Textarea";
import { toast } from "sonner";

import { useCompanyProfile, useUpdateCompanyProfile } from "@/entities/Auth";
import {
  type PlacePrediction,
  getPlaceAutocomplete,
  getPlaceDetails,
} from "@/features/postJob/api/places";

const createSessionToken = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const Route = createFileRoute("/(app)/profile/company/")({
  component: CompanyInformationPage,
});

function CompanyInformationPage() {
  const { data: companyProfile, isLoading, isError, refetch } = useCompanyProfile();
  const updateProfile = useUpdateCompanyProfile();
  const success = (title: string, description?: string) => toast.success(title, { description });
  const error = (title: string, description?: string) => toast.error(title, { description });
  const [addressPredictions, setAddressPredictions] = useState<PlacePrediction[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [addressActiveIndex, setAddressActiveIndex] = useState(-1);
  const [selectedAddressText, setSelectedAddressText] = useState<string | null>(null);
  const [isAddressFocused, setIsAddressFocused] = useState(false);

  const addressSessionTokenRef = useRef<string | null>(null);
  const addressRequestIdRef = useRef(0);
  const addressBlurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    mcLicenseNumber: "",
    dotNumber: "",
    companyDescription: "",
  });

  const [initialFormData, setInitialFormData] = useState(formData);

  useEffect(() => {
    if (!companyProfile) return;

    const data = {
      companyName: companyProfile.name,
      contactPerson: companyProfile.contact_person,
      phoneNumber: companyProfile.phone_number,
      address: companyProfile.address,
      city: companyProfile.city,
      state: companyProfile.state,
      zipCode: companyProfile.zip_code,
      mcLicenseNumber: companyProfile.mc_license_number,
      dotNumber: companyProfile.dot_number,
      companyDescription: companyProfile.description ?? "",
    };

    setFormData(data);
    setInitialFormData(data);
    setSelectedAddressText(companyProfile.address);
  }, [companyProfile]);

  useEffect(() => {
    const query = formData.address.trim();

    if (selectedAddressText && query === selectedAddressText) {
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
        setShowAddressDropdown(isAddressFocused);
      } catch {
        if (requestId !== addressRequestIdRef.current) return;
        setAddressPredictions([]);
        setAddressActiveIndex(-1);
        setShowAddressDropdown(false);
      } finally {
        if (requestId === addressRequestIdRef.current) {
          setAddressLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [formData.address, isAddressFocused, selectedAddressText]);

  useEffect(() => {
    return () => {
      if (addressBlurTimeoutRef.current) {
        clearTimeout(addressBlurTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (value: string) => {
    setFormData((prev) => ({ ...prev, address: value }));

    if (selectedAddressText && value.trim() !== selectedAddressText) {
      setSelectedAddressText(null);
    }

    if (!addressSessionTokenRef.current) {
      addressSessionTokenRef.current = createSessionToken();
    }
  };

  const handleAddressFocus = () => {
    setIsAddressFocused(true);
    if (!addressSessionTokenRef.current) {
      addressSessionTokenRef.current = createSessionToken();
    }
    if (addressPredictions.length > 0 || formData.address.trim().length >= 3) {
      setShowAddressDropdown(true);
    }
  };

  const handleAddressBlur = () => {
    setIsAddressFocused(false);
    addressBlurTimeoutRef.current = setTimeout(() => {
      setShowAddressDropdown(false);
      setAddressActiveIndex(-1);
    }, 140);
  };

  const handleAddressSelect = async (prediction: PlacePrediction) => {
    addressRequestIdRef.current += 1;
    const sessionToken = addressSessionTokenRef.current ?? undefined;

    setFormData((prev) => ({
      ...prev,
      address: prediction.description,
    }));
    setSelectedAddressText(prediction.description);
    setShowAddressDropdown(false);
    setAddressPredictions([]);
    setAddressActiveIndex(-1);

    try {
      const details = await getPlaceDetails(prediction.place_id, sessionToken);
      const resolvedAddress = details.formatted_address || prediction.description;

      setFormData((prev) => ({
        ...prev,
        address: resolvedAddress,
        city: details.city ?? prev.city,
        state: details.state ?? prev.state,
        zipCode: details.postal_code ?? prev.zipCode,
      }));
      setSelectedAddressText(resolvedAddress);
    } catch {
      // Keep selected prediction text if details request fails.
    } finally {
      addressSessionTokenRef.current = null;
    }
  };

  const handleAddressKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
        void handleAddressSelect(selected);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setShowAddressDropdown(false);
      setAddressActiveIndex(-1);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setSelectedAddressText(initialFormData.address);
    setShowAddressDropdown(false);
    setAddressPredictions([]);
    setAddressActiveIndex(-1);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        name: formData.companyName,
        contact_person: formData.contactPerson,
        phone_number: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        mc_license_number: formData.mcLicenseNumber,
        dot_number: formData.dotNumber,
        description: formData.companyDescription || null,
      });

      success("Profile Updated", "Company profile has been updated successfully.");
    } catch (err) {
      console.error("Failed to update company profile:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      error("Update Failed", errorMessage);
    }
  };

  if (isLoading) {
    return <div className="text-[#666C72]">Loading company information...</div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-[#FF0000]">Failed to load company information.</p>
        <div>
          <Button variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#202224] mb-6">Company Information</h2>

      <div className="border-t border-gray-200 pt-6">
        {/* Two-column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-[#202224] mb-2">Company Name</label>
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="TransAtlantic Logistics"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-[#202224] mb-2">Contact Person</label>
            <Input
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              placeholder="John Smith"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-[#202224] mb-2">Phone Number</label>
            <Input
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="(312) 555-0198"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#202224] mb-2">Address</label>
            <div className="relative">
              <Input
                name="address"
                value={formData.address}
                onChange={(event) => handleAddressInputChange(event.target.value)}
                onFocus={handleAddressFocus}
                onBlur={handleAddressBlur}
                onKeyDown={handleAddressKeyDown}
                placeholder="Street address, city, state"
                autoComplete="off"
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
                          void handleAddressSelect(prediction);
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
                    formData.address.trim().length >= 3 &&
                    addressPredictions.length === 0 && (
                      <div className="px-4 py-3 text-sm text-[#8B8B8B]">No addresses found</div>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-[#202224] mb-2">City</label>
            <Input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Chicago"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-[#202224] mb-2">State</label>
            <Input
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Illinois"
            />
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-sm font-medium text-[#202224] mb-2">ZIP Code</label>
            <Input
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="60605"
            />
          </div>

          {/* MC License Number */}
          <div>
            <label className="block text-sm font-medium text-[#202224] mb-2">
              MC License Number
            </label>
            <Input
              name="mcLicenseNumber"
              value={formData.mcLicenseNumber}
              onChange={handleInputChange}
              placeholder="MC-1234567"
            />
          </div>

          {/* DOT Number */}
          <div>
            <label className="block text-sm font-medium text-[#202224] mb-2">DOT Number</label>
            <Input
              name="dotNumber"
              value={formData.dotNumber}
              onChange={handleInputChange}
              placeholder="DOT-9876543"
            />
          </div>
        </div>

        {/* Company Description - Full width */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-[#202224] mb-2">
            Company Description
          </label>
          <Textarea
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleInputChange}
            placeholder="Describe your company..."
            rows={4}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={updateProfile.isPending || !hasChanges()}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={updateProfile.isPending || !hasChanges()}
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
