import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  FolderOpen,
  Lightbulb,
  Package,
  Save,
  ArrowRight,
  Plane,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import { useShipment } from '../../context/ShipmentContext';

export const Step1UploadDetails: React.FC = () => {
  const {
    shipmentDetails,
    updateShipmentDetails,
    documents,
    addDocument,
    removeDocument,
    setStep,
    setReviewSubView
  } = useShipment();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addDocument(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addDocument(e.dataTransfer.files[0]);
    }
  };

  const handleSaveDraft = () => {
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 2500);
  };

  const handleRunAiValidation = () => {
    // Moves to review and fix (starts at summary view as per image 2)
    setReviewSubView('summary');
    setStep(2);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header with Decorative Airplane & World Map Watermark */}
      <div className="relative bg-gradient-to-r from-amber-50/70 via-white to-amber-100/30 rounded-3xl p-6 sm:p-8 border border-amber-200/50 shadow-sm overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 hidden md:block">
          <div className="relative">
            <Plane className="w-48 h-48 text-ups-brown -rotate-12" />
          </div>
        </div>

        <div className="flex items-start gap-5 relative z-10">
          {/* Header Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#FEF6E9] border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm flex-shrink-0">
            <FileSpreadsheet className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              New Shipment Check
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base max-w-2xl leading-relaxed">
              Upload your commercial invoice and provide shipment details to validate your documents before submission.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Commercial Invoice (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/90 shadow-card flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>A. Upload Commercial Invoice</span>
            </h2>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-ups-gold bg-amber-50/60 scale-[0.99]'
                  : 'border-gray-300 hover:border-ups-gold/70 hover:bg-gray-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />

              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-gray-800 mb-3 shadow-inner">
                <Upload className="w-7 h-7 stroke-[1.8]" />
              </div>

              <p className="text-sm font-semibold text-gray-800">
                Drag & drop PDF / JPG / PNG here
              </p>
              <p className="text-xs text-gray-400 my-1.5 font-medium">or</p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-1 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold text-xs shadow-sm transition-transform active:scale-95"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Browse Files</span>
              </button>

              <p className="text-[11px] text-gray-400 mt-3 font-medium">
                Supported formats: PDF, JPG, PNG (PaddleOCR ready)
              </p>
            </div>

            {/* Uploaded Documents List */}
            <div className="mt-6">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                Uploaded Documents
              </h3>

              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 font-semibold text-gray-500 border-b border-gray-200">
                  <div className="col-span-6">File Name</div>
                  <div className="col-span-4">Status</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-100">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="grid grid-cols-12 px-3 py-2.5 items-center hover:bg-amber-50/30 transition-colors"
                    >
                      {/* Name & Icon */}
                      <div className="col-span-6 flex items-center gap-2 font-medium text-gray-800 truncate pr-2">
                        {doc.fileType === 'pdf' ? (
                          <div className="w-5 h-5 rounded bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="truncate" title={doc.fileName}>
                          {doc.fileName}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-4">
                        {doc.status === 'extracted' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Extracted
                          </span>
                        ) : doc.status === 'processing' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700">
                            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                            Processing... {doc.progress || 60}%
                          </span>
                        ) : (
                          <span className="text-gray-400">Queued</span>
                        )}
                      </div>

                      {/* Action */}
                      <div className="col-span-2 text-right">
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Data Preview Card (from Invoice) */}
          <div className="mt-6 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 tracking-tight">
                Extracted Data Preview
              </h4>
              <p className="text-xs text-gray-700 mt-0.5 font-medium leading-relaxed">
                Invoice #INV-0412 | Seller: ABC Exports | Buyer: Global Traders | Total: $4,800
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Shipment Details Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-card">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-md bg-amber-100 text-ups-brown flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-gray-900">B. Shipment Details</h2>
          </div>

          <div className="space-y-4 text-sm">
            {/* Product Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={shipmentDetails.productDescription}
                onChange={(e) => updateShipmentDetails({ productDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-sm transition-all"
                placeholder="e.g. Leather Handbags"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={shipmentDetails.quantity}
                onChange={(e) => updateShipmentDetails({ quantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-sm transition-all"
                placeholder="100"
              />
            </div>

            {/* Total Weight */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Total Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={shipmentDetails.totalWeight}
                onChange={(e) => updateShipmentDetails({ totalWeight: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-sm transition-all"
                placeholder="118"
              />
            </div>

            {/* Dimensions (3 columns inline) */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Length (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={shipmentDetails.length}
                  onChange={(e) => updateShipmentDetails({ length: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-sm transition-all"
                  placeholder="40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Width (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={shipmentDetails.width}
                  onChange={(e) => updateShipmentDetails({ width: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-sm transition-all"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Height (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={shipmentDetails.height}
                  onChange={(e) => updateShipmentDetails({ height: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-sm transition-all"
                  placeholder="20"
                />
              </div>
            </div>

            {/* Declared Value & Currency (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Declared Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={shipmentDetails.declaredValue}
                  onChange={(e) => updateShipmentDetails({ declaredValue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-sm transition-all"
                  placeholder="4800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  value={shipmentDetails.currency}
                  onChange={(e) => updateShipmentDetails({ currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-sm transition-all bg-white"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
            </div>

            {/* Origin Country & Destination Country (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Origin Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={shipmentDetails.originCountry}
                  onChange={(e) => updateShipmentDetails({ originCountry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-sm transition-all bg-white"
                >
                  <option value="India">India</option>
                  <option value="China">China</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Destination Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={shipmentDetails.destinationCountry}
                  onChange={(e) => updateShipmentDetails({ destinationCountry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-sm transition-all bg-white"
                >
                  <option value="USA">USA</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        {draftSavedToast && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
            ✓ Draft saved successfully
          </span>
        )}

        <button
          type="button"
          onClick={handleSaveDraft}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-sm transition-colors"
        >
          <Save className="w-4 h-4 text-gray-500" />
          <span>Save Draft</span>
        </button>

        <button
          type="button"
          onClick={handleRunAiValidation}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-extrabold text-sm shadow-md transition-all active:scale-95"
        >
          <span>Run AI Validation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

