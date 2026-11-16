import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Sliders, 
  Bell, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  FileCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { userProfile } from '../data/mockData';

export function AccountProfile() {
  const [activeSubTab, setActiveSubTab] = useState('personal'); // 'personal', 'company', 'validation', 'notifications', 'security'
  const [profile, setProfile] = useState(userProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key],
      },
    }));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 pt-2 px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="text-xs text-gray-500 font-medium mb-1">Account</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Manage your profile, shipper details and AI customs documentation preferences.
        </p>
      </div>

      {/* Profile Summary Hero Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#351C15] to-[#593427] text-[#FFB500] font-black text-xl flex items-center justify-center shadow-md">
              PS
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#1E293B]">{profile.name}</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ● Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{profile.title}</p>
            <p className="text-xs font-mono text-gray-400 mt-0.5">{profile.email}</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="flex items-center gap-6 sm:gap-10 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
          <div>
            <span className="block text-2xl font-black text-[#1E293B]">
              {profile.stats.invoicesChecked}
            </span>
            <span className="block text-xs text-gray-400 font-medium">Invoices checked</span>
          </div>

          <div>
            <span className="block text-2xl font-black text-amber-600">
              {profile.stats.errorsFixed}
            </span>
            <span className="block text-xs text-gray-400 font-medium">Errors fixed</span>
          </div>

          <div>
            <span className="block text-2xl font-black text-emerald-600">
              {profile.stats.reportsSubmitted}
            </span>
            <span className="block text-xs text-gray-400 font-medium">Reports submitted</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Menu + Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-2.5 shadow-xs space-y-1">
            <button
              onClick={() => setActiveSubTab('personal')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'personal' || activeSubTab === 'company'
                  ? 'bg-amber-50 text-[#351C15] border border-amber-200/80'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <span>Personal Info</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setActiveSubTab('company')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'company'
                  ? 'bg-amber-50 text-[#351C15] border border-amber-200/80'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span>Company & Shipper Details</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setActiveSubTab('validation')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'validation'
                  ? 'bg-amber-50 text-[#351C15] border border-amber-200/80'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-gray-500" />
                <span>Validation Preferences</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => alert("Notification settings configured for email & SMS.")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-gray-400" />
                <span>Notifications</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>

            <button
              onClick={() => alert("Security settings: 2-Factor Authentication active.")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-gray-400" />
                <span>Security</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          {/* Side Info Callout */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-xs">
            <p className="font-bold text-[#351C15]">Your account, ready to ship</p>
            <p className="text-gray-600 mt-1 leading-relaxed text-[11px]">
              Keep your details up to date for faster invoice checks and consistent customs documents.
            </p>
          </div>
        </div>

        {/* Right Content Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Changes saved successfully to your profile!</span>
            </div>
          )}

          {/* SUB-VIEW 1: PERSONAL INFO & SHIPPER DETAILS (Image 9) */}
          {(activeSubTab === 'personal' || activeSubTab === 'company') && (
            <div className="space-y-6">
              {/* Personal Info Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-[#1E293B]">Personal Info</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your contact details and regional preferences.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone number
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Job title / role
                    </label>
                    <select className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] bg-white">
                      <option>Logistics Manager</option>
                      <option>Customs Broker</option>
                      <option>Export Coordinator</option>
                      <option>Supply Chain Director</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Preferred language
                    </label>
                    <select className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] bg-white">
                      <option>English (United Kingdom)</option>
                      <option>English (United States)</option>
                      <option>French (Français)</option>
                      <option>German (Deutsch)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Time zone
                    </label>
                    <select className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] bg-white">
                      <option>(GMT+00:00) London</option>
                      <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                      <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-gray-600">
                  <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Keep your contact details current</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Validation alerts and report updates are sent to this email address. Your language and time zone apply to reports and account notifications.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-[#FFB500] hover:bg-[#EAA600] text-[#351C15] text-xs font-bold rounded-lg shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Company & Shipper Details Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-[#1E293B]">Company & Shipper Details</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Used to auto-fill invoices and check for mismatches with your shipment details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Company name
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.company.name}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      UPS account number
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.company.upsAccountNumber}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Company address
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.company.address}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Country
                    </label>
                    <select className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] bg-white">
                      <option>United Kingdom</option>
                      <option>United States</option>
                      <option>India</option>
                      <option>Canada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      EORI number
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.company.eoriNumber}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      EIN
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.company.ein}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      IEC / GST number
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.company.iecGst}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Default currency
                    </label>
                    <select className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] bg-white">
                      <option>GBP — British Pound</option>
                      <option>USD — US Dollar</option>
                      <option>EUR — Euro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Default incoterms
                    </label>
                    <select className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB500] bg-white">
                      <option>DAP — Delivered at Place</option>
                      <option>FOB — Free on Board</option>
                      <option>CIF — Cost, Insurance & Freight</option>
                      <option>DDP — Delivered Duty Paid</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400">
                  Defaults apply to new invoices. Review the country of origin and customs IDs for each shipment before submitting.
                </p>

                <div className="pt-2 flex justify-end gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-[#FFB500] hover:bg-[#EAA600] text-[#351C15] text-xs font-bold rounded-lg shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: VALIDATION PREFERENCES (Image 10) */}
          {activeSubTab === 'validation' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#1E293B]">Validation Preferences</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose how the AI checker reviews your customs documents.
                </p>
              </div>

              {/* Strictness */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-100 pb-5">
                <div>
                  <p className="text-xs font-bold text-gray-900">Validation strictness</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Standard checks required fields, values and consistency.
                  </p>
                </div>
                <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setProfile({ ...profile, preferences: { ...profile.preferences, strictness: 'Basic' } })}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      profile.preferences.strictness === 'Basic'
                        ? 'bg-white shadow-xs text-gray-900 font-bold'
                        : 'text-gray-500'
                    }`}
                  >
                    Basic
                  </button>
                  <button
                    onClick={() => setProfile({ ...profile, preferences: { ...profile.preferences, strictness: 'Standard' } })}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      profile.preferences.strictness === 'Standard'
                        ? 'bg-[#FFB500] text-[#351C15] font-bold shadow-xs'
                        : 'text-gray-500'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setProfile({ ...profile, preferences: { ...profile.preferences, strictness: 'Strict' } })}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      profile.preferences.strictness === 'Strict'
                        ? 'bg-white shadow-xs text-gray-900 font-bold'
                        : 'text-gray-500'
                    }`}
                  >
                    Strict
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 divide-y divide-gray-100">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Auto-validate on invoice upload</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Start AI validation as soon as an invoice is uploaded.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('autoValidateOnUpload')}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      profile.preferences.autoValidateOnUpload ? 'bg-[#FFB500]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        profile.preferences.autoValidateOnUpload ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Highlight missing fields</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Mark required details that are missing from your documents.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('highlightMissingFields')}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      profile.preferences.highlightMissingFields ? 'bg-[#FFB500]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        profile.preferences.highlightMissingFields ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Flag value and currency mismatches</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Compare invoice totals and currencies with shipment details.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('flagValueAndCurrencyMismatches')}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      profile.preferences.flagValueAndCurrencyMismatches ? 'bg-[#FFB500]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        profile.preferences.flagValueAndCurrencyMismatches ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Check HS code and country-of-origin consistency</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Identify inconsistencies across product and origin information.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('checkHsCodeAndOrigin')}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      profile.preferences.checkHsCodeAndOrigin ? 'bg-[#FFB500]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        profile.preferences.checkHsCodeAndOrigin ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Show AI explanations for errors</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Include the reason for each issue and suggested next steps.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('showAiExplanations')}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      profile.preferences.showAiExplanations ? 'bg-[#FFB500]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        profile.preferences.showAiExplanations ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Default Report Format */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-t border-gray-100 pt-5">
                <div>
                  <p className="text-xs font-bold text-gray-900">Default report format</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Choose the format used for report downloads.
                  </p>
                </div>
                <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setProfile({ ...profile, preferences: { ...profile.preferences, defaultReportFormat: 'PDF' } })}
                    className={`px-4 py-1.5 rounded-md transition-all ${
                      profile.preferences.defaultReportFormat === 'PDF'
                        ? 'bg-[#FFB500] text-[#351C15] font-bold shadow-xs'
                        : 'text-gray-500'
                    }`}
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => setProfile({ ...profile, preferences: { ...profile.preferences, defaultReportFormat: 'Excel' } })}
                    className={`px-4 py-1.5 rounded-md transition-all ${
                      profile.preferences.defaultReportFormat === 'Excel'
                        ? 'bg-[#FFB500] text-[#351C15] font-bold shadow-xs'
                        : 'text-gray-500'
                    }`}
                  >
                    Excel
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-lg text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-[#FFB500] hover:bg-[#EAA600] text-[#351C15] text-xs font-bold rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
