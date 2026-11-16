import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Cpu, FileSpreadsheet, ShieldAlert, ArrowRight } from 'lucide-react';

export function ValidationProcessing({ onComplete }) {
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    {
      id: 1,
      title: "PaddleOCR-VL 1.6 Extraction",
      description: "Extracting bounding boxes, tabular invoice data, and line items...",
      icon: FileSpreadsheet,
    },
    {
      id: 2,
      title: "Qwen2.5-VL-3B-Instruct Understanding",
      description: "Interpreting semantic fields, seller/buyer entities, and currency units...",
      icon: Cpu,
    },
    {
      id: 3,
      title: "C# ASP.NET Core Validation Engine",
      description: "Running mathematical checks ($Qty × Rate == Total), HS code verification, and packing list comparison...",
      icon: ShieldAlert,
    },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStage(1), 1200);
    const t2 = setTimeout(() => setCurrentStage(2), 2400);
    const t3 = setTimeout(() => {
      setCurrentStage(3);
      if (onComplete) {
        setTimeout(onComplete, 900);
      }
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-sm">
        {/* Animated Radar / Brain */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-60" />
          <div className="relative w-16 h-16 rounded-full bg-[#351C15] flex items-center justify-center shadow-md">
            <Loader2 className="w-8 h-8 text-[#FFB500] animate-spin stroke-[2.5]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#1E293B]">
          Analyzing Customs Documentation
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Our local vision-language AI models and C# business rules are validating your documents for customs compliance.
        </p>

        {/* Progression Steps */}
        <div className="mt-8 space-y-3 text-left">
          {stages.map((stage, idx) => {
            const isDone = currentStage > idx;
            const isCurrent = currentStage === idx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-amber-300 bg-amber-50/50 shadow-xs'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-gray-200 bg-gray-50/50 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#351C15] text-[#FFB500]'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">{stage.title}</p>
                    {isDone && (
                      <span className="text-xs font-semibold text-emerald-600">Complete</span>
                    )}
                    {isCurrent && (
                      <span className="text-xs font-semibold text-amber-600 animate-pulse">Running...</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{stage.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skip button in case user wants immediate results */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-center">
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#351C15] transition-colors"
          >
            <span>Skip animation and view results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
