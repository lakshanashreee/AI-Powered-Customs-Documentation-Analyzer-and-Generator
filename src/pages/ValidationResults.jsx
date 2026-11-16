import React, { useState } from 'react';
import { 
  RotateCw, 
  Download, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  ChevronRight,
  Check,
  Edit2,
  Eye,
  LayoutGrid,
  Columns
} from 'lucide-react';
import { sampleValidationIssues } from '../data/mockData';

export function ValidationResults({ onProceedToReport, onBackToDetails }) {
  const [issues, setIssues] = useState(sampleValidationIssues);
  const [selectedIssueId, setSelectedIssueId] = useState('iss-1');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' (Image 3) or 'simplified' (Image 2)
  const [editingIssue, setEditingIssue] = useState(null);
  const [manualInput, setManualInput] = useState('');

  const selectedIssue = issues.find((i) => i.id === selectedIssueId) || issues[0];

  const handleAcceptFix = (id) => {
    setIssues((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'resolved', enteredValue: item.invoiceValue } : item
      )
    );
  };

  const handleIgnore = (id) => {
    setIssues((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'ignored' } : item
      )
    );
  };

  const handleSaveManualEdit = (id) => {
    if (!manualInput.trim()) return;
    setIssues((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'resolved', enteredValue: manualInput } : item
      )
    );
    setEditingIssue(null);
    setManualInput('');
  };

  const filteredIssues = issues.filter((issue) => {
    if (filterSeverity === 'All') return true;
    return issue.severity === filterSeverity;
  });

  const criticalCount = issues.filter((i) => i.severity === 'Critical' && i.status === 'open').length;
  const warningCount = issues.filter((i) => i.severity === 'Warning' && i.status === 'open').length;
  const passedCount = 14 + issues.filter((i) => i.status === 'resolved').length;

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 pt-2 px-4 sm:px-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs text-gray-500 font-medium mb-1">
            Shipments / #0412 / <span className="text-gray-900 font-semibold">Review & fix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
            Validation results · Shipment #0412
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            AI validation completed · Review the highlighted differences below.
          </p>
        </div>

        {/* View Switcher and Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Toggle between Detailed Split View and Simplified View */}
          <div className="bg-gray-100 p-0.5 rounded-lg flex items-center border border-gray-200 text-xs font-semibold mr-1">
            <button
              onClick={() => setViewMode('detailed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'detailed'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Detailed View</span>
            </button>
            <button
              onClick={() => setViewMode('simplified')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'simplified'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Simplified View</span>
            </button>
          </div>

          <button
            onClick={() => alert("Re-running local AI inference...")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-xs"
          >
            <RotateCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Re-validate</span>
          </button>
          <button
            onClick={() => alert("Downloading preliminary validation report...")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Download report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Readiness */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Clearance readiness</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              Needs review
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-[#1E293B]">62</span>
            <span className="text-xs text-gray-400 font-medium">/ 100</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="w-[62%] h-full bg-[#FFB500] rounded-full" />
          </div>
        </div>

        {/* Critical Issues */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Critical issues</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-red-600">
            {criticalCount}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Blocks customs submission</p>
        </div>

        {/* Warnings */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-amber-600">
            {warningCount}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Requires verification</p>
        </div>

        {/* Checks Passed */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Checks passed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600">
            {passedCount}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Compliant fields</p>
        </div>
      </div>

      {/* VIEW MODE 1: DETAILED SPLIT VIEW (Image 3) */}
      {viewMode === 'detailed' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Issues Found Table (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1E293B]">Issues found</h3>
                  <span className="text-xs text-gray-400">({filteredIssues.length} shown)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span>Filter:</span>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="border border-gray-200 rounded-md px-2 py-1 text-xs font-semibold bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#FFB500]"
                  >
                    <option value="All">All</option>
                    <option value="Critical">Critical</option>
                    <option value="Warning">Warning</option>
                    <option value="Passed">Passed</option>
                  </select>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                <div className="grid grid-cols-12 bg-gray-50/90 px-3.5 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <div className="col-span-3">SEVERITY</div>
                  <div className="col-span-3">FIELD</div>
                  <div className="col-span-3">INVOICE</div>
                  <div className="col-span-2">ENTERED</div>
                  <div className="col-span-1 text-right"></div>
                </div>

                {filteredIssues.map((issue) => {
                  const isSelected = selectedIssue.id === issue.id;
                  const isResolved = issue.status === 'resolved';

                  return (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssueId(issue.id)}
                      className={`grid grid-cols-12 px-3.5 py-3.5 items-center text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-50/90 border-l-4 border-l-[#FFB500]'
                          : 'hover:bg-gray-50/70'
                      }`}
                    >
                      <div className="col-span-3 flex items-center">
                        {issue.severity === 'Critical' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            ● Critical
                          </span>
                        )}
                        {issue.severity === 'Warning' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            ● Warning
                          </span>
                        )}
                        {issue.severity === 'Passed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ● Passed
                          </span>
                        )}
                      </div>

                      <div className="col-span-3 font-semibold text-gray-900 truncate pr-2">
                        {issue.field}
                        {isResolved && (
                          <span className="ml-1 text-[10px] text-emerald-600 font-normal">
                            (Resolved)
                          </span>
                        )}
                      </div>

                      <div className="col-span-3 text-gray-600 font-mono text-[11px] truncate pr-2">
                        {issue.invoiceValue}
                      </div>

                      <div className="col-span-2 font-mono text-[11px] truncate text-gray-900">
                        {issue.enteredValue}
                      </div>

                      <div className="col-span-1 text-right text-gray-400">
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: AI Explanation Card (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    AI EXPLANATION
                  </span>
                </div>
                {selectedIssue.severity === 'Critical' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                    ● Critical
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    ● Warning
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">
                  {selectedIssue.field}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  {selectedIssue.explanation}
                </p>
              </div>

              {/* Suggested Correction Box */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1">
                  SUGGESTED CORRECTION
                </span>
                <p className="text-xs font-bold text-[#351C15]">
                  {selectedIssue.suggestedCorrection}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                {editingIssue === selectedIssue.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="Enter verified correct value..."
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveManualEdit(selectedIssue.id)}
                        className="flex-1 py-2 bg-[#FFB500] text-[#351C15] font-bold text-xs rounded-lg"
                      >
                        Save Value
                      </button>
                      <button
                        onClick={() => setEditingIssue(null)}
                        className="px-3 py-2 border border-gray-200 text-xs font-semibold rounded-lg text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcceptFix(selectedIssue.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#FFB500] hover:bg-[#EAA600] active:scale-95 text-[#351C15] font-bold text-xs rounded-xl shadow-xs transition-all"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Accept fix</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingIssue(selectedIssue.id);
                        setManualInput(selectedIssue.enteredValue);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                      <span>Edit manually</span>
                    </button>
                    <button
                      onClick={() => handleIgnore(selectedIssue.id)}
                      className="py-2.5 px-3 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      Ignore
                    </button>
                  </div>
                )}
              </div>

              {/* Source attribution */}
              <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                Source: {selectedIssue.source}
              </div>
            </div>
          </div>

          {/* Bottom Section: Invoice Preview with Highlighted Bounding Boxes */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Info */}
              <div className="lg:col-span-3 space-y-2">
                <h3 className="text-sm font-bold text-[#1E293B]">Invoice preview</h3>
                <p className="text-xs font-semibold text-gray-700">invoice_0412.pdf · Page 1</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Highlighted fields correspond to the issues found by AI above.
                </p>
                <div className="pt-3">
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-50 border border-amber-300 text-[#351C15] text-[11px] font-bold rounded-lg">
                    <span className="w-2.5 h-2.5 bg-[#FFB500] rounded-xs" />
                    Declared value selected
                  </span>
                </div>
              </div>

              {/* Right: Mock Invoice Layout Frame */}
              <div className="lg:col-span-9 bg-gray-50/70 border border-gray-200 rounded-xl p-5 font-mono text-xs text-gray-700 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-bold uppercase tracking-wider text-gray-900">
                    COMMERCIAL INVOICE
                  </span>
                  <span className="text-[11px] text-gray-400">Invoice no. [INV-0412]</span>
                </div>

                <div className="flex justify-between text-[11px] text-gray-500">
                  <div>Seller: [ABC Exports Ltd]</div>
                  <div>Buyer: [Global Trades Inc]</div>
                  <div>Line Items: [Handbags]</div>
                </div>

                {/* Bounding boxes grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="border border-amber-300 bg-amber-50/60 rounded-lg p-2.5">
                    <span className="block text-[10px] text-gray-400 uppercase">Quantity</span>
                    <span className="font-bold text-gray-900 text-sm">240</span>
                  </div>

                  <div className="border border-amber-300 bg-amber-50/60 rounded-lg p-2.5">
                    <span className="block text-[10px] text-gray-400 uppercase">Gross weight</span>
                    <span className="font-bold text-gray-900 text-sm">118 kg</span>
                  </div>

                  <div className="border border-red-300 bg-red-50/60 rounded-lg p-2.5">
                    <span className="block text-[10px] text-red-500 uppercase">HS code</span>
                    <span className="font-bold text-red-600 text-sm">Missing</span>
                  </div>

                  <div className="border-2 border-[#FFB500] bg-amber-100/70 rounded-lg p-2.5 shadow-xs">
                    <span className="block text-[10px] text-[#351C15] font-bold uppercase">
                      Invoice Total · USD
                    </span>
                    <span className="font-extrabold text-[#351C15] text-base">$4,800</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: SIMPLIFIED CARD VIEW (Image 2) */}
      {viewMode === 'simplified' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  Validation failed
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    Fail
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  AI validation completed. Resolve the 2 critical issues before submitting this shipment.
                </p>
              </div>
            </div>
          </div>

          {/* Top 3 Issues Header */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-bold uppercase tracking-wider text-gray-700">Top 3 Issues</span>
            <span>Highest priority first</span>
          </div>

          {/* Issue Cards Stack */}
          <div className="space-y-4">
            {issues.slice(0, 3).map((issue) => (
              <div
                key={issue.id}
                className="border border-gray-200 rounded-xl p-5 hover:border-amber-300 transition-colors bg-white shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{issue.field}</span>
                      {issue.severity === 'Critical' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          ● Critical
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          ● Warning
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {issue.explanation}
                    </p>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        WHY IT MATTERS
                      </span>
                      <p className="text-xs text-gray-700">{issue.whyItMatters}</p>
                    </div>

                    <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        CORRECTION GUIDANCE
                      </span>
                      <p className="text-xs font-semibold text-[#351C15] mt-0.5">
                        {issue.suggestedCorrection}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => handleAcceptFix(issue.id)}
                      className="px-5 py-2 border border-gray-300 hover:border-amber-400 hover:bg-amber-50 rounded-lg text-xs font-bold text-gray-700 transition-all"
                    >
                      Fix
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToDetails}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to shipment details</span>
        </button>

        <button
          onClick={onProceedToReport}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#FFB500] hover:bg-[#EAA600] active:scale-95 text-[#351C15] font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <span>Review correction report</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[11px] text-gray-400">
          AI guidance supports review and does not confirm regulatory compliance. · UPS CrossBorder Ready
        </p>
      </div>
    </div>
  );
}
