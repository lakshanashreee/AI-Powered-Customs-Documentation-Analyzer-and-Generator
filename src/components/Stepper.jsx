import React from 'react';
import { Check } from 'lucide-react';

export function Stepper({ currentStep, onStepClick }) {
  const steps = [
    { number: 1, title: 'Upload & details' },
    { number: 2, title: 'AI validation' },
    { number: 3, title: 'Review & fix' },
    { number: 4, title: 'Report & submit' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 -z-0" />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isUpcoming = step.number > currentStep;

          let statusLabel = 'Upcoming';
          if (isCompleted) statusLabel = 'Completed';
          if (isCurrent) statusLabel = 'In progress';

          return (
            <div
              key={step.number}
              onClick={() => onStepClick && onStepClick(step.number)}
              className={`flex flex-col items-center relative z-10 select-none ${
                isCompleted || isCurrent ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCompleted
                    ? 'bg-[#351C15] text-white shadow-xs'
                    : isCurrent
                    ? 'bg-[#FFB500] text-[#351C15] ring-4 ring-amber-100 shadow-sm'
                    : 'bg-white border-2 border-gray-300 text-gray-500'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.number}
              </div>

              {/* Title & Subtitle */}
              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? 'text-[#351C15]'
                      : isCompleted
                      ? 'text-gray-800'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">
                  {statusLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
