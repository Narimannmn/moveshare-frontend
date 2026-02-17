import type { JobDetailsData } from "./JobDetailsModal";

export const MOCK_JOB_DETAILS: JobDetailsData = {
  id: "ms-4821",
  title: "4 Bedroom Residential move",
  route: "Chicago, IL \u2192 Indianapolis, IN",
  company: {
    initials: "TL",
    name: "TransAtlantic Logistics",
    reviews: 42,
    avgResponseTime: "45 minutes",
    completedJobs: 126,
    badges: [
      { label: "Verified Mover", type: "blue" },
      { label: "Payment Protected", type: "green" },
      { label: "Escrow", type: "yellow" },
      { label: "Payment Protected", type: "green" },
    ],
  },
  locations: {
    pickupAddress: "838 Broadway, New York, NY 10003",
    pickupAccess: "Stairs (Floor 3)",
    pickupWalkDistance: "100-200 ft",
    deliveryAddress: "838 Broadway, New York, NY 10003",
    deliveryAccess: "Stairs (Floor 3)",
    deliveryWalkDistance: "100-200 ft",
  },
  jobDetails: {
    jobId: "#MS-4821",
    posted: "2 hours ago",
    distance: "183 miles (295 km)",
    estimatedTime: "3 hours 15 minutes",
    truckSize: "Medium (22')",
    cargoType: "Household Goods",
    weight: "4,200 lbs (1,905 kg)",
    volume: "1,200 cu ft (34 m\u00B3)",
  },
  schedule: {
    pickupDate: "August 12, 2023",
    deliveryDate: "August 14, 2023",
    pickupTime: "7:00 AM - 12:00 PM",
    deliveryTime: "1:00 PM - 5:00 PM",
  },
  description:
    "Brief description of the additional services indicated above...",
  additionalServices: [
    "Packing Boxes",
    "Bulky Items",
    "Inventory List",
    "Hoisting",
  ],
  payment: {
    payout: 1500,
    cut: 300,
    platformFee: 30,
  },
};
