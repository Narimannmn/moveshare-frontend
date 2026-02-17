import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/shared/ui/Button/Button";
import { Input } from "@/shared/ui/Input/Input";
import { Textarea } from "@/shared/ui/Textarea/Textarea";

import { useCompanyProfile } from "@/entities/Auth";

export const Route = createFileRoute("/(app)/profile/company/")({
  component: CompanyInformationPage,
});

function CompanyInformationPage() {
  const { data: companyProfile, isLoading, isError, refetch } = useCompanyProfile();

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    emailAddress: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    mcLicenseNumber: "",
    dotNumber: "",
    companyDescription: "",
  });

  useEffect(() => {
    if (!companyProfile) return;

    setFormData({
      companyName: companyProfile.name,
      contactPerson: companyProfile.contact_person,
      emailAddress: companyProfile.email,
      phoneNumber: companyProfile.phone_number,
      address: companyProfile.address,
      city: companyProfile.city,
      state: companyProfile.state,
      zipCode: companyProfile.zip_code,
      mcLicenseNumber: companyProfile.mc_license_number,
      dotNumber: companyProfile.dot_number,
      companyDescription: companyProfile.description ?? "",
    });
  }, [companyProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (!companyProfile) return;

    setFormData({
      companyName: companyProfile.name,
      contactPerson: companyProfile.contact_person,
      emailAddress: companyProfile.email,
      phoneNumber: companyProfile.phone_number,
      address: companyProfile.address,
      city: companyProfile.city,
      state: companyProfile.state,
      zipCode: companyProfile.zip_code,
      mcLicenseNumber: companyProfile.mc_license_number,
      dotNumber: companyProfile.dot_number,
      companyDescription: companyProfile.description ?? "",
    });
  };

  const handleSave = () => {
    // TODO: Implement company profile update endpoint
    console.log("Save clicked", formData);
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

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-[#202224] mb-2">Email Address</label>
            <Input
              name="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleInputChange}
              placeholder="contact@transatlantic.com"
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
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="1234 S Wabash Ave"
            />
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
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
