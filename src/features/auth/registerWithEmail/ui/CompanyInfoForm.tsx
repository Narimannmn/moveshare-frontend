import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { Button, ErrorMessage, Input, Textarea, Typography } from "@shared/ui";

import { useRegisterCompany } from "@entities/Auth";

const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  mcLicenseNumber: z.string().min(1, "MC license number is required"),
  dotNumber: z.string().min(1, "DOT number is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CompanyInfoFormProps {
  onSuccess?: () => void;
}

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ onSuccess }) => {
  const registerCompany = useRegisterCompany();
  const tempToken = useAuthStore((state) => state.tempToken);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
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

  const onSubmit = (values: FormData) => {
    if (!tempToken) {
      console.error("No temp token available");
      return;
    }

    // Map camelCase to snake_case for API
    registerCompany.mutate(
      {
        name: values.name,
        email: values.email,
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
              />
            )}
          />
        </div>

        {/* Row 2: Email Address + Phone Number */}
        <div className="grid grid-cols-2 gap-8">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Email Address"
                type="email"
                placeholder="contact@company.com"
                error={errors.email?.message}
                disabled={registerCompany.isPending}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                error={errors.phoneNumber?.message}
                disabled={registerCompany.isPending}
              />
            )}
          />
        </div>

        {/* Row 3: Address + City */}
        <div className="grid grid-cols-2 gap-8">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Address"
                placeholder="Enter address company"
                error={errors.address?.message}
                disabled={registerCompany.isPending}
              />
            )}
          />

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
        </div>

        {/* Row 4: State + ZIP Code */}
        <div className="grid grid-cols-2 gap-8">
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
        </div>

        {/* Row 5: MC License Number + DOT Number */}
        <div className="grid grid-cols-2 gap-8">
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

          <Controller
            name="dotNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="DOT Number"
                placeholder="Enteer DOT number"
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
