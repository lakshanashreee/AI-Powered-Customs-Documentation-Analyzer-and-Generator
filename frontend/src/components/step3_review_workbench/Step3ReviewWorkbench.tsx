import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Edit3,
  ChevronRight,
  ListFilter,
  FileText
} from 'lucide-react';
import { useShipment } from '../../context/ShipmentContext';
import { Badge } from '../common/Badge';
import { ManualEditModal } from '../common/ManualEditModal';

export const Step3ReviewWorkbench: React.FC = () => {
  const {
    shipmentDetails,
    issues,
    selectedIssue,
    selectedIssueId,
    setSelectedIssueId,
    filterSeverity,
    setFilterSeverity,
    readinessScore,
    criticalCount,
    warningsCount,
    checksPassedCount,
    acceptFix,
    editManually,
    ignoreIssue,
    setStep,
    setReviewSubView,
    triggerRevalidation,
    isValidating
  } = useShipment();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    if (filterSeverity === 'all') return true;
    return issue.severity === filterSeverity;
  });

  const handleAcceptFix = (issueId: string) => {
    acceptFix(issueId);
    setActionFeedback('✓ Fix applied! Field updated & readiness score increased.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleIgnore = (issueId: string) => {
    ignoreIssue(issueId);
    setActionFeedback('⚠️ Issue ignored. Note required before submission.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleDownloadCorrectionReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Field,Original,Corrected,Status', ...issues.map((i) => `"${i.displayName}","${i.enteredValue}","${i.invoiceValue}","${i.status}"`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Correction_Report_Shipment_${shipmentDetails.shipmentNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumbs & Top Actions */}
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

        {/* View Switcher back to Priority list */}
        <button
          onClick={() => setReviewSubView('summary')}
          className="text-xs font-semibold text-gray-600 hover:text-ups-brown underline text-left sm:text-right"
        >
          ← Back to Top Issues Priority View
        </button>
      </div>

      {/* Page Title & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Validation results · Shipment #{shipmentDetails.shipmentNumber}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>AI validation completed - Review the highlighted differences below.</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={triggerRevalidation}
            disabled={isValidating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs shadow-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${isValidating ? 'animate-spin' : ''}`} />
            <span>{isValidating ? 'Re-validating...' : 'Re-validate'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCorrectionReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Download correction report</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {actionFeedback && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-semibold text-amber-900 animate-in fade-in flex items-center justify-between">
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 4 KPI Metric Cards in a Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clearance readiness */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Clearance readiness</span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              {readinessScore >= 90 ? 'Ready' : 'Needs review'}
            </span>
          </div>

          <div className="my-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-gray-950">{readinessScore}</span>
            <span className="text-sm font-semibold text-gray-400">/ 100</span>
          </div>

          {/* Progress gauge bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                readinessScore >= 90 ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* Critical issues */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Critical issues</span>
            <span className="text-3xl font-extrabold text-red-600 mt-1 block">
              {criticalCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Warnings */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Warnings</span>
            <span className="text-3xl font-extrabold text-amber-500 mt-1 block">
              {warningsCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Checks passed */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Checks passed</span>
            <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">
              {checksPassedCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Split Workbench Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Issues Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-card overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">Issues found</h2>
              <span className="text-xs text-gray-500">({filteredIssues.length} shown)</span>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as any)}
                className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1 outline-none focus:border-ups-gold"
              >
                <option value="all">Filter: All</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="passed">Passed</option>
              </select>
            </div>
          </div>

          {/* Issues Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-4">Severity</th>
                  <th className="py-2.5 px-3">Field</th>
                  <th className="py-2.5 px-3">Invoice</th>
                  <th className="py-2.5 px-3">Entered</th>
                  <th className="py-2.5 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredIssues.map((issue) => {
                  const isSelected = selectedIssueId === issue.id;

                  return (
                    <tr
                      key={issue.id}
                      onClick={() => setSelectedIssueId(issue.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-100/60 font-medium'
                          : 'hover:bg-amber-50/40'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <Badge variant={issue.severity} />
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {issue.displayName}
                        {issue.status === 'corrected' && (
                          <span className="ml-1.5 text-[10px] text-emerald-600">✓ corrected</span>
                        )}
                        {issue.status === 'ignored' && (
                          <span className="ml-1.5 text-[10px] text-amber-700">· ignored</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-gray-700 font-mono">
                        {issue.invoiceValue}
                      </td>
                      <td className="py-3 px-3 text-gray-700 font-mono">
                        {issue.enteredValue}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-400">
                        <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isSelected ? 'text-ups-brown translate-x-0.5' : ''}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Explanation & Action Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200 shadow-card space-y-4">
          {selectedIssue ? (
            <>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-ups-gold-dark" />
                  <span>AI Explanation</span>
                </div>
                <Badge variant={selectedIssue.severity} />
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-lg font-extrabold text-gray-950">
                  {selectedIssue.displayName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  {selectedIssue.description}
                </p>
              </div>

              {/* Suggested Correction Box (yellow/gold background) */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-1">
                <span className="font-bold text-[10px] text-amber-800 uppercase tracking-wider block">
                  Suggested Correction
                </span>
                <p className="font-bold text-gray-950 text-sm">
                  {selectedIssue.suggestedCorrection}
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleAcceptFix(selectedIssue.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-extrabold text-xs shadow-sm transition-all active:scale-95"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Accept fix</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs shadow-sm transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                  <span>Edit manually</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleIgnore(selectedIssue.id)}
                  className="py-2.5 px-3 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Ignore
                </button>
              </div>

              {/* Footnote Source */}
              <div className="pt-2 text-[11px] text-gray-400 font-mono">
                Source: {selectedIssue.sourceReference}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-gray-400 text-xs">
              Select an issue from the list to view the AI explanation and resolution guidance.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Invoice Preview (Interactive Document) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card space-y-4">
        {/* Header & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-ups-gold-dark" />
              <h2 className="text-base font-bold text-gray-900">Invoice preview</h2>
              <span className="text-xs text-gray-500 font-mono">invoice_0412.pdf · Page 1</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Highlighted fields correspond to the issues above. Click any highlight to jump to that issue.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-amber-50/60 px-3 py-1.5 rounded-lg border border-amber-200/60 self-start sm:self-auto">
            <span className="w-3.5 h-3.5 border-2 border-ups-gold bg-amber-100/50 rounded-sm inline-block" />
            <span>{selectedIssue ? `${selectedIssue.displayName} selected` : 'Declared value selected'}</span>
          </div>
        </div>

        {/* Mock Commercial Invoice Visualizer */}
        <div className="border-2 border-gray-200 rounded-2xl p-6 bg-[#FCFBF8] font-sans text-xs text-gray-800 space-y-4 shadow-inner relative">
          {/* Document Header */}
          <div className="flex justify-between items-start border-b border-gray-300 pb-3">
            <div>
              <span className="text-sm font-extrabold tracking-wider uppercase text-gray-900">
                COMMERCIAL INVOICE
              </span>
              <p className="text-[11px] text-gray-500">Original Document Copy · Customs Entry</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-gray-600">Invoice no. [INV-0412]</span>
              <p className="text-[11px] text-gray-400">Date: 2026-04-12</p>
            </div>
          </div>

          {/* Seller / Buyer / Line Items Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 border-b border-gray-200 pb-3">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Seller:</span>
              <span className="font-semibold text-gray-800">[ABC Exports Ltd.]</span>
              <p className="text-[10px] text-gray-500">12 Industrial Estate, New Delhi, India</p>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Buyer / Consignee:</span>
              <span className="font-semibold text-gray-800">[Global Traders Inc.]</span>
              <p className="text-[10px] text-gray-500">450 Logistics Blvd, Dallas, TX, USA</p>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Line Items:</span>
              <span className="font-semibold text-gray-800">[1 item · Women Leather Bags]</span>
              <p className="text-[10px] text-gray-500">Origin: India (IN) · Incoterms: CIF</p>
            </div>
          </div>

          {/* Interactive Bounding Boxes Layout (representing invoice fields) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {/* Quantity box */}
            <div
              onClick={() => setSelectedIssueId('issue-4')}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                selectedIssueId === 'issue-4'
                  ? 'border-ups-gold bg-amber-100/60 ring-2 ring-ups-gold shadow-sm'
                  : 'border-amber-300 bg-amber-50/50 hover:bg-amber-100/40'
              }`}
            >
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Quantity</span>
              <span className="text-base font-extrabold text-gray-900">240</span>
              <span className="text-[10px] text-amber-800 block mt-0.5">Discrepancy (204 ent.)</span>
            </div>

            {/* Gross weight box */}
            <div
              onClick={() => setSelectedIssueId('issue-3')}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                selectedIssueId === 'issue-3'
                  ? 'border-ups-gold bg-amber-100/60 ring-2 ring-ups-gold shadow-sm'
                  : 'border-amber-300 bg-amber-50/50 hover:bg-amber-100/40'
              }`}
            >
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Gross weight</span>
              <span className="text-base font-extrabold text-gray-900">118 kg</span>
              <span className="text-[10px] text-amber-800 block mt-0.5">Mismatch (96 kg ent.)</span>
            </div>

            {/* HS code box */}
            <div
              onClick={() => setSelectedIssueId('issue-2')}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                selectedIssueId === 'issue-2'
                  ? 'border-red-500 bg-red-100/60 ring-2 ring-red-400 shadow-sm'
                  : 'border-dashed border-red-400 bg-red-50/40 hover:bg-red-100/30'
              }`}
            >
              <span className="text-[10px] font-bold text-red-600 uppercase block">HS code</span>
              <span className="text-base font-extrabold text-red-600">Missing</span>
              <span className="text-[10px] text-red-700 block mt-0.5">Critical required</span>
            </div>

            {/* Invoice total - USD box */}
            <div
              onClick={() => setSelectedIssueId('issue-1')}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                selectedIssueId === 'issue-1'
                  ? 'border-ups-gold bg-amber-100/80 ring-2 ring-ups-gold shadow-md'
                  : 'border-amber-400 bg-amber-50/70 hover:bg-amber-100/50'
              }`}
            >
              <span className="text-[10px] font-bold text-gray-700 uppercase block">Invoice total · USD</span>
              <span className="text-base font-extrabold text-gray-950">$4,800</span>
              <span className="text-[10px] text-amber-900 font-semibold block mt-0.5">Entered: $3,900</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar Navigation */}
      <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to shipment details</span>
        </button>

        <button
          type="button"
          onClick={() => setStep(4)}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-extrabold text-sm shadow-md transition-all active:scale-95"
        >
          <span>Review correction report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Legal Disclaimer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 border-t border-gray-100 gap-2">
        <span>AI guidance supports review and does not confirm regulatory compliance.</span>
        <span>UPS CrossBorder Ready</span>
      </div>

      {/* Manual Edit Modal */}
      <ManualEditModal
        isOpen={isEditModalOpen}
        issue={selectedIssue}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(issueId, newVal) => editManually(issueId, newVal)}
      />
    </div>
  );
};
