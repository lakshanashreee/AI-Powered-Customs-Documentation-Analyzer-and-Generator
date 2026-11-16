import React from 'react';
import { Header } from './components/common/Header';
import { Stepper } from './components/common/Stepper';
import { Step1UploadDetails } from './components/step1_upload/Step1UploadDetails';
import { Step2ValidationSummary } from './components/step2_validation_summary/Step2ValidationSummary';
import { Step3ReviewWorkbench } from './components/step3_review_workbench/Step3ReviewWorkbench';
import { Step4ReportSubmit } from './components/step4_report_submit/Step4ReportSubmit';
import { GeneratedReportsView } from './components/reports/GeneratedReportsView';
import { HelpSupportView } from './components/help/HelpSupportView';
import { AccountProfileView } from './components/account/AccountProfileView';
import { LoginPage } from './components/auth/LoginPage';
import { useShipment } from './context/ShipmentContext';

export const AppContent: React.FC = () => {
  const { currentStep, activeNavTab, authUser, loginUser } = useShipment();

  // If user is not authenticated, render the Login Page
  if (!authUser) {
    return <LoginPage onLoginSuccess={loginUser} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-ups-bg-page text-gray-900 font-sans selection:bg-ups-gold selection:text-black">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Render Generated Reports View */}
        {activeNavTab === 'reports' && <GeneratedReportsView />}

        {/* Render Help & Support View with AI Assistant Chatbot */}
        {activeNavTab === 'help' && <HelpSupportView />}

        {/* Render Account Profile & Validation Preferences */}
        {activeNavTab === 'account' && <AccountProfileView />}

        {/* Render Shipments Workflow (Steps 1 to 4) */}
        {activeNavTab === 'shipments' && (
          <>
            {/* 4-Step Stepper Ribbon */}
            <Stepper />

            {/* Step 1: Upload & Details */}
            {currentStep === 1 && <Step1UploadDetails />}

            {/* Step 2: AI Validation */}
            {currentStep === 2 && <Step2ValidationSummary />}

            {/* Step 3: Review & Fix */}
            {currentStep === 3 && <Step3ReviewWorkbench />}

            {/* Step 4: Report & Submit */}
            {currentStep === 4 && <Step4ReportSubmit />}
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
            Authenticated as: <span className="font-semibold text-gray-700">{authUser.fullName}</span> ({authUser.role})
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
