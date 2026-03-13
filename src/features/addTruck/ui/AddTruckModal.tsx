import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ruler, Sparkles, Truck, X } from "lucide-react";
import { z } from "zod";

import { useCreateTruck, type CreateTruckRequest } from "@/entities/Truck";
import { toast } from "sonner";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from "@/shared/ui";

const addTruckFormSchema = z.object({
  name: z.string().min(2, "Truck name must be at least 2 characters"),
  license_plate: z.string().min(2, "License plate is required"),
  make: z.string().min(2, "Make is required"),
  model: z.string().min(2, "Model is required"),
  weight_lbs: z.string().min(1, "Weight is required"),
  color: z.string().optional(),
  length_ft: z.string().min(1, "Length is required"),
  width_ft: z.string().min(1, "Width is required"),
  height_ft: z.string().min(1, "Height is required"),
  max_weight_lbs: z.string().min(1, "Max weight is required"),
  truck_type: z.enum(["small", "medium", "large"]),
  has_climate_control: z.boolean(),
  has_liftgate: z.boolean(),
  has_pallet_jack: z.boolean(),
  has_security_system: z.boolean(),
  has_refrigeration: z.boolean(),
  has_furniture_pads: z.boolean(),
});

type AddTruckFormData = z.infer<typeof addTruckFormSchema>;

interface AddTruckModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddTruckModal = ({ open, onClose, onSuccess }: AddTruckModalProps) => {
  const showSuccess = (title: string, description?: string) => toast.success(title, { description });
  const showError = (title: string, description?: string) => toast.error(title, { description });
  const [selectedType, setSelectedType] = useState<"small" | "medium" | "large">("medium");
  const createTruck = useCreateTruck();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<AddTruckFormData>({
    resolver: zodResolver(addTruckFormSchema),
    mode: "onChange",
    defaultValues: {
      truck_type: "medium",
      has_climate_control: false,
      has_liftgate: false,
      has_pallet_jack: false,
      has_security_system: false,
      has_refrigeration: false,
      has_furniture_pads: false,
    },
  });

  const features = watch([
    "has_climate_control",
    "has_liftgate",
    "has_pallet_jack",
    "has_security_system",
    "has_refrigeration",
    "has_furniture_pads",
  ]);

  const handleClose = () => {
    reset();
    setSelectedType("medium");
    onClose();
  };

  const onSubmit = async (data: AddTruckFormData) => {
    try {
      const requestData: CreateTruckRequest = {
        ...data,
        weight_lbs: parseInt(data.weight_lbs),
        length_ft: parseFloat(data.length_ft),
        width_ft: parseFloat(data.width_ft),
        height_ft: parseFloat(data.height_ft),
        max_weight_lbs: parseInt(data.max_weight_lbs),
        photos: [],
      };

      await createTruck.mutateAsync(requestData);
      showSuccess("Truck Added", "Your truck has been successfully added to the fleet.");
      handleClose();
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add truck";
      showError("Add Failed", errorMessage);
    }
  };

  const handleTypeSelect = (type: "small" | "medium" | "large") => {
    setSelectedType(type);
    setValue("truck_type", type);
  };

  const toggleFeature = (feature: keyof AddTruckFormData) => {
    const currentValue = watch(feature) as boolean;
    setValue(feature, !currentValue);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-5xl p-0 max-h-[calc(100vh-24px)] overflow-hidden"
        showClose={false}
        onClose={handleClose}
      >
        {/* Header */}
        <DialogHeader className="bg-[#60A5FA] px-6 py-4 relative">
          <DialogTitle className="flex items-center gap-3 text-white text-xl font-bold">
            <Truck className="size-6" />
            Add Your Truck
          </DialogTitle>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center size-8 rounded-sm opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 absolute right-6 top-1/2 -translate-y-1/2"
            aria-label="Close"
          >
            <X className="size-6 text-white" />
          </button>
          <p className="text-white/90 text-sm mt-2">
            Register your truck to start accepting jobs on MoveShare. Fill in the details below to get started.
          </p>
        </DialogHeader>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="flex gap-6">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              {/* Truck Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-[#D8D8D8]">
                  <Truck className="size-5 text-[#2196F3]" />
                  <h3 className="font-bold text-[#263238]">Truck Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#202224] mb-2">
                    Truck Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("name")}
                    placeholder="e.g., Blue Thunder, Big Bertha"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#202224] mb-2">
                    License Plate <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("license_plate")}
                    placeholder="e.g., ABC123"
                    className={errors.license_plate ? "border-red-500" : ""}
                  />
                  {errors.license_plate && <p className="text-red-500 text-sm mt-1">{errors.license_plate.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#202224] mb-2">
                      Make <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("make")}
                      placeholder="e.g., Ford, Freightliner"
                      className={errors.make ? "border-red-500" : ""}
                    />
                    {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#202224] mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("model")}
                      placeholder="e.g., F-150, Cascadia"
                      className={errors.model ? "border-red-500" : ""}
                    />
                    {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#202224] mb-2">
                      Weight (lbs) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      {...register("weight_lbs")}
                      placeholder="e.g., 2020"
                      className={errors.weight_lbs ? "border-red-500" : ""}
                    />
                    {errors.weight_lbs && <p className="text-red-500 text-sm mt-1">{errors.weight_lbs.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#202224] mb-2">Color</label>
                    <Input {...register("color")} placeholder="e.g., Red, Blue" />
                  </div>
                </div>
              </div>

              {/* Dimensions Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-[#D8D8D8]">
                  <Ruler className="size-5 text-[#2196F3]" />
                  <h3 className="font-bold text-[#263238]">Dimensions</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#202224] mb-2">
                      Length (ft) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register("length_ft")}
                      placeholder="e.g., 26"
                      className={errors.length_ft ? "border-red-500" : ""}
                    />
                    {errors.length_ft && <p className="text-red-500 text-sm mt-1">{errors.length_ft.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#202224] mb-2">
                      Width (ft) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register("width_ft")}
                      placeholder="e.g., 8.5"
                      className={errors.width_ft ? "border-red-500" : ""}
                    />
                    {errors.width_ft && <p className="text-red-500 text-sm mt-1">{errors.width_ft.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#202224] mb-2">
                      Height (ft) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register("height_ft")}
                      placeholder="e.g., 9.5"
                      className={errors.height_ft ? "border-red-500" : ""}
                    />
                    {errors.height_ft && <p className="text-red-500 text-sm mt-1">{errors.height_ft.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#202224] mb-2">
                      Max Weight (lbs) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      {...register("max_weight_lbs")}
                      placeholder="e.g., 10000"
                      className={errors.max_weight_lbs ? "border-red-500" : ""}
                    />
                    {errors.max_weight_lbs && <p className="text-red-500 text-sm mt-1">{errors.max_weight_lbs.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-6">
              {/* Truck Type Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-[#D8D8D8]">
                  <Truck className="size-5 text-[#2196F3]" />
                  <h3 className="font-bold text-[#263238]">Truck Type</h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "small", label: "Small (15+)", description: "Studio, 1 bedroom" },
                    { value: "medium", label: "Medium (20+)", description: "2-3 bedrooms" },
                    { value: "large", label: "Large (26+)", description: "4+ bedrooms" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleTypeSelect(type.value as "small" | "medium" | "large")}
                      className={`p-4 rounded-md border-2 transition-all text-center ${
                        selectedType === type.value
                          ? "border-[#2196F3] bg-[#EAF2FF]"
                          : "border-[#D8D8D8] hover:border-[#2196F3]/50"
                      }`}
                    >
                      <Truck className="size-8 mx-auto mb-2 text-[#2196F3]" />
                      <div className="font-bold text-sm text-[#333]">{type.label}</div>
                      <div className="text-xs text-[#90A4AE] mt-1">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Features Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-[#D8D8D8]">
                  <Sparkles className="size-5 text-[#2196F3]" />
                  <h3 className="font-bold text-[#263238]">Special Features</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "has_climate_control", label: "Climate Control", description: "Temperature sensitive cargo" },
                    { key: "has_liftgate", label: "Liftgate", description: "Ground level loading" },
                    { key: "has_pallet_jack", label: "Pallet Jack", description: "Pallet loading capability" },
                    { key: "has_security_system", label: "Security System", description: "Cargo protection" },
                    { key: "has_refrigeration", label: "Refrigerated", description: "Cold storage" },
                    { key: "has_furniture_pads", label: "Furniture Pads", description: "Protect delicate items" },
                  ].map((feature, index) => (
                    <button
                      key={feature.key}
                      type="button"
                      onClick={() => toggleFeature(feature.key as keyof AddTruckFormData)}
                      className={`p-3 rounded-lg transition-all text-left flex items-start gap-3 ${
                        features[index]
                          ? "bg-[#EAF2FF] border-2 border-[#2196F3]"
                          : "bg-[#F5F6FA] border-2 border-transparent"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        features[index] ? "bg-[#2196F3]" : "bg-[#E3F2FD]"
                      }`}>
                        <span className="text-white text-lg">✓</span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-black">{feature.label}</div>
                        <div className="text-xs text-[#90A4AE]">{feature.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-[#D8D8D8]">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createTruck.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!isValid || createTruck.isPending}>
              {createTruck.isPending ? "Adding Truck..." : "Add Truck"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
