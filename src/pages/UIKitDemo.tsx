import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Mail, MapPin, DollarSign, Briefcase, Send, Save } from "lucide-react";
import { Input } from "@/shared/ui/Input/Input";
import {
  Textarea,
  Button,
  RadioItem,
  RadioGroup,
  Checkbox,
  OTPInput,
} from "@/shared/ui";

// Form schema
const jobSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  salary: z.string().optional(),
  email: z.string().email("Invalid email address"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z
    .string()
    .min(20, "Requirements must be at least 20 characters"),
  employmentType: z.enum(["full-time", "part-time", "contract", "freelance"]),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"]),
  remote: z.boolean(),
  benefits: z.array(z.string()).optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
  verificationCode: z.string().length(6, "Code must be 6 digits").optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export const UIKitDemo = () => {
  const [step, setStep] = useState<"form" | "verification">("form");
  const [showSuccess, setShowSuccess] = useState(false);

  const { control, handleSubmit, watch } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitle: "",
      company: "",
      location: "",
      salary: "",
      email: "",
      description: "",
      requirements: "",
      employmentType: "full-time",
      experienceLevel: "mid",
      remote: false,
      benefits: [],
      acceptTerms: false,
      verificationCode: "",
    },
  });

  const onSubmit = (data: JobFormData) => {
    if (step === "form") {
      setStep("verification");
    } else {
      console.log("Form submitted:", data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F9FAFB",
        padding: "40px 20px",
      }}
    ></div>
  );
};
