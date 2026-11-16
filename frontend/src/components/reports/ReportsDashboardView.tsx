import React from 'react';
import { TrendingUp, ShieldCheck, Zap, FileCheck2 } from 'lucide-react';

export const ReportsDashboardView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-card">
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Customs Documentation & AI Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Real-time performance indicators from PaddleOCR document ingestion and Qwen compliance reasoning.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>First-Pass Readiness</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-extrabold text-gray-950 mt-2 block">91.4%</span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            +4.2% vs last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>PaddleOCR Confidence</span>
            <Zap className="w-4 h-4 text-ups-gold-dark" />
          </div>
          <span className="text-3xl font-extrabold text-gray-950 mt-2 block">98.4%</span>
          <span className="text-[11px] text-gray-400 block mt-1">Avg text extraction accuracy</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Qwen Discrepancy Detection</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-extrabold text-gray-950 mt-2 block">99.1%</span>
          <span className="text-[11px] text-gray-400 block mt-1">Zero missed critical blocks</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Avg AI Resolution Time</span>
            <FileCheck2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-extrabold text-gray-950 mt-2 block">1.8 min</span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            -82% vs manual auditing
          </span>
        </div>
      </div>

      {/* Discrepancy Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-card space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            Top Discrepancy Categories Identified
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-gray-800 mb-1">
                <span>Missing or Invalid HS Tariff Code</span>
                <span>42%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[42%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-gray-800 mb-1">
                <span>Declared Value vs Invoice Total Mismatch</span>
                <span>28%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[28%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-gray-800 mb-1">
                <span>Gross vs Net Weight Tare Discrepancy</span>
                <span>18%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[18%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-gray-800 mb-1">
                <span>Overly Generic Commodity Description</span>
                <span>12%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[12%]" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Pipeline Architecture Integration Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-card space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            AI & Backend Integration Architecture
          </h2>
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
            <span className="font-bold block text-sm">PaddleOCR + Qwen Model + .NET Web API</span>
            <p className="leading-relaxed text-amber-900">
              The frontend is designed with decoupled API contracts:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-amber-900">
              <li>
                <strong>PaddleOCR:</strong> Extracts structured invoice key-value pairs (INV#, totals, items, gross weight, buyer/seller addresses).
              </li>
              <li>
                <strong>Qwen Model:</strong> Evaluates trade compliance, identifies missing HS codes, flags declared value discrepancies, and generates human-readable correction guidance.
              </li>
              <li>
                <strong>.NET Web API:</strong> Handles document persistence, brokerage security, audit logging, and customs submission packets.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
