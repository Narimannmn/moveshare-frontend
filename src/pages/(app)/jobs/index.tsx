import { createFileRoute } from "@tanstack/react-router";

import { JobCard, type JobCardProps } from "@/entities/Job";

import { JobsFilter } from "@/widgets/JobsFilter";

import { Button, PageHeader } from "@shared/ui";

export const Route = createFileRoute("/(app)/jobs/")({
  component: JobsPage,
});

// Mock data for demonstration
const mockJobs: JobCardProps[] = [
  {
    id: "1",
    title: "2 Bedroom Delivery",
    distance: 125,
    isHotDeal: true,
    isNewListing: true,
    origin: {
      city: "Chicago",
      state: "IL",
    },
    destination: {
      city: "Indianapolis",
      state: "IN",
    },
    dates: {
      start: "Aug 12-14",
      end: "2023",
    },
    truckSize: {
      type: "Medium",
      length: "40'",
    },
    weight: 4200,
    volume: 1200,
    badges: {
      verifiedMover: true,
      paymentProtected: true,
      escrow: true,
    },
    price: 1850,
  },
  {
    id: "2",
    title: "3 Bedroom Move",
    distance: 85,
    isHotDeal: false,
    isNewListing: false,
    origin: {
      city: "Detroit",
      state: "MI",
    },
    destination: {
      city: "Columbus",
      state: "OH",
    },
    dates: {
      start: "Aug 18-20",
      end: "2023",
    },
    truckSize: {
      type: "Large",
      length: "53'",
    },
    weight: 6500,
    volume: 1800,
    badges: {
      verifiedMover: true,
      paymentProtected: true,
    },
    price: 2450,
  },
];

function JobsPage() {
  const handleViewDetails = (id: string | number) => {
    console.log("View details for job:", id);
  };

  const handleClaimJob = (id: string | number) => {
    console.log("Claim job:", id);
  };

  return (
    <div>
      <PageHeader
        title="Available Jobs"
        actions={
          <>
            <Button variant="secondary" size="default">
              Refresh Jobs
            </Button>
            <Button variant="primary" size="default">
              Post New Job
            </Button>
          </>
        }
      />

      {/* Main Layout: Filter Sidebar + Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* Left Column: Filters */}
        <aside className="sticky self-start">
          <JobsFilter />
        </aside>

        {/* Right Column: Jobs Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {mockJobs.map((job) => (
            <JobCard
              key={job.id}
              {...job}
              onViewDetails={handleViewDetails}
              onClaimJob={handleClaimJob}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
