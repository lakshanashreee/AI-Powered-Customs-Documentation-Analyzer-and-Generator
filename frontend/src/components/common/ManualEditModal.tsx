import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { ValidationIssue } from '../../types';

interface ManualEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: ValidationIssue | undefined;
  onSave: (issueId: string, newValue: string) => void;
}

export const ManualEditModal: React.FC<ManualEditModalProps> = ({
  isOpen,
  onClose,
  issue,
  onSave
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (issue) {
      setValue(issue.enteredValue !== '—' ? issue.enteredValue : '');
    }
  }, [issue]);

  if (!isOpen || !issue) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSave(issue.id, value.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-ups-brown text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-ups-gold" />
            <h3 className="font-bold text-lg">Manual Field Correction</h3>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Field to Update
            </span>
            <p className="text-base font-bold text-gray-900 mt-0.5">{issue.displayName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-sm">
            <div>
              <span className="text-xs text-gray-500 block">Commercial Invoice</span>
              <span className="font-semibold text-gray-800">{issue.invoiceValue}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Entered in System</span>
              <span className="font-semibold text-gray-800">{issue.enteredValue}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Corrected Value <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter verified ${issue.displayName.toLowerCase()}...`}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/30 outline-none text-sm transition-all"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-ups-gold-dark" />
              This value will be updated in shipment records and customs manifest.
            </p>
          </div>

          {issue.suggestedCorrection && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex flex-col gap-1">
              <span className="font-bold text-[11px] text-amber-800 uppercase tracking-wider">
                AI Suggestion
              </span>
              <div className="flex items-center justify-between">
                <span>{issue.suggestedCorrection}</span>
                <button
                  type="button"
                  onClick={() => {
                    const match = issue.suggestedCorrection.match(/[\d.,$]+|\b\d{4}\.\d{2}\b/);
                    if (match) setValue(match[0]);
                    else setValue(issue.suggestedCorrection);
                  }}
                  className="text-xs font-bold text-ups-brown underline hover:text-black ml-2"
                >
                  Use suggestion
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-bold bg-ups-gold hover:bg-ups-gold-hover text-ups-brown shadow-sm transition-colors"
            >
              Apply Correction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

