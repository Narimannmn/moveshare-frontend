import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { FileText, MessageCircle, Star, X } from "lucide-react";

import { Button } from "@/shared/ui/Button/Button";

export const Route = createFileRoute("/(app)/claimed/")({
  component: ClaimedJobsPage,
});

type JobStatus = "active" | "in-transit" | "completed" | "disputed";

interface ClaimedJob {
  id: string;
  title: string;
  jobId: string;
  price: string;
  status: JobStatus;
  progress: {
    steps: Array<{
      label: string;
      completed: boolean;
      active: boolean;
    }>;
  };
  routeDetails: {
    origin: string;
    destination: string;
    distance: string;
    duration: string;
  };
  schedule: {
    origin: string;
    destination: string;
    distance: string;
    duration: string;
  };
  companyDetails?: {
    company: string;
    contact: string;
    phone: string;
    email: string;
  };
  documents: Array<{
    id: string;
    name: string;
  }>;
  dispute?: {
    description: string;
  };
  showReview?: boolean;
  reviewCompany?: string;
}

const mockJobs: ClaimedJob[] = [
  {
    id: "1",
    title: "Furniture Delivery",
    jobId: "#MS-4821",
    price: "$1,850",
    status: "active",
    progress: {
      steps: [
        { label: "Claimed", completed: true, active: false },
        { label: "Documents Shared", completed: true, active: false },
        { label: "Claimed", completed: false, active: true },
        { label: "Completed", completed: false, active: false },
      ],
    },
    routeDetails: {
      origin: "Chicago, IL",
      destination: "Indianapolis, IN",
      distance: "183 miles",
      duration: "3 hours",
    },
    schedule: {
      origin: "Chicago, IL",
      destination: "Indianapolis, IN",
      distance: "183 miles",
      duration: "3 hours",
    },
    companyDetails: {
      company: "TransAtlantic Logistics",
      contact: "John Smith",
      phone: "(312) 555-0198",
      email: "john@transatlantic.com",
    },
    documents: [
      { id: "1", name: "Bill of Lading.pdf" },
      { id: "2", name: "Bill of Lading.pdf" },
      { id: "3", name: "Bill of Lading.pdf" },
    ],
  },
  {
    id: "2",
    title: "Furniture Delivery",
    jobId: "#MS-4821",
    price: "$1,850",
    status: "completed",
    progress: {
      steps: [
        { label: "Claimed", completed: true, active: false },
        { label: "Documents Shared", completed: true, active: false },
        { label: "Claimed", completed: true, active: false },
        { label: "Completed", completed: true, active: false },
      ],
    },
    routeDetails: {
      origin: "Chicago, IL",
      destination: "Indianapolis, IN",
      distance: "183 miles",
      duration: "3 hours",
    },
    schedule: {
      origin: "Chicago, IL",
      destination: "Indianapolis, IN",
      distance: "183 miles",
      duration: "3 hours",
    },
    companyDetails: {
      company: "TransAtlantic Logistics",
      contact: "John Smith",
      phone: "(312) 555-0198",
      email: "john@transatlantic.com",
    },
    documents: [],
    showReview: true,
    reviewCompany: "Coastal Warehousing",
  },
  {
    id: "3",
    title: "Furniture Delivery",
    jobId: "#MS-4821",
    price: "$1,850",
    status: "disputed",
    progress: {
      steps: [
        { label: "Claimed", completed: true, active: false },
        { label: "Documents Shared", completed: true, active: false },
        { label: "Claimed", completed: false, active: false },
        { label: "Completed", completed: false, active: false },
      ],
    },
    routeDetails: {
      origin: "Chicago, IL",
      destination: "Indianapolis, IN",
      distance: "183 miles",
      duration: "3 hours",
    },
    schedule: {
      origin: "Chicago, IL",
      destination: "Indianapolis, IN",
      distance: "183 miles",
      duration: "3 hours",
    },
    companyDetails: {
      company: "TransAtlantic Logistics",
      contact: "John Smith",
      phone: "(312) 555-0198",
      email: "john@transatlantic.com",
    },
    documents: [],
    dispute: {
      description:
        "The client claims that 3 pieces of equipment arrived damaged. Our driver reported the equipment was loaded securely and arrived without incident.",
    },
  },
];

const statusTabs: Array<{ id: JobStatus | "all"; label: string; count: number }> = [
  { id: "all", label: "Active", count: 3 },
  { id: "in-transit", label: "In Transit", count: 3 },
  { id: "completed", label: "Completed", count: 3 },
  { id: "disputed", label: "Disputed", count: 3 },
];

function ProgressTracker({ steps }: { steps: ClaimedJob["progress"]["steps"] }) {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            {/* Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step.completed
                  ? "bg-blue-500 text-white"
                  : step.active
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-500"
              }`}
            >
              {step.completed ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : step.active ? (
                <span>{index + 1}</span>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {/* Label */}
            <span className="text-xs text-gray-600 mt-2 text-center whitespace-nowrap">
              {step.label}
            </span>
          </div>
          {/* Line */}
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-2 ${step.completed ? "bg-blue-500" : "bg-gray-300"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function JobCard({ job }: { job: ClaimedJob }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleOpenChat = () => {
    console.log("Open chat for job", job.id);
  };

  const handleMarkAsDelivered = () => {
    console.log("Mark as delivered", job.id);
  };

  const handleRemoveDocument = (docId: string) => {
    console.log("Remove document", docId);
  };

  const handleUploadDocument = () => {
    console.log("Upload document for job", job.id);
  };

  const handleSkipReview = () => {
    console.log("Skip review");
  };

  const handleSubmitReview = () => {
    console.log("Submit review", { rating, review });
  };

  const handleViewEvidence = () => {
    console.log("View evidence for dispute");
  };

  const handleEscalate = () => {
    console.log("Escalate to admin");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#202224] mb-1">{job.title}</h3>
          <span className="text-sm text-gray-500">Job {job.jobId}</span>
        </div>
        <span className="text-2xl font-bold text-[#202224]">{job.price}</span>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker steps={job.progress.steps} />

      {/* Route Details & Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Route Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#202224] mb-3">Route Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Origin:</span>
              <span className="text-[#202224] font-medium">{job.routeDetails.origin}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Destination:</span>
              <span className="text-[#202224] font-medium">{job.routeDetails.destination}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Distance:</span>
              <span className="text-[#202224] font-medium">{job.routeDetails.distance}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Est. Duration:</span>
              <span className="text-[#202224] font-medium">{job.routeDetails.duration}</span>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#202224] mb-3">Schedule</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Origin:</span>
              <span className="text-[#202224] font-medium">{job.schedule.origin}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Destination:</span>
              <span className="text-[#202224] font-medium">{job.schedule.destination}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Distance:</span>
              <span className="text-[#202224] font-medium">{job.schedule.distance}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Est. Duration:</span>
              <span className="text-[#202224] font-medium">{job.schedule.duration}</span>
            </div>
          </div>
        </div>

        {/* Route Details (Company) */}
        {job.companyDetails && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-[#202224] mb-3">Route Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Company:</span>
                <span className="text-[#202224] font-medium">{job.companyDetails.company}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Contact:</span>
                <span className="text-[#202224] font-medium">{job.companyDetails.contact}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone:</span>
                <span className="text-[#202224] font-medium">{job.companyDetails.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="text-[#202224] font-medium">{job.companyDetails.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Documents Section */}
      {job.status === "active" && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[#202224] mb-3">Documents</h4>
          <div className="flex items-center gap-4">
            {job.documents.map((doc) => (
              <div
                key={doc.id}
                className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 w-32 hover:bg-gray-100 transition-colors"
              >
                <button
                  onClick={() => handleRemoveDocument(doc.id)}
                  className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
                <div className="flex flex-col items-center">
                  <FileText className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-center text-gray-600 line-clamp-2">{doc.name}</span>
                </div>
              </div>
            ))}
            <button
              onClick={handleUploadDocument}
              className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 w-32 h-full flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm text-gray-500 text-center">Upload Document</span>
              <span className="text-xs text-gray-400 mt-1">Click to upload or drag & drop</span>
            </button>
          </div>
        </div>
      )}

      {/* Review Section */}
      {job.showReview && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-base font-semibold text-[#202224] mb-2">Leave a Review</h4>
          <p className="text-sm text-gray-500 mb-4">
            How was your experience with {job.reviewCompany}?
          </p>
          {/* Star Rating */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                <Star
                  className={`w-8 h-8 ${
                    star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {/* Review Textarea */}
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this company..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
          />
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={handleSkipReview}>
              Skip
            </Button>
            <Button variant="primary" onClick={handleSubmitReview}>
              Submit Review
            </Button>
          </div>
        </div>
      )}

      {/* Dispute Section */}
      {job.dispute && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="text-base font-semibold text-[#202224] mb-2">Dispute Details</h4>
          <p className="text-sm text-gray-700">{job.dispute.description}</p>
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" onClick={handleViewEvidence}>
              View Evidence
            </Button>
            <Button
              variant="primary"
              onClick={handleEscalate}
              className="bg-red-500 hover:bg-red-600"
            >
              Escalate to Admin
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {job.status === "active" && (
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleOpenChat} className="gap-2">
            <MessageCircle size={18} />
            Open Chat
          </Button>
          <Button variant="primary" onClick={handleMarkAsDelivered}>
            Mark as Delivered
          </Button>
        </div>
      )}
    </div>
  );
}

function ClaimedJobsPage() {
  const [activeTab, setActiveTab] = useState<JobStatus | "all">("all");

  return (
    <div>
      {/* Header with Tabs */}
      <div className="mb-6">
        <div className="flex gap-6 border-b border-gray-200">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}{" "}
              <span className={`ml-1 ${activeTab === tab.id ? "text-blue-500" : "text-gray-400"}`}>
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div>
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
