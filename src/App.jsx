import React, { useState } from 'react';
import { Header } from './components/Header';
import { Stepper } from './components/Stepper';
import { NewShipmentCheck } from './pages/NewShipmentCheck';
import { ValidationProcessing } from './pages/ValidationProcessing';
import { ValidationResults } from './pages/ValidationResults';
import { CorrectionReport } from './pages/CorrectionReport';
import { ReportsDashboard } from './pages/ReportsDashboard';
import { HelpSupport } from './pages/HelpSupport';
import { AccountProfile } from './pages/AccountProfile';

export default function App() {
  const [activeTab, setActiveTab] = useState('shipments');
  const [shipmentStep, setShipmentStep] = useState(1);

  // Transitions
  const handleStartValidation = (formData) => {
    setShipmentStep(2);
  };

  const handleProcessingComplete = () => {
    setShipmentStep(3);
  };

  const handleProceedToReport = () => {
    setShipmentStep(4);
  };

  const handleBackToDetails = () => {
    setShipmentStep(1);
  };

  const handleBackToValidation = () => {
    setShipmentStep(3);
  };

  const handleSubmitSuccess = () => {
    setActiveTab('reports');
    setShipmentStep(1);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] flex flex-col justify-between selection:bg-[#FFB500] selection:text-[#351C15]">
      <div>
        {/* Global Navigation Header */}
        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab 1: Shipments Verification Flow */}
        {activeTab === 'shipments' && (
          <main className="pt-4">
            {/* 4-Step Wizard Stepper */}
            <Stepper
              currentStep={shipmentStep}
              onStepClick={(stepNum) => setShipmentStep(stepNum)}
            />

            {/* Step 1: Upload & Details */}
            {shipmentStep === 1 && (
              <NewShipmentCheck onStartValidation={handleStartValidation} />
            )}

            {/* Step 2: AI Validation Processing State */}
            {shipmentStep === 2 && (
              <ValidationProcessing onComplete={handleProcessingComplete} />
            )}

            {/* Step 3: Review & Fix (Detailed & Simplified views) */}
            {shipmentStep === 3 && (
              <ValidationResults
                onProceedToReport={handleProceedToReport}
                onBackToDetails={handleBackToDetails}
              />
            )}

            {/* Step 4: Report & Submit */}
            {shipmentStep === 4 && (
              <CorrectionReport
                onBackToValidation={handleBackToValidation}
                onSubmitSuccess={handleSubmitSuccess}
              />
            )}
          </main>
        )}

        {/* Tab 2: Generated Reports & Audit History */}
        {activeTab === 'reports' && (
          <main className="pt-6">
            <ReportsDashboard />
          </main>
        )}

        {/* Tab 3: Help & Support + AI Assistant */}
        {activeTab === 'help' && (
          <main className="pt-6">
            <HelpSupport />
          </main>
        )}

        {/* Tab 4: Account Profile & Preferences */}
        {activeTab === 'account' && (
          <main className="pt-6">
            <AccountProfile />
          </main>
        )}
      </div>

      {/* Global Footer & Regulatory Disclaimer */}
      <footer className="border-t border-gray-200 bg-white/60 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2 text-[11px] text-gray-500">
          <p>
            Readiness is an AI review indicator, not a guarantee of customs clearance or regulatory compliance.
          </p>
          <p className="font-semibold text-gray-700">
            UPS CrossBorder Ready · Prototype
          </p>
        </div>
      </footer>
    </div>
  );
}
