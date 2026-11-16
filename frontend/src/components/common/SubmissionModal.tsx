import React from 'react';
import { CheckCircle2, ShieldCheck, Download, ExternalLink, ArrowRight, X } from 'lucide-react';
import { useShipment } from '../../context/ShipmentContext';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose }) => {
  const { submissionRef, shipmentDetails, resetDemo } = useShipment();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-gray-200 overflow-hidden text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top banner / icon */}
        <div className="bg-gradient-to-b from-amber-50 to-white pt-8 pb-4 px-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Submitted for Customs Clearance
          </h2>
          <p className="text-sm text-gray-600 mt-1 max-w-md">
            Shipment #{shipmentDetails.shipmentNumber} documentation packet has been successfully validated and submitted to UPS Customs Brokerage.
          </p>
        </div>

        {/* Details Card */}
        <div className="px-6 py-4">
          <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs text-gray-600">
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="font-semibold text-gray-500">Submission Reference:</span>
              <span className="font-mono font-bold text-gray-900 text-sm bg-white px-2 py-0.5 rounded border border-gray-300">
                {submissionRef || 'UPS-CB-2026-0412-X99'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="font-semibold text-gray-500">Customs Clearance Route:</span>
              <span className="font-medium text-gray-800">
                {shipmentDetails.originCountry} → {shipmentDetails.destinationCountry}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="font-semibold text-gray-500">Readiness Score:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                94 / 100 (Cleared for Filing)
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-semibold text-gray-500">Audit Status:</span>
              <span className="inline-flex items-center gap-1 font-medium text-gray-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 4 Discrepancies Resolved · 1 Documented Exception
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-8 space-y-3">
          <div className="flex gap-3">
            <button
              onClick={() => {
                alert('Downloading official Customs Submission Packet (PDF)...');
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 text-gray-500" />
              Download Packet
            </button>
            <button
              onClick={() => {
                alert('Opening UPS Brokerage Electronic Entry Portal...');
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
              Track in Brokerage
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              resetDemo();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold text-sm shadow-md transition-all"
          >
            <span>Start Another Shipment Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

