import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  Lock,
  Unlock,
  Sparkles,
  ShieldAlert,
  Save,
  Check,
  Send,
  Loader2
} from 'lucide-react';
import { useShipment } from '../../context/ShipmentContext';
import { Badge } from '../common/Badge';
import { SubmissionModal } from '../common/SubmissionModal';
import { jsPDF } from 'jspdf';

export const Step4ReportSubmit: React.FC = () => {
  const {
    shipmentDetails,
    auditRecords,
    exceptionReason,
    setExceptionReason,
    isNoteSaved,
    saveExceptionNote,
    setStep,
    submitForCustomsClearance,
    isSubmitting,
    isSubmitted
  } = useShipment();

  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exceptionReason.trim()) return;
    saveExceptionNote();
  };

  const handlePreFillSuggestedReason = () => {
    setExceptionReason(
      'Net weight of items is 96 kg; invoice shows 118 kg gross weight including wooden pallet and crating packaging.'
    );
  };

  const handleDownloadCsv = () => {
    const headers = ['FIELD', 'ORIGINAL', 'CORRECTED / REVIEW OUTCOME', 'STATUS', 'EXCEPTION NOTE'];
    const rows = auditRecords.map((r) => [
      `"${r.field}"`,
      `"${r.original.replace(/\n/g, ' ')}"`,
      `"${r.corrected.replace(/\n/g, ' ')}"`,
      `"${r.status}"`,
      `"${r.note || (r.field === 'Gross weight' ? exceptionReason : '')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Customs_Correction_Report_Shipment_${shipmentDetails.shipmentNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast('CSV export downloaded');
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica');

      // Header Banner
      doc.setFillColor(53, 28, 21); // UPS brown
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 181, 0); // UPS gold
      doc.setFontSize(16);
      doc.text('UPS CrossBorder Ready - Customs Correction Report', 14, 16);

      // Shipment details
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(11);
      doc.text(`Shipment Reference: #${shipmentDetails.shipmentNumber}`, 14, 35);
      doc.text(`Date of Audit: ${new Date().toLocaleDateString()}`, 14, 42);
      doc.text(`Route: ${shipmentDetails.originCountry} to ${shipmentDetails.destinationCountry}`, 14, 49);
      doc.text(`Readiness Score: 94 / 100 (Cleared with Documented Exception)`, 14, 56);

      // Section
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 62, 196, 62);
      doc.setFontSize(13);
      doc.text('Field-by-Field Corrections Audit Trail', 14, 70);

      // Table rows
      let y = 80;
      auditRecords.forEach((record) => {
        doc.setFontSize(10);
        doc.setTextColor(20, 20, 20);
        doc.text(`${record.field}:`, 14, y);
        doc.setTextColor(80, 80, 80);
        doc.text(`Original: ${record.original.replace(/\n/g, ' ')}`, 60, y);
        doc.text(`Corrected: ${record.corrected.replace(/\n/g, ' ')}`, 110, y);
        doc.setTextColor(record.status === 'Needs note' ? 180 : 20, 100, 20);
        doc.text(`[${record.status}]`, 175, y);
        y += 10;
      });

      // Notes section
      if (exceptionReason) {
        y += 6;
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        doc.text('Documented Exception Justification:', 14, y);
        y += 7;
        doc.setFontSize(9);
        doc.setTextColor(70, 70, 70);
        const splitText = doc.splitTextToSize(exceptionReason, 180);
        doc.text(splitText, 14, y);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Certified by UPS CrossBorder Ready AI Customs Documentation Analyzer Engine.', 14, 280);

      doc.save(`Correction_Report_Shipment_${shipmentDetails.shipmentNumber}.pdf`);
      setDownloadToast('PDF document generated and downloaded');
      setTimeout(() => setDownloadToast(null), 3000);
    } catch (e) {
      console.error(e);
      alert('Error generating PDF, CSV fallback is available.');
    }
  };

  const handleSubmit = async () => {
    if (!isNoteSaved && !exceptionReason.trim()) return;
    if (!isNoteSaved) {
      saveExceptionNote();
    }
    await submitForCustomsClearance();
    setIsSubmissionModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
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
        <span className="text-gray-500">Report & submit</span>
      </div>

      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Correction report
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Review the changes and document any exceptions before submitting.
          </p>
        </div>
        <div className="self-start sm:self-auto">
          {isSubmitted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Submitted for clearance
            </span>
          ) : (
            <Badge variant="not_submitted" label="Not submitted" />
          )}
        </div>
      </div>

      {/* Download Toast Notification */}
      {downloadToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 animate-in fade-in flex items-center justify-between">
          <span>✓ {downloadToast}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Report Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Readiness After Fixes Banner Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Report preview
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  Shipment #{shipmentDetails.shipmentNumber}
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-950 mt-1">
                Readiness after fixes
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                4 fields updated · 1 exception needs a note
              </p>
            </div>

            {/* Score Delta Display: 62 -> 94 / 100 */}
            <div className="flex items-baseline gap-2 bg-amber-50/80 px-4 py-3 rounded-2xl border border-amber-200/80 self-start sm:self-auto">
              <span className="text-2xl font-bold text-gray-400 line-through">62</span>
              <span className="text-xl font-bold text-emerald-600">→</span>
              <span className="text-3xl font-extrabold text-emerald-700">94</span>
              <span className="text-xs font-semibold text-gray-400">/ 100</span>
            </div>
          </div>

          {/* Summary by Severity (3 cards row) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Critical issues */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-card">
              <span className="text-xs font-semibold text-gray-500 block">Critical issues</span>
              <span className="text-base font-extrabold text-emerald-700 block mt-1">
                2 corrected
              </span>
              <span className="text-[11px] text-gray-400 block mt-0.5">
                No critical issues remaining
              </span>
            </div>

            {/* Warnings */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-card">
              <span className="text-xs font-semibold text-gray-500 block">Warnings</span>
              <span className="text-base font-extrabold text-amber-700 block mt-1">
                2 corrected · 1 ignored
              </span>
              <span className="text-[11px] text-amber-600/90 block mt-0.5">
                {isNoteSaved ? 'Note attached' : 'Ignored weight needs a note'}
              </span>
            </div>

            {/* Checks passed */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-card">
              <span className="text-xs font-semibold text-gray-500 block">Checks passed</span>
              <span className="text-base font-extrabold text-emerald-700 block mt-1">
                14 passed
              </span>
              <span className="text-[11px] text-gray-400 block mt-0.5">
                Unchanged from validation
              </span>
            </div>
          </div>

          {/* Field-by-field corrections Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">
                Field-by-field corrections
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[10px] border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4">Field</th>
                    <th className="py-2.5 px-3">Original</th>
                    <th className="py-2.5 px-4">Corrected / Review Outcome</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditRecords.map((record, index) => {
                    const isNeedsNote = record.field === 'Gross weight';

                    return (
                      <tr
                        key={index}
                        className={`transition-colors ${
                          isNeedsNote && !isNoteSaved
                            ? 'bg-amber-50/70'
                            : 'hover:bg-gray-50/50'
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          {record.field}
                        </td>
                        <td className="py-3 px-3 text-gray-600 font-mono">
                          {record.original}
                        </td>
                        <td className="py-3 px-4 text-gray-800 font-medium whitespace-pre-line">
                          {record.corrected}
                          {isNeedsNote && isNoteSaved && (
                            <span className="block text-[11px] text-emerald-700 font-normal italic mt-0.5">
                              Note: "{exceptionReason}"
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {isNeedsNote ? (
                            isNoteSaved ? (
                              <Badge variant="corrected" label="Note attached" />
                            ) : (
                              <Badge variant="needs_note" label="Needs note" />
                            )
                          ) : record.status === 'Corrected' ? (
                            <Badge variant="corrected" label="Corrected" />
                          ) : record.status === 'Added' ? (
                            <Badge variant="added" label="Added" />
                          ) : (
                            <Badge variant="updated" label="Updated" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI explanations & compliance notes Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ups-gold-dark" />
              <h3 className="text-sm font-bold text-gray-900">
                AI explanations & compliance notes
              </h3>
            </div>

            <div className="text-xs text-gray-700 space-y-2.5 leading-relaxed bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
              <p>
                Declared value now matches the $4,800 invoice total. Quantity is aligned to 240; an HS code and a more specific description have been added for review.
              </p>
              <p>
                Gross weight remains 96 kg against 118 kg on the invoice. This warning was ignored, not resolved. A reason is required before submission.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Verification & Submission Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Before You Submit Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Before you submit</h3>
              {isNoteSaved ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ Ready
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  • 1 note required
                </span>
              )}
            </div>

            {/* Verification Checklist */}
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Declared value corrected</span>
              </li>
              <li className="flex items-center gap-2 text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>HS code added</span>
              </li>
              <li className="flex items-center gap-2 text-gray-800">
                {isNoteSaved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
                <span className={isNoteSaved ? 'text-gray-800' : 'text-amber-800 font-medium'}>
                  Weight mismatch ignored {isNoteSaved ? '(note documented)' : '(needs note)'}
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>All required fields complete</span>
              </li>
            </ul>

            {/* Reason for Ignoring Weight Mismatch Form */}
            <form onSubmit={handleSaveNote} className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-800">
                  Reason for ignoring weight mismatch <span className="text-red-500">*</span>
                </label>
                {!exceptionReason && (
                  <button
                    type="button"
                    onClick={handlePreFillSuggestedReason}
                    className="text-[10px] text-ups-brown underline hover:text-black font-semibold"
                  >
                    Suggest note
                  </button>
                )}
              </div>

              <textarea
                value={exceptionReason}
                onChange={(e) => setExceptionReason(e.target.value)}
                rows={3}
                placeholder="Explain why 96 kg is retained when the invoice shows 118 kg..."
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-xs text-gray-800 transition-all placeholder:text-gray-400"
              />

              {!isNoteSaved && (
                <div className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-700" />
                  <span>
                    Required before submission. The weight discrepancy remains open until reviewed.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={!exceptionReason.trim()}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isNoteSaved
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : exceptionReason.trim()
                    ? 'bg-gray-900 text-white hover:bg-black shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isNoteSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Note saved & attached</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save note</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Download Correction Report Buttons */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-card space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Download correction report
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs shadow-sm transition-colors"
              >
                <FileText className="w-4 h-4 text-red-500" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCsv}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs shadow-sm transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* Primary Submit CTA */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isNoteSaved && !exceptionReason.trim()}
              className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                isNoteSaved || exceptionReason.trim()
                  ? 'bg-ups-gold hover:bg-ups-gold-hover text-ups-brown active:scale-95 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-ups-brown" />
                  <span>Submitting to Customs Brokerage...</span>
                </>
              ) : isNoteSaved || exceptionReason.trim() ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Submit for customs clearance</span>
                  <Send className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Submit for customs clearance</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-500 text-center">
              {isNoteSaved || exceptionReason.trim()
                ? 'Ready for submission. Click to submit electronic clearance manifest.'
                : 'Add the required note to enable submission. Nothing has been submitted.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to review & fix</span>
        </button>

        <div className="text-xs font-medium text-gray-500">
          {isNoteSaved
            ? 'Ready to submit · Clearance verification complete'
            : 'Submission pending · Exception note required'}
        </div>
      </div>

      {/* Footer Legal Disclaimer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 border-t border-gray-100 gap-2">
        <span>Readiness is an AI review indicator, not a guarantee of customs clearance or regulatory compliance.</span>
        <span>UPS CrossBorder Ready</span>
      </div>

      {/* Submission Success Modal */}
      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
      />
    </div>
  );
};
