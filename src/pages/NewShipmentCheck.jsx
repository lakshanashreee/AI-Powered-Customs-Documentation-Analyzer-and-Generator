import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  Lightbulb, 
  Save, 
  ArrowRight,
  Plane,
  AlertCircle
} from 'lucide-react';
import { initialShipmentForm, initialUploadedFiles } from '../data/mockData';

export function NewShipmentCheck({ onStartValidation }) {
  const [formData, setFormData] = useState(initialShipmentForm);
  const [uploadedFiles, setUploadedFiles] = useState(initialUploadedFiles);
  const [draftSaved, setDraftSaved] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const newFile = {
      id: `f-${Date.now()}`,
      name: "commercial_invoice_v2.pdf",
      size: "1.2 MB",
      status: "Extracted",
      progress: 100,
      type: "commercial_invoice",
    };
    setUploadedFiles((prev) => [...prev, newFile]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 pt-2 px-4 sm:px-6">
      {/* Hero Card Banner with subtle plane artwork */}
      <div className="bg-gradient-to-r from-[#FBF6F1] via-[#FFFDF8] to-[#FBF4EC] border border-[#F0E5D8] rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-xs">
        {/* Airplane graphic silhouette */}
        <div className="absolute right-4 top-2 text-[#E8DCCE] opacity-35 pointer-events-none select-none hidden md:block">
          <Plane className="w-48 h-48 -rotate-12 translate-x-8 -translate-y-6 stroke-[1]" />
        </div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-6 h-6 text-[#9A6408]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
              New Shipment Check
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-2xl">
              Upload your commercial invoice and provide shipment details to validate your documents before customs submission.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Column A (Upload) and Column B (Shipment Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column A: Upload Commercial Invoice (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#351C15] text-[#FFB500] text-xs font-bold flex items-center justify-center">
                A
              </span>
              Upload Commercial Invoice
            </h2>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/30 hover:bg-amber-50/60 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6 text-[#351C15]" />
            </div>
            <p className="text-sm font-semibold text-gray-800">
              Drag & drop PDF / JPG / PNG here
            </p>
            <span className="text-xs text-gray-400 my-1 font-medium">or</span>
            <label className="mt-1 cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 bg-[#FFB500] hover:bg-[#EAA600] active:scale-95 text-[#351C15] font-bold text-xs rounded-lg transition-all shadow-xs">
                Browse Files
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.tiff"
                onChange={() => {
                  const newFile = {
                    id: `f-${Date.now()}`,
                    name: "sample_invoice.pdf",
                    size: "950 KB",
                    status: "Extracted",
                    progress: 100,
                    type: "commercial_invoice",
                  };
                  setUploadedFiles((prev) => [...prev, newFile]);
                }}
              />
            </label>
            <p className="text-[11px] text-gray-400 mt-3">
              Supported formats: PDF, JPG, PNG
            </p>
          </div>

          {/* Uploaded Documents List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Uploaded Documents
            </h3>
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
              <div className="grid grid-cols-12 bg-gray-50/80 px-3 py-2 text-[11px] font-semibold text-gray-500">
                <div className="col-span-6">File Name</div>
                <div className="col-span-4">Status</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-12 px-3 py-3 items-center text-xs hover:bg-gray-50/50 transition-colors"
                >
                  <div className="col-span-6 flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-medium text-gray-800 truncate" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                  <div className="col-span-4 flex items-center">
                    {file.status === 'Extracted' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Extracted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                        Processing... {file.progress}%
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-right">
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {uploadedFiles.length === 0 && (
                <div className="p-4 text-center text-xs text-gray-400">
                  No documents uploaded yet.
                </div>
              )}
            </div>
          </div>

          {/* Extracted Data Preview callout */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#351C15]">Extracted Data Preview</p>
              <p className="text-gray-600 font-mono mt-0.5 leading-relaxed text-[11px]">
                Invoice: <span className="font-semibold text-gray-900">INV-0412</span> · Seller: <span className="font-semibold text-gray-900">ABC Exports</span> · Buyer: <span className="font-semibold text-gray-900">Global Trades</span> · Total: <span className="font-semibold text-emerald-700">$4,800</span>
              </p>
            </div>
          </div>
        </div>

        {/* Column B: Shipment Details (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#351C15] text-[#FFB500] text-xs font-bold flex items-center justify-center">
                B
              </span>
              Shipment Details
            </h2>
          </div>

          <div className="space-y-4">
            {/* Product Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productDescription}
                onChange={(e) => handleInputChange('productDescription', e.target.value)}
                placeholder="e.g. Leather Handbags"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent transition-all"
              />
            </div>

            {/* Quantity & Total Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Total Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.totalWeight}
                  onChange={(e) => handleInputChange('totalWeight', Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent"
                />
              </div>
            </div>

            {/* Dimensions (3 columns) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Dimensions (Length × Width × Height) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number"
                    value={formData.length}
                    onChange={(e) => handleInputChange('length', Number(e.target.value))}
                    placeholder="Length (cm)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent text-center"
                  />
                  <span className="block text-[10px] text-gray-400 text-center mt-1">Length (cm)</span>
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => handleInputChange('width', Number(e.target.value))}
                    placeholder="Width (cm)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent text-center"
                  />
                  <span className="block text-[10px] text-gray-400 text-center mt-1">Width (cm)</span>
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', Number(e.target.value))}
                    placeholder="Height (cm)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent text-center"
                  />
                  <span className="block text-[10px] text-gray-400 text-center mt-1">Height (cm)</span>
                </div>
              </div>
            </div>

            {/* Financials: Declared Value & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Declared Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.declaredValue}
                  onChange={(e) => handleInputChange('declaredValue', Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent bg-white"
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="CAD">CAD — Canadian Dollar</option>
                  <option value="INR">INR — Indian Rupee</option>
                </select>
              </div>
            </div>

            {/* Origin & Destination Countries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Origin Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.originCountry}
                  onChange={(e) => handleInputChange('originCountry', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent bg-white"
                >
                  <option value="India">India</option>
                  <option value="China">China</option>
                  <option value="USA">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Vietnam">Vietnam</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Destination Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.destinationCountry}
                  onChange={(e) => handleInputChange('destinationCountry', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent bg-white"
                >
                  <option value="USA">United States (USA)</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4 text-gray-500" />
              {draftSaved ? 'Draft Saved!' : 'Save Draft'}
            </button>

            <button
              type="button"
              onClick={() => onStartValidation(formData)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#FFB500] hover:bg-[#ECA700] active:scale-95 text-[#351C15] font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <span>Run AI Validation</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
