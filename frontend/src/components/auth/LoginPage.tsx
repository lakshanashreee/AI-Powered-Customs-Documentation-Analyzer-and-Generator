import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { ApiService } from '../../services/api';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('priya.sharma@meridiantrade.co.uk');
  const [password, setPassword] = useState('Priya@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await ApiService.login(email.trim(), password);
      if (result.success && result.user) {
        if (rememberMe) {
          localStorage.setItem('crossborder_token', result.token || 'logged_in');
          localStorage.setItem('crossborder_user', JSON.stringify(result.user));
        }
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.message || 'Invalid credentials. Only registered accounts can log in.');
      }
    } catch {
      setErrorMessage('Login request failed. Please check your network or backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreRegisteredUser = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 bg-ups-gold rounded-xl flex items-center justify-center font-extrabold text-ups-brown text-base tracking-tighter shadow-md">
            <span>ups</span>
          </div>
          <span className="text-2xl font-black text-gray-950 tracking-tight">
            CrossBorder <span className="text-ups-gold-dark">Ready</span>
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Sign In to Your Customs Portal
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Secure AI-Powered Customs Documentation Analyzer & Generator
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-gray-200 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium animate-in fade-in">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-xs transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <span className="text-[11px] text-gray-400">Admin registered only</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-ups-gold focus:ring-2 focus:ring-ups-gold/20 outline-none text-xs transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-ups-brown focus:ring-ups-gold w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-600">Remember this device</span>
              </label>

              <span className="text-xs text-amber-800 font-medium cursor-help" title="Registration is managed via Customs Admin">
                Restricted Access
              </span>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-extrabold text-sm shadow-md transition-all active:scale-95 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-ups-brown" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Pre-Registered Accounts Helper Box */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-gray-900">
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>Registered Database Accounts (Click to Fill):</span>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleSelectPreRegisteredUser('priya.sharma@meridiantrade.co.uk', 'Priya@2026!')}
                className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-ups-gold transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-gray-900 block">Priya Sharma (Shipper)</span>
                  <span className="text-[11px] text-gray-500 font-mono">priya.sharma@meridiantrade.co.uk</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                  Verified Shipper
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreRegisteredUser('admin@ups.com', 'Admin@Customs2026!')}
                className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-ups-gold transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-gray-900 block">Admin Officer</span>
                  <span className="text-[11px] text-gray-500 font-mono">admin@ups.com</span>
                </div>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-semibold border border-blue-200">
                  Admin
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreRegisteredUser('broker@ups.com', 'Broker@2026!')}
                className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-ups-gold transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-gray-900 block">Customs Broker</span>
                  <span className="text-[11px] text-gray-500 font-mono">broker@ups.com</span>
                </div>
                <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-semibold border border-purple-200">
                  Broker
                </span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Passwords securely verified using PBKDF2 SHA-256 against SQLite database.</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-400">
          UPS CrossBorder Ready · Confidential & Proprietary · Internal Brokerage Platform
        </p>
      </div>
    </div>
  );
};

