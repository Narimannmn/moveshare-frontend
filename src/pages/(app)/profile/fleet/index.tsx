import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Truck } from "lucide-react";

import { type TruckResponse, useDeleteTruck, useTrucks } from "@/entities/Truck";
import { AddTruckModal } from "@/features/addTruck";
import { toast } from "sonner";
import { Button } from "@/shared/ui";

export const Route = createFileRoute("/(app)/profile/fleet/")({
  component: FleetManagementPage,
});

interface TruckCardProps {
  truck: TruckResponse;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function TruckCard({ truck, onDelete, isDeleting }: TruckCardProps) {
  const features: string[] = [];
  if (truck.has_climate_control) features.push("Climate Control");
  if (truck.has_liftgate) features.push("Liftgate");
  if (truck.has_pallet_jack) features.push("Pallet Jack");
  if (truck.has_security_system) features.push("Security System");
  if (truck.has_refrigeration) features.push("Refrigerated");
  if (truck.has_furniture_pads) features.push("Furniture Pads");

  const formatTruckType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#202224]">{truck.name}</h3>
            <p className="text-sm text-gray-500">
              {truck.make} {truck.model}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(truck.id)}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
          title="Delete truck"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Type:</span>
          <span className="text-sm font-medium text-[#202224]">{formatTruckType(truck.truck_type)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">License Plate:</span>
          <span className="text-sm font-medium text-[#202224]">{truck.license_plate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Dimensions:</span>
          <span className="text-sm font-medium text-[#202224]">
            {truck.length_ft}' × {truck.width_ft}' × {truck.height_ft}'
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Max Capacity:</span>
          <span className="text-sm font-medium text-[#202224]">{truck.max_weight_lbs.toLocaleString()} lbs</span>
        </div>
        {features.length > 0 && (
          <div className="flex justify-between items-start pt-2">
            <span className="text-sm text-gray-500">Features:</span>
            <span className="text-sm font-medium text-[#202224] text-right max-w-[60%]">
              {features.join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function FleetManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useTrucks({ offset: 0, limit: 100 });
  const deleteTruck = useDeleteTruck();
  const showSuccess = (title: string, description?: string) => toast.success(title, { description });
  const showError = (title: string, description?: string) => toast.error(title, { description });

  const handleAddTruck = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const handleDeleteTruck = async (truckId: string) => {
    try {
      await deleteTruck.mutateAsync(truckId);
      showSuccess("Truck Deleted", "The truck has been successfully removed from your fleet.");
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete truck";
      showError("Delete Failed", errorMessage);
    }
  };

  const trucks = data?.trucks ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#202224]">Fleet Management</h2>
        <Button variant="primary" onClick={handleAddTruck} className="gap-2">
          <Plus size={20} />
          Add Truck
        </Button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading trucks...</div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">Failed to load trucks</div>
        ) : trucks.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No trucks yet</h3>
            <p className="text-gray-500">Add your first truck to start accepting jobs</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trucks.map((truck) => (
              <TruckCard
                key={truck.id}
                truck={truck}
                onDelete={handleDeleteTruck}
                isDeleting={deleteTruck.isPending}
              />
            ))}
          </div>
        )}
      </div>

      <AddTruckModal open={isModalOpen} onClose={handleModalClose} onSuccess={handleModalSuccess} />
    </div>
  );
}
