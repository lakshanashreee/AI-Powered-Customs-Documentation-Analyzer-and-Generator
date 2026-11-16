import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  RotateCcw, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { sampleReports } from '../data/mockData';

export function ReportsDashboard() {
  const [reports, setReports] = useState(sampleReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrigin, setSelectedOrigin] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [activeDrawerReport, setActiveDrawerReport] = useState(null);

  // Filters logic
  const filteredReports = reports.filter((r) => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.invoiceName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    const matchesOrigin = selectedOrigin === 'All' || r.origin === selectedOrigin;
    const matchesDestination = selectedDestination === 'All' || r.destination === selectedDestination;

    return matchesSearch && matchesStatus && matchesOrigin && matchesDestination;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedOrigin('All');
    setSelectedDestination('All');
  };

  const appliedFiltersCount = 
    (searchQuery ? 1 : 0) + 
    (selectedStatus !== 'All' ? 1 : 0) + 
    (selectedOrigin !== 'All' ? 1 : 0) + 
    (selectedDestination !== 'All' ? 1 : 0);

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 pt-2 px-4 sm:px-6 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs text-gray-500 font-medium mb-1">Reports</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
            Generated Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            View, search, filter and manage customs validation reports.
          </p>
        </div>

        <button
          onClick={() => alert("Exporting all 128 reports as CSV...")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Total Reports</span>
            <FileText className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#1E293B]">128</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Passed</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ● Passed
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600">84</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Needs Review</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              ● Needs Review
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-amber-600">31</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Failed</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              ● Failed
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-red-600">13</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">Filters</h2>
          <span className="text-xs text-gray-400 font-medium">{appliedFiltersCount} applied</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-5">
            <label className="block text-xs text-gray-500 mb-1">
              Search by report ID, shipment ID or invoice name
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reports..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Date range */}
          <div className="md:col-span-4">
            <label className="block text-xs text-gray-500 mb-1">Date range</label>
            <select className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] bg-white">
              <option>All dates</option>
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom range</option>
            </select>
          </div>

          {/* Time range */}
          <div className="md:col-span-3">
            <label className="block text-xs text-gray-500 mb-1">Time range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="From time"
                className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#FFB500]"
              />
              <input
                type="text"
                placeholder="To time"
                className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#FFB500]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end pt-1">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] bg-white"
            >
              <option value="All">All</option>
              <option value="Passed">Passed</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Origin country</label>
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] bg-white"
            >
              <option value="All">All</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
              <option value="China">China</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Destination country</label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] bg-white"
            >
              <option value="All">All</option>
              <option value="CAN">Canada (CAN)</option>
              <option value="MEX">Mexico (MEX)</option>
              <option value="GBR">United Kingdom (GBR)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {}}
              className="flex-1 py-2 px-3 bg-[#351C15] text-[#FFB500] hover:bg-black rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="py-2 px-3 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table or Empty Results State */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">Reports</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredReports.length} {filteredReports.length === 1 ? 'record' : 'records'} found
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>Sort by:</span>
            <select className="border border-gray-200 rounded-md px-2 py-1 text-xs font-semibold bg-white text-gray-700">
              <option>Newest first</option>
              <option>Oldest first</option>
              <option>Highest issues</option>
            </select>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          /* Empty State (Image 7) */
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Filter className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              No reports match the current filters
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Try another search query or clear all active filters to view your reports.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        ) : (
          /* Table View (Image 6) */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  <th className="py-3 px-3">REPORT ID</th>
                  <th className="py-3 px-3">SHIPMENT ID</th>
                  <th className="py-3 px-3">INVOICE NAME</th>
                  <th className="py-3 px-3">GENERATED DATE & TIME</th>
                  <th className="py-3 px-3">ROUTE</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3">ISSUES</th>
                  <th className="py-3 px-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-semibold text-gray-900">
                      {report.id}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-gray-600">
                      {report.shipmentId}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-gray-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate max-w-[130px]">{report.invoiceName}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500">
                      {report.dateTime}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-gray-700">
                      {report.route}
                    </td>
                    <td className="py-3.5 px-3">
                      {report.status === 'Passed' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ● Passed
                        </span>
                      )}
                      {report.status === 'Needs Review' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          ● Needs Review
                        </span>
                      )}
                      {report.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                          ● Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-gray-900 font-bold">
                      {report.issuesCount}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveDrawerReport(report)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-gray-500" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => alert(`Downloading PDF report ${report.id}...`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-gray-500" />
                          <span>Download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <span>Showing 1-5 of 128 reports</span>
              <div className="flex items-center gap-1 font-semibold">
                <span className="px-2.5 py-1 rounded bg-[#351C15] text-[#FFB500]">1</span>
                <span className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">2</span>
                <span className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">3</span>
                <span className="px-2 py-1 text-gray-400">..</span>
                <span className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">26</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over Report Details Drawer (Image 5) */}
      {activeDrawerReport && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#1E293B]">Report details</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    ● {activeDrawerReport.status}
                  </span>
                </div>
                <p className="text-xs font-mono text-gray-500 mt-0.5">
                  {activeDrawerReport.id} · Shipment {activeDrawerReport.shipmentId}
                </p>
              </div>
              <button
                onClick={() => setActiveDrawerReport(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              {/* Section 1: Invoice Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Invoice information
                </h3>
                <div className="bg-gray-50 rounded-xl p-3.5 space-y-2 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Invoice name</span>
                    <span className="font-semibold text-gray-900">{activeDrawerReport.invoiceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Seller</span>
                    <span className="font-semibold text-gray-900">{activeDrawerReport.seller}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Buyer</span>
                    <span className="font-semibold text-gray-900">{activeDrawerReport.buyer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Line items</span>
                    <span className="font-semibold text-gray-900">{activeDrawerReport.lineItems} SKU</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Validation Findings */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Validation findings
                </h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="border border-gray-200 rounded-lg p-2.5">
                    <span className="block text-[10px] text-gray-400 uppercase">Readiness</span>
                    <span className="font-extrabold text-[#351C15] text-sm">{activeDrawerReport.readiness}</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-2.5">
                    <span className="block text-[10px] text-gray-400 uppercase">Critical</span>
                    <span className="font-bold text-red-600 text-sm">0</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-2.5">
                    <span className="block text-[10px] text-gray-400 uppercase">Warnings</span>
                    <span className="font-bold text-amber-600 text-sm">{activeDrawerReport.issuesCount}</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-2.5">
                    <span className="block text-[10px] text-gray-400 uppercase">Passed</span>
                    <span className="font-bold text-emerald-600 text-sm">11</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Detected Issues */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Detected issues
                </h3>
                <div className="space-y-2">
                  <div className="p-3 border border-amber-200 bg-amber-50/50 rounded-lg flex items-start gap-2">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                      Needs Review
                    </span>
                    <span className="text-gray-700 leading-snug">
                      Gross weight mismatch between invoice and shipment entry.
                    </span>
                  </div>
                  <div className="p-3 border border-amber-200 bg-amber-50/50 rounded-lg flex items-start gap-2">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                      Needs Review
                    </span>
                    <span className="text-gray-700 leading-snug">
                      Country of origin is missing from the invoice line item.
                    </span>
                  </div>
                  <div className="p-3 border border-amber-200 bg-amber-50/50 rounded-lg flex items-start gap-2">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                      Needs Review
                    </span>
                    <span className="text-gray-700 leading-snug">
                      Harmonized code (HS) is incomplete or invalid.
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Suggested Corrections */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Suggested corrections
                </h3>
                <div className="space-y-2">
                  <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-700">
                    • Review the gross weight discrepancy before submission.
                  </div>
                  <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-700">
                    • Add country of origin to the invoice line item.
                  </div>
                  <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-700">
                    • Complete the Harmonized code for the declared item.
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => alert(`Downloading PDF report ${activeDrawerReport.id}...`)}
                className="flex-1 py-2.5 px-3 bg-[#351C15] text-[#FFB500] hover:bg-black rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => alert(`Downloading CSV data for ${activeDrawerReport.id}...`)}
                className="flex-1 py-2.5 px-3 border border-gray-300 hover:bg-white rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
