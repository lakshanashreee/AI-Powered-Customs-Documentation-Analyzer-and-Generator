import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Lock, 
  ArrowLeft, 
  Sparkles,
  Save,
  Check
} from 'lucide-react';

export function CorrectionReport({ onBackToValidation, onSubmitSuccess }) {
  const [exceptionNote, setExceptionNote] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSaveNote = () => {
    if (!exceptionNote.trim()) return;
    setIsNoteSaved(true);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (onSubmitSuccess) {
      setTimeout(onSubmitSuccess, 1500);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 pt-2 px-4 sm:px-6">
      {/* Header and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs text-gray-500 font-medium mb-1">
            Shipments / #0412 / <span className="text-gray-900 font-semibold">Report & submit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
            Correction report
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Review the changes and document any exceptions before submitting.
          </p>
        </div>

        <div className="flex items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            Not submitted
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Report Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#351C15]" />
                <h2 className="text-base font-bold text-[#1E293B]">Report preview</h2>
              </div>
              <span className="text-xs font-mono font-medium text-gray-500">
                Shipment #0412
              </span>
            </div>

            {/* Big Readiness Banner */}
            <div className="bg-gradient-to-r from-amber-50/60 to-white border border-amber-200/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-gray-700">Readiness after fixes</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  4 fields updated · 1 exception {isNoteSaved ? 'documented' : 'needs a note'}
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-400 line-through">62</span>
                <span className="text-gray-400 text-xl font-bold">→</span>
                <span className="text-4xl font-black text-[#351C15]">94</span>
                <span className="text-xs font-bold text-gray-400">/ 100</span>
              </div>
            </div>

            {/* Summary by Severity (3 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/50">
                <span className="block text-[10px] font-bold text-gray-400 uppercase">
                  Critical issues
                </span>
                <span className="block text-base font-bold text-emerald-700 mt-1">
                  2 corrected
                </span>
                <span className="block text-[11px] text-gray-500 mt-0.5">
                  No critical issues remaining
                </span>
              </div>

              <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/50">
                <span className="block text-[10px] font-bold text-gray-400 uppercase">
                  Warnings
                </span>
                <span className="block text-base font-bold text-amber-700 mt-1">
                  2 corrected · 1 ignored
                </span>
                <span className="block text-[11px] text-gray-500 mt-0.5">
                  {isNoteSaved ? 'Ignored weight justified' : 'Ignored weight needs a note'}
                </span>
              </div>

              <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/50">
                <span className="block text-[10px] font-bold text-gray-400 uppercase">
                  Checks passed
                </span>
                <span className="block text-base font-bold text-gray-900 mt-1">
                  14 passed
                </span>
                <span className="block text-[11px] text-gray-500 mt-0.5">
                  Unchanged from validation
                </span>
              </div>
            </div>

            {/* Field-by-Field Corrections Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Field-by-field corrections
              </h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                <div className="grid grid-cols-12 bg-gray-50 px-3.5 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <div className="col-span-3">FIELD</div>
                  <div className="col-span-3">ORIGINAL</div>
                  <div className="col-span-4">CORRECTED / REVIEW OUTCOME</div>
                  <div className="col-span-2 text-right">STATUS</div>
                </div>

                <div className="grid grid-cols-12 px-3.5 py-3 items-center text-xs">
                  <div className="col-span-3 font-semibold text-gray-900">Declared value</div>
                  <div className="col-span-3 font-mono text-gray-500">$3,900</div>
                  <div className="col-span-4 font-mono font-semibold text-emerald-800">$4,800</div>
                  <div className="col-span-2 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ● Corrected
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 px-3.5 py-3 items-center text-xs bg-gray-50/30">
                  <div className="col-span-3 font-semibold text-gray-900">HS code</div>
                  <div className="col-span-3 text-gray-400">Missing</div>
                  <div className="col-span-4 font-mono font-semibold text-emerald-800">Added · [4202.21]</div>
                  <div className="col-span-2 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ● Added
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 px-3.5 py-3 items-center text-xs">
                  <div className="col-span-3 font-semibold text-gray-900">Quantity</div>
                  <div className="col-span-3 font-mono text-gray-500">204</div>
                  <div className="col-span-4 font-mono font-semibold text-emerald-800">240</div>
                  <div className="col-span-2 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ● Corrected
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 px-3.5 py-3 items-center text-xs bg-gray-50/30">
                  <div className="col-span-3 font-semibold text-gray-900">Description</div>
                  <div className="col-span-3 text-gray-500 italic">"Clothes"</div>
                  <div className="col-span-4 font-semibold text-emerald-800">Leather Handbags (Genuine)</div>
                  <div className="col-span-2 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ● Updated
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 px-3.5 py-3 items-center text-xs bg-amber-50/40">
                  <div className="col-span-3 font-semibold text-gray-900">Gross weight</div>
                  <div className="col-span-3 font-mono text-gray-500">96 kg</div>
                  <div className="col-span-4 text-[11px] text-gray-700">
                    <span className="font-semibold text-gray-900">96 kg retained</span>
                    <span className="block text-gray-500 font-mono text-[10px]">Invoice 118 kg · Mismatch ignored</span>
                  </div>
                  <div className="col-span-2 text-right">
                    {isNoteSaved ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ● Documented
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                        ● Needs note
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Explanations & Compliance Notes */}
            <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI explanations & compliance notes</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Declared value now matches the $4,800 invoice total. Quantity is aligned to 240; an HS code and a more specific description have been added for customs review.
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gross weight remains 96 kg against 118 kg on the commercial invoice. This warning was marked as an accepted operational variance. A formal exception note is attached below.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToValidation}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to validation</span>
          </button>
        </div>

        {/* Right Column: Before You Submit (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-[#1E293B]">Before you submit</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {isNoteSaved ? '0 notes required' : '1 note required'}
              </span>
            </div>

            {/* Readiness Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Declared value corrected</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>HS code added</span>
              </div>
              <div className={`flex items-center gap-2.5 font-medium ${isNoteSaved ? 'text-emerald-700' : 'text-amber-800'}`}>
                {isNoteSaved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>Weight mismatch ignored {isNoteSaved ? '(documented)' : '(needs note)'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All required fields complete</span>
              </div>
            </div>

            {/* Mandatory Exception Note */}
            <div className="pt-2 space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Reason for ignoring weight mismatch <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={exceptionNote}
                onChange={(e) => setExceptionNote(e.target.value)}
                placeholder="Explain why 96 kg is retained when the invoice shows 118 kg..."
                className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent transition-all"
              />
              <p className="text-[11px] text-gray-400">
                Required before submission. The weight discrepancy remains open until reviewed.
              </p>
              <button
                onClick={handleSaveNote}
                disabled={!exceptionNote.trim()}
                className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  isNoteSaved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : exceptionNote.trim()
                    ? 'bg-[#351C15] text-[#FFB500] hover:bg-black'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isNoteSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isNoteSaved ? 'Note Saved' : 'Save note'}</span>
              </button>
            </div>

            {/* Download Buttons */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <span className="block text-[11px] font-bold text-gray-400 uppercase">
                Download correction report
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => alert("Downloading PDF audit report...")}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => alert("Downloading CSV structured data...")}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>

            {/* Final Submission Button */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={!isNoteSaved || isSubmitted}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isSubmitted
                    ? 'bg-emerald-600 text-white'
                    : isNoteSaved
                    ? 'bg-[#FFB500] hover:bg-[#EAA600] active:scale-95 text-[#351C15] cursor-pointer'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submitted to Customs Pipeline!</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gray-600" />
                    <span>Submit for customs clearance</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2 leading-relaxed">
                {isNoteSaved
                  ? 'All requirements satisfied. Ready to push to UPS Customs Brokerage.'
                  : 'Add the required note to enable submission. Nothing has been submitted.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
