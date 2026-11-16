import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Download,
  Eye,
  X,
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export interface ReportItem {
  id: string;
  reportId: string;
  shipmentId: string;
  invoiceName: string;
  generatedDateTime: string;
  route: string;
  status: 'Passed' | 'Needs Review' | 'Failed';
  issuesCount: number;
  seller: string;
  buyer: string;
  lineItems: string;
  readinessScore: number;
  criticalIssues: number;
  warnings: number;
  passedChecks: number;
  detectedIssues: string[];
  suggestedCorrections: string[];
}

const MOCK_REPORTS: ReportItem[] = [
  {
    id: '1',
    reportId: 'RPT-0412',
    shipmentId: '#0412',
    invoiceName: 'invoice_0412.pdf',
    generatedDateTime: '2026-11-05 09:42',
    route: 'USA → CAN',
    status: 'Passed',
    issuesCount: 0,
    seller: 'ABC Exports Ltd.',
    buyer: 'Global Traders Inc.',
    lineItems: '1 SKU · Leather Handbags',
    readinessScore: 94,
    criticalIssues: 0,
    warnings: 0,
    passedChecks: 14,
    detectedIssues: ['All validation checks cleared successfully.'],
    suggestedCorrections: ['Ready for customs brokerage electronic entry.']
  },
  {
    id: '2',
    reportId: 'RPT-0411',
    shipmentId: '#0411',
    invoiceName: 'invoice_0411.pdf',
    generatedDateTime: '2026-11-05 08:17',
    route: 'USA → MEX',
    status: 'Needs Review',
    issuesCount: 3,
    seller: 'Northwind Apparel',
    buyer: 'Monterrey Retail S.A.',
    lineItems: '1 SKU',
    readinessScore: 82,
    criticalIssues: 0,
    warnings: 3,
    passedChecks: 11,
    detectedIssues: [
      'Gross weight mismatch between invoice and shipment entry',
      'Country of origin is missing from the invoice line item',
      'Harmonized code is incomplete'
    ],
    suggestedCorrections: [
      'Review the gross weight discrepancy before submission',
      'Add country of origin to the invoice line item',
      'Complete the Harmonized code for the declared item'
    ]
  },
  {
    id: '3',
    reportId: 'RPT-0410',
    shipmentId: '#0410',
    invoiceName: 'invoice_0410.pdf',
    generatedDateTime: '2026-11-04 16:54',
    route: 'USA → CAN',
    status: 'Failed',
    issuesCount: 2,
    seller: 'Apex Precision Tools',
    buyer: 'Ontario Machinery Corp.',
    lineItems: '3 SKUs · CNC Carbide Bits',
    readinessScore: 54,
    criticalIssues: 2,
    warnings: 1,
    passedChecks: 9,
    detectedIssues: [
      'Declared value is below statutory tariff threshold ($1,200 vs $3,400)',
      'Missing EORI and Canadian Business Number (BN9)',
      'Inconsistent currency symbols between header and subtotal'
    ],
    suggestedCorrections: [
      'Reconcile invoice total with purchase contract before customs filing',
      'Enter verified Canadian Business Number of importer',
      'Standardize currency to CAD or USD across all line items'
    ]
  },
  {
    id: '4',
    reportId: 'RPT-0409',
    shipmentId: '#0409',
    invoiceName: 'invoice_0409.pdf',
    generatedDateTime: '2026-11-04 14:21',
    route: 'USA → GBR',
    status: 'Passed',
    issuesCount: 0,
    seller: 'Meridian Trade Ltd.',
    buyer: 'Thames Logistics UK',
    lineItems: '4 SKUs · Cotton Textiles',
    readinessScore: 98,
    criticalIssues: 0,
    warnings: 0,
    passedChecks: 14,
    detectedIssues: ['All line items verified with UK Tariff Schedule.'],
    suggestedCorrections: ['No corrections needed.']
  },
  {
    id: '5',
    reportId: 'RPT-0408',
    shipmentId: '#0408',
    invoiceName: 'invoice_0408.pdf',
    generatedDateTime: '2026-11-04 11:06',
    route: 'USA → CAN',
    status: 'Needs Review',
    issuesCount: 1,
    seller: 'BioHealth Instruments',
    buyer: 'Quebec MedTech Inc.',
    lineItems: '2 SKUs · Diagnostic Sensors',
    readinessScore: 88,
    criticalIssues: 0,
    warnings: 1,
    passedChecks: 13,
    detectedIssues: ['Medical device classification requires FDA/Health Canada license citation.'],
    suggestedCorrections: ['Attach Health Canada establishment license confirmation note.']
  }
];

export const GeneratedReportsView: React.FC = () => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('All dates');
  const [statusFilter, setStatusFilter] = useState('All');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest first');

  // Selected report for Slide-Over Drawer
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Applied Filter Counter
  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (dateRange !== 'All dates') count++;
    if (statusFilter !== 'All') count++;
    if (destinationFilter !== 'All') count++;
    return count;
  }, [searchQuery, dateRange, statusFilter, destinationFilter]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return MOCK_REPORTS.filter((report) => {
      // Search matching reportId, shipmentId, or invoiceName
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          report.reportId.toLowerCase().includes(query) ||
          report.shipmentId.toLowerCase().includes(query) ||
          report.invoiceName.toLowerCase().includes(query) ||
          report.seller.toLowerCase().includes(query) ||
          report.buyer.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Status
      if (statusFilter !== 'All' && report.status !== statusFilter) {
        return false;
      }

      // Route Destination filter
      if (destinationFilter !== 'All') {
        const [, dest] = report.route.split(' → ');
        if (dest !== destinationFilter) return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, destinationFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateRange('All dates');
    setStatusFilter('All');
    setDestinationFilter('All');
  };

  const handleDownloadReportPdf = (report: ReportItem) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(53, 28, 21);
      doc.rect(0, 0, 210, 24, 'F');
      doc.setTextColor(255, 181, 0);
      doc.setFontSize(15);
      doc.text(`UPS CrossBorder Ready - ${report.reportId}`, 14, 16);

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(11);
      doc.text(`Shipment: ${report.shipmentId}`, 14, 35);
      doc.text(`Invoice: ${report.invoiceName}`, 14, 42);
      doc.text(`Generated: ${report.generatedDateTime}`, 14, 49);
      doc.text(`Route: ${report.route}`, 14, 56);
      doc.text(`Status: ${report.status} | Readiness: ${report.readinessScore}/100`, 14, 63);

      doc.setDrawColor(220, 220, 220);
      doc.line(14, 70, 196, 70);

      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text('Invoice Details:', 14, 80);
      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text(`Seller: ${report.seller}`, 14, 88);
      doc.text(`Buyer: ${report.buyer}`, 14, 95);
      doc.text(`Line Items: ${report.lineItems}`, 14, 102);

      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text('Detected Issues & Validation Findings:', 14, 115);
      let y = 125;
      report.detectedIssues.forEach((issue) => {
        doc.setFontSize(10);
        doc.setTextColor(180, 50, 50);
        doc.text(`• ${issue}`, 14, y);
        y += 8;
      });

      y += 4;
      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text('Suggested Corrections:', 14, y);
      y += 10;
      report.suggestedCorrections.forEach((corr) => {
        doc.setFontSize(10);
        doc.setTextColor(40, 120, 50);
        doc.text(`• ${corr}`, 14, y);
        y += 8;
      });

      doc.save(`${report.reportId}_Customs_Validation.pdf`);
      setDownloadToast(`Downloaded ${report.reportId}.pdf`);
      setTimeout(() => setDownloadToast(null), 3000);
    } catch (e) {
      console.error(e);
      alert('Error generating PDF');
    }
  };

  const handleDownloadReportCsv = (report: ReportItem) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'REPORT ID,SHIPMENT ID,INVOICE NAME,DATE,ROUTE,STATUS,SCORE,ISSUES',
        `"${report.reportId}","${report.shipmentId}","${report.invoiceName}","${report.generatedDateTime}","${report.route}","${report.status}","${report.readinessScore}","${report.detectedIssues.join('; ')}"`
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${report.reportId}_Customs_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast(`Exported ${report.reportId}.csv`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleExportAllCsv = () => {
    const headers = ['REPORT ID', 'SHIPMENT ID', 'INVOICE NAME', 'DATE', 'ROUTE', 'STATUS', 'ISSUES COUNT'];
    const rows = filteredReports.map((r) => [
      `"${r.reportId}"`,
      `"${r.shipmentId}"`,
      `"${r.invoiceName}"`,
      `"${r.generatedDateTime}"`,
      `"${r.route}"`,
      `"${r.status}"`,
      `"${r.issuesCount}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'UPS_Generated_Customs_Reports.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast('All filtered reports exported to CSV');
    setTimeout(() => setDownloadToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative">
      {/* Breadcrumb Navigation */}
      <div className="text-xs text-gray-500 font-medium">Reports</div>

      {/* Page Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Generated Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            View, search, filter and manage customs validation reports.
          </p>
        </div>

        <button
          onClick={handleExportAllCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-gray-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Toast Notification */}
      {downloadToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 animate-in fade-in flex items-center justify-between shadow-sm">
          <span>✓ {downloadToast}</span>
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Total Reports</span>
            <span className="text-3xl font-extrabold text-gray-950 mt-1 block">128</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-ups-brown flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Passed */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Passed</span>
            <span className="text-3xl font-extrabold text-emerald-700 mt-1 block">84</span>
          </div>
          <div className="self-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Passed
            </span>
          </div>
        </div>

        {/* Needs Review */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Needs Review</span>
            <span className="text-3xl font-extrabold text-amber-700 mt-1 block">31</span>
          </div>
          <div className="self-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/90 text-amber-900 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              Needs Review
            </span>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Failed</span>
            <span className="text-3xl font-extrabold text-red-600 mt-1 block">13</span>
          </div>
          <div className="self-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              Failed
            </span>
          </div>
        </div>
      </div>

      {/* Filters Box */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Filters</h2>
          <span className="text-xs text-gray-500">{appliedFiltersCount} applied</span>
        </div>

        {/* Simplified Filters Grid: Search, Date, Status, Destination & Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* Search Input */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Search by report ID, shipment ID or invoice name
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, shipment, or invoice..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Date Range Dropdown */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Date range</label>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all bg-white appearance-none"
              >
                <option value="All dates">All dates</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all bg-white appearance-none"
              >
                <option value="All">All statuses</option>
                <option value="Passed">Passed</option>
                <option value="Needs Review">Needs Review</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Destination Country */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Destination</label>
            <div className="relative">
              <select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all bg-white appearance-none"
              >
                <option value="All">All destinations</option>
                <option value="CAN">Canada (CAN)</option>
                <option value="MEX">Mexico (MEX)</option>
                <option value="GBR">United Kingdom (GBR)</option>
                <option value="USA">USA</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Clear Button */}
          <div className="lg:col-span-1">
            <button
              onClick={handleClearFilters}
              title="Reset all filters"
              className="w-full py-2.5 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs shadow-sm transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline lg:hidden">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-card overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Reports</h2>
            <span className="text-xs text-gray-500">
              {filteredReports.length === 0
                ? '0 matching reports · 128 total'
                : `${filteredReports.length} of 128 total records`}
            </span>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-gray-500">Sort by</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 outline-none pr-7 appearance-none"
              >
                <option value="Newest first">Newest first</option>
                <option value="Oldest first">Oldest first</option>
                <option value="Most issues">Most issues</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table or Empty State */}
        {filteredReports.length === 0 ? (
          /* Empty State matching Image 2 */
          <div className="py-20 text-center px-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              No reports match the current filters
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Try another search or clear all filters to view your reports.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span>Clear All</span>
            </button>
          </div>
        ) : (
          /* Reports Data Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">REPORT ID</th>
                  <th className="py-3 px-3">SHIPMENT ID</th>
                  <th className="py-3 px-3">INVOICE NAME</th>
                  <th className="py-3 px-3">GENERATED DATE & TIME</th>
                  <th className="py-3 px-3">ROUTE</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3">ISSUES</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {report.reportId}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-gray-600">
                      {report.shipmentId}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-gray-800">
                      {report.invoiceName}
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 font-mono">
                      {report.generatedDateTime}
                    </td>
                    <td className="py-3.5 px-3 text-gray-700 font-medium">
                      {report.route}
                    </td>
                    <td className="py-3.5 px-3">
                      {report.status === 'Passed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Passed
                        </span>
                      )}
                      {report.status === 'Needs Review' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/90 text-amber-900 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          Needs Review
                        </span>
                      )}
                      {report.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-gray-700">
                      {report.issuesCount}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-ups-gold hover:bg-amber-50/50 text-gray-700 font-semibold text-xs shadow-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-gray-500" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadReportPdf(report)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-ups-gold hover:bg-amber-50/50 text-gray-700 font-semibold text-xs shadow-xs transition-colors"
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
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Showing 1–{filteredReports.length} of 128 reports
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900 px-2 py-1 bg-amber-100 rounded">1</span>
            <button className="px-2 py-1 hover:text-black">2</button>
            <button className="px-2 py-1 hover:text-black">3</button>
            <span>...</span>
            <button className="px-2 py-1 hover:text-black">26</button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold">
              <RotateCcw className="w-3 h-3" />
              <span>Previous</span>
            </button>
            <button className="px-4 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Over Drawer: Report Details (matches Image 3) */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedReport(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-900">Report details</h2>
                      {selectedReport.status === 'Needs Review' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          Needs Review
                        </span>
                      ) : selectedReport.status === 'Passed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          Failed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {selectedReport.reportId} · Shipment {selectedReport.shipmentId}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Invoice Information Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Invoice information
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">Invoice name</span>
                      <span className="font-semibold text-gray-900">{selectedReport.invoiceName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">Seller</span>
                      <span className="font-semibold text-gray-900">{selectedReport.seller}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">Buyer</span>
                      <span className="font-semibold text-gray-900">{selectedReport.buyer}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">Line items</span>
                      <span className="font-semibold text-gray-900">{selectedReport.lineItems}</span>
                    </div>
                  </div>
                </div>

                {/* Validation findings Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Validation findings
                  </h3>
                  <div className="grid grid-cols-4 gap-2 text-center p-3 bg-gray-50 rounded-2xl border border-gray-200">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Readiness</span>
                      <span className="text-base font-extrabold text-gray-950">
                        {selectedReport.readinessScore}
                        <span className="text-[10px] text-gray-400 font-normal"> / 100</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Critical issues</span>
                      <span className="text-base font-extrabold text-red-600">
                        {selectedReport.criticalIssues}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Warnings</span>
                      <span className="text-base font-extrabold text-amber-500">
                        {selectedReport.warnings}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Passed checks</span>
                      <span className="text-base font-extrabold text-emerald-600">
                        {selectedReport.passedChecks}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detected issues Section */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Detected issues
                  </h3>
                  <div className="space-y-2">
                    {selectedReport.detectedIssues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 flex-shrink-0 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          Needs Review
                        </span>
                        <span className="text-gray-800 leading-relaxed">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested corrections Section */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Suggested corrections
                  </h3>
                  <div className="space-y-2">
                    {selectedReport.suggestedCorrections.map((corr, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 flex-shrink-0 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          Needs Review
                        </span>
                        <span className="text-gray-800 leading-relaxed">{corr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                <button
                  onClick={() => handleDownloadReportPdf(selectedReport)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadReportCsv(selectedReport)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 border-t border-gray-200 gap-2">
        <span>Readiness is an AI review indicator, not a guarantee of customs clearance or regulatory compliance.</span>
        <span>UPS CrossBorder Ready</span>
      </div>
    </div>
  );
};
