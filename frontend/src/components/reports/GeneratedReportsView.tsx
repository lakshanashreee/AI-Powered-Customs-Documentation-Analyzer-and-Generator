import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Download,
  Eye,
  X,
  RotateCcw,
  ChevronDown,
  Plus
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useShipment } from '../../context/ShipmentContext';
import { ReportItem } from '../../types';

export const GeneratedReportsView: React.FC = () => {
  const { reports, setActiveNavTab, setStep } = useShipment();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('All dates');
  const [statusFilter, setStatusFilter] = useState('All');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest first');

  // Selected report for Slide-Over Drawer
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Dynamic Statistics computed from actual reports in database/state
  const stats = useMemo(() => {
    const total = reports.length;
    const passed = reports.filter((r) => r.status === 'Passed').length;
    const needsReview = reports.filter((r) => r.status === 'Needs Review').length;
    const failed = reports.filter((r) => r.status === 'Failed').length;
    return { total, passed, needsReview, failed };
  }, [reports]);

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
    return reports.filter((report) => {
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

      if (statusFilter !== 'All' && report.status !== statusFilter) {
        return false;
      }

      if (destinationFilter !== 'All') {
        if (!report.route.toLowerCase().includes(destinationFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [reports, searchQuery, statusFilter, destinationFilter]);

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
      doc.text(`Status: ${report.status}`, 14, 63);
      doc.text(`Readiness Score: ${report.readinessScore} / 100`, 14, 70);

      doc.setDrawColor(220, 220, 220);
      doc.line(14, 76, 196, 76);

      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text('Invoice & Entity Particulars', 14, 85);
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Seller: ${report.seller}`, 14, 93);
      doc.text(`Buyer / Consignee: ${report.buyer}`, 14, 100);
      doc.text(`Declared Cargo: ${report.lineItems}`, 14, 107);

      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text('Audit Findings & Validation Notes', 14, 120);
      let y = 128;
      report.detectedIssues.forEach((issue) => {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`• ${issue}`, 14, y);
        y += 7;
      });

      doc.save(`${report.reportId}_Customs_Audit_Report.pdf`);
      setDownloadToast(`Downloaded ${report.reportId}.pdf`);
      setTimeout(() => setDownloadToast(null), 3000);
    } catch (e) {
      console.error(e);
      alert('Unable to generate PDF');
    }
  };

  const handleDownloadReportCsv = (report: ReportItem) => {
    const headers = ['REPORT ID', 'SHIPMENT ID', 'INVOICE NAME', 'DATE', 'ROUTE', 'STATUS', 'READINESS', 'SELLER', 'BUYER'];
    const row = [
      `"${report.reportId}"`,
      `"${report.shipmentId}"`,
      `"${report.invoiceName}"`,
      `"${report.generatedDateTime}"`,
      `"${report.route}"`,
      `"${report.status}"`,
      `"${report.readinessScore}"`,
      `"${report.seller}"`,
      `"${report.buyer}"`
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${report.reportId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast(`Exported ${report.reportId}.csv`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleExportAllCsv = () => {
    if (filteredReports.length === 0) return;
    const headers = ['REPORT ID', 'SHIPMENT ID', 'INVOICE NAME', 'DATE', 'ROUTE', 'STATUS', 'ISSUES COUNT', 'READINESS'];
    const rows = filteredReports.map((r) => [
      `"${r.reportId}"`,
      `"${r.shipmentId}"`,
      `"${r.invoiceName}"`,
      `"${r.generatedDateTime}"`,
      `"${r.route}"`,
      `"${r.status}"`,
      `"${r.issuesCount}"`,
      `"${r.readinessScore}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'UPS_Customs_Reports.csv');
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
          disabled={reports.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-sm transition-all disabled:opacity-40 self-start sm:self-auto"
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

      {/* 4 Summary Metric Cards (Computed Dynamically from DB/State) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Total Reports</span>
            <span className="text-3xl font-extrabold text-gray-950 mt-1 block">{stats.total}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-ups-brown flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Passed */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Passed</span>
            <span className="text-3xl font-extrabold text-emerald-700 mt-1 block">{stats.passed}</span>
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
            <span className="text-3xl font-extrabold text-amber-700 mt-1 block">{stats.needsReview}</span>
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
            <span className="text-3xl font-extrabold text-red-600 mt-1 block">{stats.failed}</span>
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
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Mexico">Mexico</option>
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
              {filteredReports.length} matching of {reports.length} total records
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

        {/* Empty State when 0 reports exist */}
        {reports.length === 0 ? (
          <div className="py-20 text-center px-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 mb-4 border border-amber-200">
              <FileText className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              No customs validation reports generated yet
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md">
              Upload a commercial invoice in the Shipments workflow and submit for customs clearance to generate your first audit-ready compliance certificate.
            </p>
            <button
              onClick={() => {
                setActiveNavTab('shipments');
                setStep(1);
              }}
              className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-extrabold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Shipment Check</span>
            </button>
          </div>
        ) : filteredReports.length === 0 ? (
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

        {/* Pagination Footer (Only if records exist) */}
        {filteredReports.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Showing 1–{filteredReports.length} of {reports.length} reports
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 px-2 py-1 bg-amber-100 rounded">1</span>
            </div>
          </div>
        )}
      </div>

      {/* Slide-Over Drawer: Report Details */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedReport(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="p-6 space-y-6">
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
                      <span className="text-[10px] text-gray-500 block">Critical</span>
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
                      <span className="text-[10px] text-gray-500 block">Passed</span>
                      <span className="text-base font-extrabold text-emerald-600">
                        {selectedReport.passedChecks}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Detected issues
                  </h3>
                  <div className="space-y-2">
                    {selectedReport.detectedIssues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 flex-shrink-0 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          Issue
                        </span>
                        <span className="text-gray-700 leading-snug">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50/50 flex items-center gap-3">
                <button
                  onClick={() => handleDownloadReportPdf(selectedReport)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadReportCsv(selectedReport)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
