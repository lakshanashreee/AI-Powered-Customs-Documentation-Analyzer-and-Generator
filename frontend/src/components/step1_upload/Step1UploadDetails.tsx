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
  ArrowRight,
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
    setStep
  } = useShipment();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addDocument(e.target.files[0]);
    }
  };

  const handleLoadSampleCsv = () => {
    const sampleCsvContent = `InvoiceNumber,InvoiceDate,SellerName,SellerAddress,BuyerName,BuyerAddress,ItemDescription,HsCode,Quantity,UnitPrice,TotalAmount,Currency,GrossWeightKg,NetWeightKg,OriginCountry,DestinationCountry
INV-2026-8841,2026-04-12,Apex Industrial Supplies Ltd.,74 Industrial Zone New Delhi 110020 India,TransGlobal Logistics Inc.,500 Gateway Blvd Dallas TX 75261 USA,Industrial Carbon Steel Ball Bearings,8482.10,500,12.50,6250.00,USD,145.00,132.50,India,USA`;
    const sampleFile = new File([sampleCsvContent], 'commercial_invoice_sample.csv', { type: 'text/csv' });
    addDocument(sampleFile);
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

  const handleRunAiValidation = () => {
    setStep(2);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Simple Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs flex-shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
              New Shipment Check
            </h1>
            <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">
              Upload your commercial invoice and confirm shipment details before submission.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Commercial Invoice (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/90 shadow-card flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>A. Upload Commercial Invoice</span>
            </h2>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-ups-gold bg-amber-50/60 scale-[0.99]'
                  : 'border-gray-300 hover:border-ups-gold/70 hover:bg-gray-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="*/*"
                onChange={handleFileChange}
              />

              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-gray-800 mb-2.5 shadow-inner">
                <Upload className="w-6 h-6 text-gray-700" />
              </div>

              <p className="text-xs font-semibold text-gray-800">
                Drag & drop any invoice (PDF, JPG, PNG, Screenshots, Handwritten, CSV, TXT)
              </p>
              <p className="text-[11px] text-gray-400 my-1 font-medium">or</p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold text-xs shadow-xs transition-transform active:scale-95"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Browse Files</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSampleCsv();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs transition-transform active:scale-95 border border-amber-300/80"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-800" />
                  <span>Load Sample CSV</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-400 mt-2.5">
                Supported formats: All documents, images, spreadsheets & text files
              </p>
            </div>

            {/* Uploaded Documents List */}
            <div className="mt-5">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Uploaded Documents
              </h3>

              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 font-semibold text-gray-500 border-b border-gray-200 text-[11px]">
                  <div className="col-span-6">File Name</div>
                  <div className="col-span-4">Status</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-100">
                  {documents.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-xs">
                      No documents uploaded yet. Upload a CSV, PDF, or image above to auto-extract details.
                    </div>
                  ) : (
                    documents.map((doc) => (
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
                          ) : doc.fileType === 'csv' ? (
                            <div className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                              <FileSpreadsheet className="w-3.5 h-3.5" />
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
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Extracted
                          </span>
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
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Data Preview Card (from Invoice) */}
          <div className="mt-5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 tracking-tight">
                Extracted Data Preview
              </h4>
              <p className="text-gray-700 mt-0.5 font-medium leading-relaxed">
                {documents.length > 0 && shipmentDetails.productDescription
                  ? `Product: ${shipmentDetails.productDescription} · Qty: ${shipmentDetails.quantity} · Total: $${shipmentDetails.declaredValue} ${shipmentDetails.currency} · Weight: ${shipmentDetails.totalWeight} kg`
                  : 'No document extracted yet. Upload your invoice or click "Load Sample CSV" to view live parsed customs fields.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Shipment Details Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-amber-100 text-ups-brown flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-gray-900">B. Shipment Details</h2>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Product Description */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Product Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={shipmentDetails.productDescription}
                onChange={(e) => updateShipmentDetails({ productDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all"
                placeholder="Product description"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={shipmentDetails.quantity}
                onChange={(e) => updateShipmentDetails({ quantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all"
                placeholder="Quantity units"
              />
            </div>

            {/* Total Weight */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Total Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={shipmentDetails.totalWeight}
                onChange={(e) => updateShipmentDetails({ totalWeight: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all"
                placeholder="Weight in kg"
              />
            </div>

            {/* Dimensions (3 columns inline) */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Length (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={shipmentDetails.length}
                  onChange={(e) => updateShipmentDetails({ length: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all"
                  placeholder="Length"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Width (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={shipmentDetails.width}
                  onChange={(e) => updateShipmentDetails({ width: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all"
                  placeholder="Width"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Height (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={shipmentDetails.height}
                  onChange={(e) => updateShipmentDetails({ height: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all"
                  placeholder="Height"
                />
              </div>
            </div>

            {/* Declared Value & Currency (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Declared Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={shipmentDetails.declaredValue}
                  onChange={(e) => updateShipmentDetails({ declaredValue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all"
                  placeholder="Value amount"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  value={shipmentDetails.currency}
                  onChange={(e) => updateShipmentDetails({ currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all bg-white"
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
                <label className="block font-semibold text-gray-700 mb-1">
                  Origin Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={shipmentDetails.originCountry}
                  onChange={(e) => updateShipmentDetails({ originCountry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all bg-white"
                >
                  <option value="">Select Origin Country</option>
                  <option value="India">India</option>
                  <option value="China">China</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Destination Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={shipmentDetails.destinationCountry}
                  onChange={(e) => updateShipmentDetails({ destinationCountry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold outline-none text-xs transition-all bg-white"
                >
                  <option value="">Select Destination Country</option>
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
      <div className="flex items-center justify-end pt-4">
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

