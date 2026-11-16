import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  ArrowRight,
  SplitSquareVertical,
  Wrench
} from 'lucide-react';
import { useShipment } from '../../context/ShipmentContext';
import { Badge } from '../common/Badge';
import { ManualEditModal } from '../common/ManualEditModal';
import { ValidationIssue } from '../../types';

export const Step2ValidationSummary: React.FC = () => {
  const {
    shipmentDetails,
    issues,
    criticalCount,
    warningsCount,
    setStep,
    setReviewSubView,
    setSelectedIssueId,
    editManually,
    triggerRevalidation,
    isValidating
  } = useShipment();

  const [editingIssue, setEditingIssue] = useState<ValidationIssue | null>(null);

  // Top 3 issues (sorted highest priority first: criticals first, then warnings)
  const top3Issues = issues.slice(0, 3);

  const handleFixClick = (issue: ValidationIssue) => {
    setSelectedIssueId(issue.id);
    // User can either edit directly or jump into the interactive split workbench
    setEditingIssue(issue);
  };

  const handleOpenWorkbench = (issueId?: string) => {
    if (issueId) setSelectedIssueId(issueId);
    setReviewSubView('workbench');
  };

  const handleDownloadReport = () => {
    // Generate simple text report summary
    const content = `UPS CrossBorder Ready - Validation Results
Shipment #${shipmentDetails.shipmentNumber}
Date: ${new Date().toLocaleDateString()}

Critical Issues: ${criticalCount}
Warnings: ${warningsCount}

Issues:
${issues.map((i) => `- [${i.severity.toUpperCase()}] ${i.displayName}: ${i.description}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Validation_Results_Shipment_${shipmentDetails.shipmentNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center space-x-1.5">
          <span
            onClick={() => setStep(1)}
            className="hover:text-gray-900 cursor-pointer font-medium"
          >
            Shipments
          </span>
          <span>/</span>
          <span className="font-semibold text-gray-800">
            #{shipmentDetails.shipmentNumber}
          </span>
          <span>/</span>
          <span className="text-gray-500">Review & fix</span>
        </div>

        {/* View Switcher Button */}
        <button
          onClick={() => handleOpenWorkbench()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200 transition-colors w-fit"
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
          <span>Switch to Interactive Document Split-View</span>
        </button>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
          Validation results · Shipment #{shipmentDetails.shipmentNumber}
        </h1>
      </div>

      {/* Top Banner Card: Validation failed */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-card flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Validation failed</h2>
          <p className="text-sm text-gray-600 mt-1">
            AI validation completed. Resolve the {criticalCount} critical issues before submitting this shipment.
          </p>
        </div>
        <div>
          <Badge variant="fail" label="Fail" />
        </div>
      </div>

      {/* 2 Summary KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Errors - Critical issues */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
              Errors - Critical issues
            </span>
            <span className="text-4xl font-extrabold text-red-600 mt-1 block">
              {criticalCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
        </div>

        {/* Warnings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
              Warnings
            </span>
            <span className="text-4xl font-extrabold text-amber-500 mt-1 block">
              {warningsCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Top 3 issues Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Top 3 issues</h2>
          <span className="text-xs font-medium text-gray-500">Highest priority first</span>
        </div>

        <div className="space-y-4">
          {top3Issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  {/* Issue Title & Severity Badge */}
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-gray-900">{issue.displayName}</h3>
                    <Badge variant={issue.severity} />
                    {issue.status !== 'open' && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ {issue.status}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 leading-relaxed">{issue.description}</p>

                  {/* WHY IT MATTERS */}
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase block">
                      Why it matters
                    </span>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      {issue.whyItMatters}
                    </p>
                  </div>

                  {/* CORRECTION GUIDANCE box */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs">
                    <span className="font-bold text-[10px] text-amber-800 uppercase tracking-wider block mb-0.5">
                      Correction Guidance
                    </span>
                    <p className="font-semibold text-gray-900 leading-relaxed">
                      {issue.correctionGuidance}
                    </p>
                  </div>
                </div>

                {/* Fix Button on Right */}
                <div className="flex flex-row md:flex-col gap-2 self-start md:self-center">
                  <button
                    onClick={() => handleFixClick(issue)}
                    className="inline-flex items-center justify-center gap-1.5 px-6 py-2 rounded-xl bg-white border border-gray-300 hover:border-ups-gold hover:bg-amber-50/50 text-gray-800 font-bold text-sm shadow-sm transition-all"
                  >
                    <Wrench className="w-3.5 h-3.5 text-ups-gold-dark" />
                    <span>Fix</span>
                  </button>

                  <button
                    onClick={() => handleOpenWorkbench(issue.id)}
                    className="text-xs text-gray-500 hover:text-ups-brown underline text-center"
                  >
                    View in workbench
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="pt-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Action Buttons */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleDownloadReport}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Download report</span>
          </button>

          <button
            type="button"
            onClick={triggerRevalidation}
            disabled={isValidating}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs shadow-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${isValidating ? 'animate-spin' : ''}`} />
            <span>{isValidating ? 'Rechecking...' : 'Recheck corrections'}</span>
          </button>
        </div>

        {/* Center / Blocking Message */}
        <div className="flex items-center gap-2 text-xs text-gray-600 text-center md:text-left">
          <Badge variant="blocking" />
          <span>
            Continue will open the next review step. Critical issues remain unresolved and must be reviewed before submission.
          </span>
        </div>

        {/* Right CTA Continue Button */}
        <button
          type="button"
          onClick={() => {
            // Advances to the interactive workbench / deep dive review step
            setReviewSubView('workbench');
          }}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-extrabold text-sm shadow-md transition-all active:scale-95"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Manual Edit Modal */}
      <ManualEditModal
        isOpen={!!editingIssue}
        issue={editingIssue || undefined}
        onClose={() => setEditingIssue(null)}
        onSave={(issueId, newVal) => editManually(issueId, newVal)}
      />
    </div>
  );
};

