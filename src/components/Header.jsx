import React from 'react';
import { ChevronDown, User, ShieldCheck } from 'lucide-react';

export function Header({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'shipments', label: 'Shipments' },
    { id: 'reports', label: 'Reports' },
    { id: 'help', label: 'Help' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => onTabChange('shipments')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* UPS Shield Emblem */}
            <div className="w-10 h-11 bg-[#351C15] rounded-b-xl flex items-center justify-center shadow-sm relative group-hover:bg-[#27140e] transition-colors border-t-2 border-[#FFB500]">
              <span className="text-[#FFB500] font-black text-xs tracking-tighter uppercase">
                UPS
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#1E293B] tracking-tight group-hover:text-black transition-colors">
                CrossBorder <span className="text-[#351C15]">Ready</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                AI Customs Document Checker
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8 h-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative h-full flex items-center text-sm font-semibold transition-colors px-1 ${
                    isActive
                      ? 'text-[#351C15]'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFB500]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Account Profile Dropdown */}
          <div className="flex items-center">
            <button
              onClick={() => onTabChange('account')}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'account'
                  ? 'bg-amber-50 text-[#351C15] ring-1 ring-[#FFB500]'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-[#351C15] text-[#FFB500] flex items-center justify-center font-bold text-xs shadow-xs">
                PS
              </div>
              <span>Account</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
