import React from 'react';
import { Check } from 'lucide-react';
import { useShipment } from '../../context/ShipmentContext';

interface StepItem {
  id: number;
  label: string;
  statusLabel?: (current: number) => string;
}

export const Stepper: React.FC = () => {
  const { currentStep, setStep } = useShipment();

  const steps: StepItem[] = [
    {
      id: 1,
      label: 'Upload & details',
      statusLabel: (curr) => (curr > 1 ? 'Completed' : 'Active')
    },
    {
      id: 2,
      label: 'AI validation',
      statusLabel: (curr) => (curr > 2 ? 'Completed' : curr === 2 ? 'In progress' : 'Upcoming')
    },
    {
      id: 3,
      label: 'Review & fix',
      statusLabel: (curr) => (curr > 3 ? 'Completed' : curr === 3 ? 'In progress' : 'Upcoming')
    },
    {
      id: 4,
      label: 'Report & submit',
      statusLabel: (curr) => (curr === 4 ? 'In progress' : 'Upcoming')
    }
  ];

  return (
    <div className="w-full bg-white border-b border-ups-border-light shadow-sm py-4 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between relative">
            {steps.map((step, idx) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <li key={step.id} className="relative flex-1 flex flex-col items-center group">
                  {/* Connecting Line between steps */}
                  {idx !== 0 && (
                    <div
                      className={`absolute top-4 -left-1/2 w-full h-[2px] -translate-y-1/2 transition-colors duration-300 ${
                        currentStep >= step.id ? 'bg-gray-800' : 'bg-gray-200'
                      }`}
                      style={{ zIndex: 0 }}
                    />
                  )}

                  {/* Step Bubble / Button */}
                  <button
                    onClick={() => {
                      // Allow jumping to visited steps or step 1
                      if (step.id <= Math.max(currentStep, 3)) {
                        setStep(step.id);
                      }
                    }}
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      isCompleted
                        ? 'bg-gray-900 text-white shadow-sm ring-2 ring-gray-900 ring-offset-2'
                        : isCurrent
                        ? 'bg-ups-gold text-gray-950 ring-2 ring-ups-gold ring-offset-2 font-extrabold shadow'
                        : 'bg-white border-2 border-gray-300 text-gray-400 group-hover:border-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </button>

                  {/* Step Label & Subtext */}
                  <div className="text-center mt-2">
                    <span
                      className={`block text-xs md:text-sm font-semibold transition-colors ${
                        isCurrent
                          ? 'text-gray-900'
                          : isCompleted
                          ? 'text-gray-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[11px] text-gray-400 hidden sm:block">
                      {step.statusLabel ? step.statusLabel(currentStep) : ''}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
