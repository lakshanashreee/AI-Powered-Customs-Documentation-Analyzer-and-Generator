import React from 'react';
import { Search, Plus, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useShipment } from '../../context/ShipmentContext';

export const ShipmentsListView: React.FC = () => {
  const { setStep, shipmentDetails, readinessScore, isSubmitted } = useShipment();

  const mockShipments = [
    {
      id: '0412',
      product: shipmentDetails.productDescription,
      origin: shipmentDetails.originCountry,
      destination: shipmentDetails.destinationCountry,
      value: `$${shipmentDetails.declaredValue.toLocaleString()}`,
      status: isSubmitted ? 'Submitted' : 'Needs Review',
      score: readinessScore,
      updated: 'Just now',
      isCurrent: true
    },
    {
      id: '0411',
      product: 'Precision Machined Valves',
      origin: 'Germany',
      destination: 'USA',
      value: '$34,500',
      status: 'Cleared',
      score: 98,
      updated: 'Yesterday, 4:20 PM',
      isCurrent: false
    },
    {
      id: '0410',
      product: 'Organic Cotton Garments',
      origin: 'India',
      destination: 'United Kingdom',
      value: '$12,800',
      status: 'Cleared',
      score: 95,
      updated: 'Nov 14, 2026',
      isCurrent: false
    },
    {
      id: '0409',
      product: 'Lithium-ion Battery Modules',
      origin: 'Vietnam',
      destination: 'Canada',
      value: '$78,400',
      status: 'Cleared',
      score: 91,
      updated: 'Nov 12, 2026',
      isCurrent: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-card">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Shipments & Customs Entries
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage AI-validated commercial customs documentation packages.
          </p>
        </div>

        <button
          onClick={() => setStep(1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-extrabold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Shipment Check</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-card flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by shipment #, buyer, HS code..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-ups-gold outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none">
            <option>All Statuses</option>
            <option>Needs Review</option>
            <option>Cleared</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Shipment #</th>
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">Origin → Destination</th>
                <th className="py-3 px-4">Declared Value</th>
                <th className="py-3 px-4">Readiness</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockShipments.map((s) => (
                <tr
                  key={s.id}
                  className={`hover:bg-amber-50/40 transition-colors ${
                    s.isCurrent ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                    #{s.id}
                    {s.isCurrent && (
                      <span className="ml-2 text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-sans">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{s.product}</td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{s.value}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {s.score}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {s.status === 'Cleared' || s.status === 'Submitted' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {s.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {s.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setStep(s.isCurrent ? 3 : 1)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-ups-brown hover:text-black underline"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
