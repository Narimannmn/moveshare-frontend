import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Plus } from "lucide-react";
import { Button } from "@/shared/ui/Button/Button";

export const Route = createFileRoute("/(app)/profile/fleet/")({
  component: FleetManagementPage,
});

interface TruckData {
  id: number;
  name: string;
  type: string;
  size: string;
  capacity: string;
  features: string;
}

const mockTrucks: TruckData[] = [
  {
    id: 1,
    name: "Volvo Semi",
    type: "Semi-Trailer",
    size: "53 ft",
    capacity: "45,000 lbs",
    features: "Liftgate, Air Ride",
  },
  {
    id: 2,
    name: "Ford Box Truck",
    type: "Semi-Trailer",
    size: "53 ft",
    capacity: "45,000 lbs",
    features: "Liftgate, Air Ride",
  },
  {
    id: 3,
    name: "Freightliner",
    type: "Semi-Trailer",
    size: "53 ft",
    capacity: "45,000 lbs",
    features: "Liftgate, Air Ride",
  },
  {
    id: 4,
    name: "Volvo Semi",
    type: "Semi-Trailer",
    size: "53 ft",
    capacity: "45,000 lbs",
    features: "Liftgate, Air Ride",
  },
];

function TruckCard({ truck }: { truck: TruckData }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header with icon and name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <Truck className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-[#202224]">{truck.name}</h3>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Type:</span>
          <span className="text-sm font-medium text-[#202224]">
            {truck.type}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Size:</span>
          <span className="text-sm font-medium text-[#202224]">
            {truck.size}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Capacity:</span>
          <span className="text-sm font-medium text-[#202224]">
            {truck.capacity}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Features:</span>
          <span className="text-sm font-medium text-[#202224]">
            {truck.features}
          </span>
        </div>
      </div>
    </div>
  );
}

function FleetManagementPage() {
  const [trucks] = useState<TruckData[]>(mockTrucks);

  const handleAddTruck = () => {
    console.log("Add truck clicked");
    // TODO: Open modal or navigate to add truck form
  };

  return (
    <div>
      {/* Header with title and Add button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#202224]">Fleet Management</h2>
        <Button variant="primary" onClick={handleAddTruck} className="gap-2">
          <Plus size={20} />
          Add Truck
        </Button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        {/* Truck cards grid - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trucks.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
        </div>
      </div>
    </div>
  );
}
