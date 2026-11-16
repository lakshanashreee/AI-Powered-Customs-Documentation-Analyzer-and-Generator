import React, { useState } from 'react';
import { Package, BarChart3, HelpCircle, ChevronDown, User, LogOut, Sliders, Building2 } from 'lucide-react';
import { useShipment } from '../../context/ShipmentContext';

export const Header: React.FC = () => {
  const { activeNavTab, setActiveNavTab, setStep } = useShipment();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <header className="bg-ups-brown text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => { setActiveNavTab('shipments'); setStep(1); }}
          >
            {/* UPS Shield Graphic */}
            <div className="w-10 h-10 bg-ups-gold rounded-lg flex items-center justify-center font-extrabold text-ups-brown text-sm tracking-tighter shadow-inner transition-transform group-hover:scale-105">
              <span>ups</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                CrossBorder <span className="text-ups-gold">Ready</span>
              </span>
              <span className="text-[10px] text-amber-200/70 tracking-widest uppercase font-medium">
                AI Customs Clearance Engine
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <button
              onClick={() => setActiveNavTab('shipments')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeNavTab === 'shipments'
                  ? 'bg-ups-gold text-ups-brown shadow-sm'
                  : 'text-amber-100/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Shipments</span>
            </button>

            <button
              onClick={() => setActiveNavTab('reports')}
              className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeNavTab === 'reports'
                  ? 'bg-ups-gold text-ups-brown font-semibold shadow-sm'
                  : 'text-amber-100/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
              {activeNavTab === 'reports' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-ups-gold hidden sm:block" />
              )}
            </button>

            <button
              onClick={() => setActiveNavTab('help')}
              className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeNavTab === 'help'
                  ? 'bg-ups-gold text-ups-brown font-semibold shadow-sm'
                  : 'text-amber-100/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
              {activeNavTab === 'help' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-ups-gold hidden sm:block" />
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative pl-2 border-l border-white/15">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className={`flex items-center space-x-2 text-sm py-1.5 px-2.5 rounded-lg transition-colors ${
                  activeNavTab === 'account'
                    ? 'bg-ups-gold text-ups-brown font-semibold shadow-sm'
                    : 'text-amber-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center ${
                  activeNavTab === 'account' ? 'bg-ups-brown text-white' : 'bg-white text-ups-brown'
                }`}>
                  PS
                </div>
                <span className="font-medium hidden md:inline">Account</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white text-gray-800 shadow-2xl border border-gray-100 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">Priya Sharma</p>
                    <p className="text-[11px] text-gray-500 truncate">priya.sharma@meridiantrade.co.uk</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ✓ Verified Shipper
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      setActiveNavTab('account');
                      setShowAccountMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 flex items-center gap-2.5 text-gray-700 font-medium"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Account Profile</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveNavTab('account');
                      setShowAccountMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 flex items-center gap-2.5 text-gray-700 font-medium"
                  >
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>Company & Shipper Details</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveNavTab('account');
                      setShowAccountMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 flex items-center gap-2.5 text-gray-700 font-medium"
                  >
                    <Sliders className="w-4 h-4 text-gray-400" />
                    <span>AI Validation Preferences</span>
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button 
                    onClick={() => {
                      setShowAccountMenu(false);
                      alert('Signed out successfully');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2.5 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

