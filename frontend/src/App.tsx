import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Stepper } from './components/common/Stepper';
import { Step1UploadDetails } from './components/step1_upload/Step1UploadDetails';
import { Step2ValidationSummary } from './components/step2_validation_summary/Step2ValidationSummary';
import { Step3ReviewWorkbench } from './components/step3_review_workbench/Step3ReviewWorkbench';
import { Step4ReportSubmit } from './components/step4_report_submit/Step4ReportSubmit';
import { ShipmentsListView } from './components/shipments/ShipmentsListView';
import { GeneratedReportsView } from './components/reports/GeneratedReportsView';
import { HelpSupportView } from './components/help/HelpSupportView';
import { AccountProfileView } from './components/account/AccountProfileView';
import { useShipment } from './context/ShipmentContext';
import { ListOrdered, FileSpreadsheet } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentStep, reviewSubView, activeNavTab } = useShipment();
  const [showShipmentsList, setShowShipmentsList] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-ups-bg-page text-gray-900 font-sans selection:bg-ups-gold selection:text-black">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Render Generated Reports View (Images 1, 2, 3) */}
        {activeNavTab === 'reports' && <GeneratedReportsView />}

        {/* Render Help & Support View with AI Assistant Chatbot (Image 4) */}
        {activeNavTab === 'help' && <HelpSupportView />}

        {/* Render Account Profile & Validation Preferences (Images 5, 6) */}
        {activeNavTab === 'account' && <AccountProfileView />}

        {/* Render Shipments Workflow (Steps 1 to 4) */}
        {activeNavTab === 'shipments' && (
          <>
            {/* Quick sub-navigation bar between Active Check & All Shipments */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-white/80 p-1 rounded-xl border border-gray-200 text-xs shadow-sm">
                <button
                  onClick={() => setShowShipmentsList(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    !showShipmentsList
                      ? 'bg-ups-brown text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Active Check (#0412)</span>
                </button>
                <button
                  onClick={() => setShowShipmentsList(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    showShipmentsList
                      ? 'bg-ups-brown text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>All Shipments Directory</span>
                </button>
              </div>
            </div>

            {showShipmentsList ? (
              <ShipmentsListView />
            ) : (
              <>
                {/* 4-Step Stepper Ribbon */}
                <Stepper />

                {/* Step 1: Upload & Details */}
                {currentStep === 1 && <Step1UploadDetails />}

                {/* Step 2: AI Validation Summary (Screen 2) */}
                {currentStep === 2 && (
                  reviewSubView === 'workbench' ? <Step3ReviewWorkbench /> : <Step2ValidationSummary />
                )}

                {/* Step 3: Review & Fix (Screen 3 or Screen 2 depending on subview) */}
                {currentStep === 3 && (
                  reviewSubView === 'summary' ? <Step2ValidationSummary /> : <Step3ReviewWorkbench />
                )}

                {/* Step 4: Report & Submit (Screen 4) */}
                {currentStep === 4 && <Step4ReportSubmit />}
              </>
            )}
          </>
        )}
      </main>

      {/* Global Application Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ups-brown">UPS CrossBorder Ready</span>
            <span>·</span>
            <span>AI Customs Documentation Analyzer & Generator</span>
          </div>
          <div className="text-[11px] text-gray-400">
            Powered by PaddleOCR Document Extraction & Qwen LLM Compliance Reasoning
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
