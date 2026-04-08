import React, { memo } from "react";

import { AlertTriangle, Check } from "lucide-react";

export interface ProgressStepperProps {
  steps: string[];
  completedSteps: number;
  isDisputed?: boolean;
}

export const ProgressStepper = memo(({ steps, completedSteps, isDisputed = false }: ProgressStepperProps) => (
  <div className="w-full">
    <div className="flex items-center">
      {steps.map((_, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum <= completedSteps;
        const isDisputedStep = isDisputed && stepNum > completedSteps;
        return (
          <React.Fragment key={stepNum}>
            {index > 0 && (
              <div className={`h-px flex-1 ${isCompleted ? "bg-[#60A5FA]" : "bg-[#D8D8D8]"}`} />
            )}
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                isCompleted ? "bg-[#60A5FA]" : isDisputedStep ? "bg-[#EF4444]" : "bg-[#D8D8D8]"
              }`}
            >
              {isCompleted ? (
                <Check className="size-4" strokeWidth={3} />
              ) : isDisputedStep ? (
                <AlertTriangle className="size-4" />
              ) : (
                stepNum
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
    <div className="mt-2" style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum <= completedSteps;
        const isDisputedStep = isDisputed && stepNum > completedSteps;
        return (
          <span
            key={label}
            className={`text-center text-sm ${
              isCompleted ? "text-[#263238] font-medium" : isDisputedStep ? "text-[#EF4444]" : "text-[#90A4AE]"
            }`}
          >
            {label}
          </span>
        );
      })}
    </div>
  </div>
));

ProgressStepper.displayName = "ProgressStepper";
