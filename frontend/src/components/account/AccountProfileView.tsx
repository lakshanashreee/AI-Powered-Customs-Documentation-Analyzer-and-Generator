import React, { useState } from 'react';
import {
  User,
  Building2,
  Sliders,
  Bell,
  Shield,
  Pencil,
  Info,
  ChevronRight,
  Key
} from 'lucide-react';

export const AccountProfileView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'personal' | 'company' | 'validation' | 'notifications' | 'security'
  >('personal');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Personal Info Form State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Priya Sharma',
    email: 'priya.sharma@meridiantrade.co.uk',
    phone: '+44 20 7946 0285',
    jobTitle: 'Logistics Manager',
    language: 'English (United Kingdom)',
    timeZone: '(GMT+00:00) London'
  });

  // Company Details Form State
  const [companyDetails, setCompanyDetails] = useState({
    companyName: 'Meridian Trade Ltd.',
    upsAccountNumber: 'M8R421',
    companyAddress: '18 Harbour Way, London E14 2AB',
    country: 'United Kingdom',
    eoriNumber: 'GB123456789000',
    ein: 'Not applicable',
    gstNumber: 'Not applicable',
    defaultShipperName: 'Meridian Trade Ltd.',
    defaultShipperContact: 'Priya Sharma · +44 20 7946 0285',
    defaultCurrency: 'GBP — British Pound',
    defaultIncoterms: 'DAP — Delivered at Place',
    defaultOriginCountry: 'United Kingdom'
  });

  // Validation Preferences State (Image 6)
  const [validationPreferences, setValidationPreferences] = useState({
    strictness: 'Standard' as 'Basic' | 'Standard' | 'Strict',
    autoValidateOnUpload: true,
    highlightMissingFields: true,
    flagValueCurrencyMismatches: true,
    checkHsCodeOriginConsistency: true,
    showAiExplanations: true,
    defaultReportFormat: 'PDF' as 'PDF' | 'Excel'
  });

  const showSaveSuccess = (sectionName: string) => {
    setToastMessage(`✓ ${sectionName} changes saved successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 font-medium">Account</div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Manage your profile, shipper details and AI customs documentation preferences.
        </p>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 animate-in fade-in flex items-center justify-between shadow-sm">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top User Profile Banner Card (matches Images 5 & 6) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar with edit pencil badge */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-amber-100 border-2 border-ups-gold flex items-center justify-center text-ups-brown font-extrabold text-xl shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                alt="Priya Sharma"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image doesn't load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute">PS</span>
            </div>
            <button
              onClick={() => alert('Change avatar photo')}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black shadow-xs transition-colors"
              title="Edit photo"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-950">{personalInfo.fullName}</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Verified
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              {personalInfo.jobTitle} · {companyDetails.companyName}
            </p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{personalInfo.email}</p>
          </div>
        </div>

        {/* 3 Metrics on Right */}
        <div className="flex items-center gap-6 sm:gap-10 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-10">
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-950 block">248</span>
            <span className="text-[11px] text-gray-500 font-medium">Invoices checked</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-950 block">86</span>
            <span className="text-[11px] text-gray-500 font-medium">Errors fixed</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-950 block">128</span>
            <span className="text-[11px] text-gray-500 font-medium">Reports submitted</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Nav (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden text-xs">
            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full flex items-center justify-between px-4 py-3.5 font-semibold transition-colors ${
                activeTab === 'personal'
                  ? 'bg-amber-50 text-ups-brown border-l-4 border-ups-gold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-gray-500" />
                <span>Personal Info</span>
              </div>
              {activeTab === 'personal' && <ChevronRight className="w-4 h-4 text-ups-brown" />}
            </button>

            <button
              onClick={() => setActiveTab('company')}
              className={`w-full flex items-center justify-between px-4 py-3.5 font-semibold transition-colors border-t border-gray-100 ${
                activeTab === 'company'
                  ? 'bg-amber-50 text-ups-brown border-l-4 border-ups-gold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span>Company & Shipper Details</span>
              </div>
              {activeTab === 'company' && <ChevronRight className="w-4 h-4 text-ups-brown" />}
            </button>

            <button
              onClick={() => setActiveTab('validation')}
              className={`w-full flex items-center justify-between px-4 py-3.5 font-semibold transition-colors border-t border-gray-100 ${
                activeTab === 'validation'
                  ? 'bg-amber-50 text-ups-brown border-l-4 border-ups-gold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-gray-500" />
                <span>Validation Preferences</span>
              </div>
              {activeTab === 'validation' && <ChevronRight className="w-4 h-4 text-ups-brown" />}
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-4 py-3.5 font-semibold transition-colors border-t border-gray-100 ${
                activeTab === 'notifications'
                  ? 'bg-amber-50 text-ups-brown border-l-4 border-ups-gold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-gray-500" />
                <span>Notifications</span>
              </div>
              {activeTab === 'notifications' && <ChevronRight className="w-4 h-4 text-ups-brown" />}
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between px-4 py-3.5 font-semibold transition-colors border-t border-gray-100 ${
                activeTab === 'security'
                  ? 'bg-amber-50 text-ups-brown border-l-4 border-ups-gold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-gray-500" />
                <span>Security</span>
              </div>
              {activeTab === 'security' && <ChevronRight className="w-4 h-4 text-ups-brown" />}
            </button>
          </div>

          {/* Helper Callout Box */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-1">
            <span className="font-bold text-gray-900 block">Your account, ready to ship</span>
            <p className="text-[11px] leading-relaxed text-gray-500">
              Keep your details up to date for faster invoice checks and consistent customs documents.
            </p>
          </div>
        </div>

        {/* Right Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: PERSONAL INFO (Image 5) */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-card space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Personal Info</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update your contact details and regional preferences.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Full name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Full name</label>
                    <input
                      type="text"
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email address</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                    />
                  </div>
                </div>

                {/* Phone & Job title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Phone number</label>
                    <input
                      type="text"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Job title / role</label>
                    <select
                      value={personalInfo.jobTitle}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, jobTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none bg-white"
                    >
                      <option value="Logistics Manager">Logistics Manager</option>
                      <option value="Customs Broker">Customs Broker</option>
                      <option value="Supply Chain Director">Supply Chain Director</option>
                      <option value="Compliance Officer">Compliance Officer</option>
                    </select>
                  </div>
                </div>

                {/* Language & Timezone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Preferred language</label>
                    <select
                      value={personalInfo.language}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, language: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none bg-white"
                    >
                      <option value="English (United Kingdom)">English (United Kingdom)</option>
                      <option value="English (United States)">English (United States)</option>
                      <option value="French (Français)">French (Français)</option>
                      <option value="German (Deutsch)">German (Deutsch)</option>
                      <option value="Spanish (Español)">Spanish (Español)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Time zone</label>
                    <select
                      value={personalInfo.timeZone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, timeZone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none bg-white"
                    >
                      <option value="(GMT+00:00) London">(GMT+00:00) London</option>
                      <option value="(GMT-05:00) Eastern Time (US & Canada)">
                        (GMT-05:00) Eastern Time (US & Canada)
                      </option>
                      <option value="(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi">
                        (GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi
                      </option>
                      <option value="(GMT+01:00) Paris, Berlin, Rome">(GMT+01:00) Paris, Berlin, Rome</option>
                    </select>
                  </div>
                </div>

                {/* Notice Box */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800 block">
                      Keep your contact details current
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Validation alerts and report updates are sent to this email address. Your language and time zone apply to reports and account notifications.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => alert('Changes discarded')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => showSaveSuccess('Personal Info')}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-ups-gold hover:bg-ups-gold-hover text-ups-brown shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY & SHIPPER DETAILS (Image 5 bottom) */}
          {(activeTab === 'company' || activeTab === 'personal') && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-card space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Company & Shipper Details
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Used to auto-fill invoices and check for mismatches with your shipment details.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Company Name & UPS Account # */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Company name</label>
                    <input
                      type="text"
                      value={companyDetails.companyName}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, companyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">UPS account number</label>
                    <input
                      type="text"
                      value={companyDetails.upsAccountNumber}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, upsAccountNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                    />
                  </div>
                </div>

                {/* Company address & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Company address</label>
                    <input
                      type="text"
                      value={companyDetails.companyAddress}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, companyAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Country</label>
                    <select
                      value={companyDetails.country}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none bg-white"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>

                {/* EORI, EIN, GST (3 cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">EORI number</label>
                    <input
                      type="text"
                      value={companyDetails.eoriNumber}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, eoriNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">EIN</label>
                    <input
                      type="text"
                      value={companyDetails.ein}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, ein: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">IEC / GST number</label>
                    <input
                      type="text"
                      value={companyDetails.gstNumber}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, gstNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                    />
                  </div>
                </div>

                {/* Default shipper name & contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Default shipper / exporter name
                    </label>
                    <input
                      type="text"
                      value={companyDetails.defaultShipperName}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, defaultShipperName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Default shipper contact
                    </label>
                    <input
                      type="text"
                      value={companyDetails.defaultShipperContact}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, defaultShipperContact: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                    />
                  </div>
                </div>

                {/* Default currency, Incoterms, Country of origin (3 cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Default currency</label>
                    <select
                      value={companyDetails.defaultCurrency}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, defaultCurrency: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none bg-white"
                    >
                      <option value="GBP — British Pound">GBP — British Pound</option>
                      <option value="USD — US Dollar">USD — US Dollar</option>
                      <option value="EUR — Euro">EUR — Euro</option>
                      <option value="CAD — Canadian Dollar">CAD — Canadian Dollar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Default Incoterms</label>
                    <select
                      value={companyDetails.defaultIncoterms}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, defaultIncoterms: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none bg-white"
                    >
                      <option value="DAP — Delivered at Place">DAP — Delivered at Place</option>
                      <option value="DDP — Delivered Duty Paid">DDP — Delivered Duty Paid</option>
                      <option value="FOB — Free on Board">FOB — Free on Board</option>
                      <option value="CIF — Cost, Insurance and Freight">CIF — Cost, Insurance and Freight</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Default country of origin
                    </label>
                    <select
                      value={companyDetails.defaultOriginCountry}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, defaultOriginCountry: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none bg-white"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Germany">Germany</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400">
                  Defaults apply to new invoices. Review the country of origin and customs IDs for each shipment before submitting.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => alert('Changes discarded')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => showSaveSuccess('Company Details')}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-ups-gold hover:bg-ups-gold-hover text-ups-brown shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: VALIDATION PREFERENCES (Image 6) */}
          {activeTab === 'validation' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-card space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Validation Preferences
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose how the AI checker reviews your customs documents.
                </p>
              </div>

              <div className="divide-y divide-gray-100 text-xs">
                {/* 1. Validation strictness */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">Validation strictness</span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      Standard checks required fields, values and consistency.
                    </span>
                  </div>

                  {/* Segmented Control */}
                  <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold self-start sm:self-auto">
                    {(['Basic', 'Standard', 'Strict'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          setValidationPreferences({ ...validationPreferences, strictness: mode })
                        }
                        className={`px-4 py-1.5 rounded-lg transition-all ${
                          validationPreferences.strictness === mode
                            ? 'bg-amber-100/80 text-ups-brown border border-amber-300 font-bold shadow-xs'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Auto-validate on invoice upload */}
                <div className="py-4 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="font-bold text-gray-900 block text-xs">
                      Auto-validate on invoice upload
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      Start AI validation as soon as an invoice is uploaded.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setValidationPreferences({
                        ...validationPreferences,
                        autoValidateOnUpload: !validationPreferences.autoValidateOnUpload
                      })
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                      validationPreferences.autoValidateOnUpload ? 'bg-ups-gold' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                        validationPreferences.autoValidateOnUpload ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Highlight missing fields */}
                <div className="py-4 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="font-bold text-gray-900 block text-xs">
                      Highlight missing fields
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      Mark required details that are missing from your documents.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setValidationPreferences({
                        ...validationPreferences,
                        highlightMissingFields: !validationPreferences.highlightMissingFields
                      })
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                      validationPreferences.highlightMissingFields ? 'bg-ups-gold' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                        validationPreferences.highlightMissingFields ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 4. Flag value and currency mismatches */}
                <div className="py-4 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="font-bold text-gray-900 block text-xs">
                      Flag value and currency mismatches
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      Compare invoice totals and currencies with shipment details.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setValidationPreferences({
                        ...validationPreferences,
                        flagValueCurrencyMismatches: !validationPreferences.flagValueCurrencyMismatches
                      })
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                      validationPreferences.flagValueCurrencyMismatches ? 'bg-ups-gold' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                        validationPreferences.flagValueCurrencyMismatches ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 5. Check HS code and country-of-origin consistency */}
                <div className="py-4 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="font-bold text-gray-900 block text-xs">
                      Check HS code and country-of-origin consistency
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      Identify inconsistencies across product and origin information.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setValidationPreferences({
                        ...validationPreferences,
                        checkHsCodeOriginConsistency: !validationPreferences.checkHsCodeOriginConsistency
                      })
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                      validationPreferences.checkHsCodeOriginConsistency ? 'bg-ups-gold' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                        validationPreferences.checkHsCodeOriginConsistency ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 6. Show AI explanations for errors */}
                <div className="py-4 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="font-bold text-gray-900 block text-xs">
                      Show AI explanations for errors
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      Include the reason for each issue and suggested next steps.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setValidationPreferences({
                        ...validationPreferences,
                        showAiExplanations: !validationPreferences.showAiExplanations
                      })
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                      validationPreferences.showAiExplanations ? 'bg-ups-gold' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                        validationPreferences.showAiExplanations ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 7. Default report format */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">
                      Default report format
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      Choose the format used for report downloads.
                    </span>
                  </div>

                  <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold self-start sm:self-auto">
                    {(['PDF', 'Excel'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() =>
                          setValidationPreferences({
                            ...validationPreferences,
                            defaultReportFormat: fmt
                          })
                        }
                        className={`px-5 py-1.5 rounded-lg transition-all ${
                          validationPreferences.defaultReportFormat === fmt
                            ? 'bg-amber-100/90 text-ups-brown border border-amber-300 font-bold shadow-xs'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => alert('Changes discarded')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => showSaveSuccess('Validation Preferences')}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-ups-gold hover:bg-ups-gold-hover text-ups-brown shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-card space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Notifications</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure alerts for customs discrepancies and document status updates.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                  <div>
                    <span className="font-bold text-gray-900 block">Critical Discrepancy Alerts</span>
                    <span className="text-[11px] text-gray-500">
                      Notify immediately via email when an invoice has blocking compliance issues.
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-ups-gold" />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                  <div>
                    <span className="font-bold text-gray-900 block">Weekly Customs Clearance Digest</span>
                    <span className="text-[11px] text-gray-500">
                      Receive weekly summaries of cleared shipments and error reduction rates.
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-ups-gold" />
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => showSaveSuccess('Notifications')}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-ups-gold hover:bg-ups-gold-hover text-ups-brown shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & AI API KEYS */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-card space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Security & AI Endpoints</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage broker credentials and AI engine connection keys.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <Key className="w-4 h-4 text-ups-gold-dark" />
                    <span>PaddleOCR & Qwen Model Connection</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Active backend bridge endpoint: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-300">http://localhost:5000/api</code>
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Broker Electronic Signature PIN
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => showSaveSuccess('Security')}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-ups-gold hover:bg-ups-gold-hover text-ups-brown shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 border-t border-gray-200 gap-2">
        <span>Readiness is an AI review indicator, not a guarantee of customs clearance or regulatory compliance.</span>
        <span>UPS CrossBorder Ready</span>
      </div>
    </div>
  );
};
