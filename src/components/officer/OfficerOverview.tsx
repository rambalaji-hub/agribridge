import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Scale, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Play, 
  Volume2, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Ticket,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProcurementBooking } from '../../types';

interface OfficerOverviewProps {
  onOpenWeighingModal: (booking: ProcurementBooking) => void;
}

export const OfficerOverview: React.FC<OfficerOverviewProps> = ({ onOpenWeighingModal }) => {
  const { 
    currentUser, 
    bookings, 
    centres, 
    openDetailDrawer, 
    advanceQueueForCentre,
    speakText,
    setActiveTab
  } = useApp();

  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];
  const centreBookings = bookings.filter(b => b.centreId === currentCentre.id);
  const activeWaitingBookings = centreBookings.filter(b => b.status === 'waiting' || b.status === 'called');

  const handleCallNext = () => {
    advanceQueueForCentre(currentCentre.id);
    const nextInLine = centreBookings.find(b => b.status === 'waiting');
    if (nextInLine) {
      speakText(`Token number ${nextInLine.tokenNumber}, farmer ${nextInLine.farmerName}, please proceed to Weighbridge Gate Number 1.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Officer Centre Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
              Procurement Officer Node &bull; Live Station
            </span>
            <span className="text-xs text-slate-400">&bull; Mandi Code: <strong className="font-mono text-slate-700">{currentCentre.code}</strong></span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            {currentCentre.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational Weighbridges: <strong className="text-slate-700">4 Heavy Load Cells Active</strong> &bull; Silo Yard: <strong className="text-slate-700">{currentCentre.currentBookedQuintals} / {currentCentre.dailyCapacityQuintals} Qtl</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('weighing-quality')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs flex items-center gap-2 transition-all"
          >
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>Inspection Lab</span>
          </button>
          <button
            onClick={handleCallNext}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs flex items-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Call Next Token</span>
          </button>
        </div>
      </div>

      {/* Centre Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('reports')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Today's Procurement</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-2xl font-black text-slate-900 mt-2">
            1,240 <span className="text-xs font-semibold text-slate-400">Quintals</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">82% of Daily Target (1,500 Qtl)</span>
        </div>

        <div 
          onClick={() => setActiveTab('live-queue')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Gate Queue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-2xl font-black text-slate-900 mt-2">
            {currentCentre.currentQueueCount} <span className="text-xs font-semibold text-slate-400">Tractors</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Avg gross weighing: 4.2 mins</span>
        </div>

        <div 
          onClick={() => setActiveTab('slot-management')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Slots Available Today</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-2xl font-black text-slate-900 mt-2">
            {currentCentre.availableSlotsToday} <span className="text-xs font-semibold text-slate-400">Slots</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Dynamic capacity throttling active</span>
        </div>

        <div 
          onClick={() => setActiveTab('payments')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Direct DBT Approved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-2xl font-black text-emerald-800 mt-2">
            ₹28.7 <span className="text-xs font-semibold">Lakhs</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Zero pending payment arrears</span>
        </div>
      </div>

      {/* Quick Action Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTab('weighing-quality')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-900">Weighbridge & Quality Lab</h4>
            <p className="text-xs text-slate-500 mt-1">Record gross/tare electronic weighments, test moisture percentage, and issue certified slips.</p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-800 gap-1">
            <span>Open Testing Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('token-management')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
              <Ticket className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-900">Gate Pass & Token Desk</h4>
            <p className="text-xs text-slate-500 mt-1">Scan farmer entry QR passes, issue walk-in queue tokens, and verify registered credentials.</p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-sky-800 gap-1">
            <span>Manage Gate Tokens</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('payments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-900">DBT & PFMS Disbursal</h4>
            <p className="text-xs text-slate-500 mt-1">Review verified procurement lots, calculate MSP payouts, and digitally approve bank transfers.</p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-purple-800 gap-1">
            <span>Authorize Disbursals</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Active Weighing & Quality Inspection Station */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              <span>Today's Mandi Lots & Inspection Status</span>
            </h3>
            <p className="text-xs text-slate-500">Live feed of scheduled and incoming farmer consignments</p>
          </div>
          <button
            onClick={() => setActiveTab('farmer-bookings')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>View All ({centreBookings.length} Bookings)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Farmer Lots Pending Inspection */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3 pr-3">Token</th>
                <th className="pb-3 pr-3">Farmer Name</th>
                <th className="pb-3 pr-3">Mobile</th>
                <th className="pb-3 pr-3">Crop</th>
                <th className="pb-3 pr-3">Declared Qty</th>
                <th className="pb-3 pr-3">Slot Time</th>
                <th className="pb-3 pr-3">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {centreBookings.slice(0, 5).map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 pr-3 font-mono font-bold text-emerald-800">
                    {b.tokenNumber}
                  </td>
                  <td className="py-3.5 pr-3 font-bold text-slate-900">
                    {b.farmerName}
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-slate-500">
                    {b.farmerMobile}
                  </td>
                  <td className="py-3.5 pr-3 font-medium text-slate-800">{b.crop}</td>
                  <td className="py-3.5 pr-3 font-semibold text-slate-900">{b.quantityQuintals} Qtl</td>
                  <td className="py-3.5 pr-3 text-slate-600">{b.slotTime}</td>
                  <td className="py-3.5 pr-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {b.status ? String(b.status).replace(/_/g, ' ') : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenWeighingModal(b)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors shadow-2xs"
                      >
                        Inspect & Weigh
                      </button>
                      <button
                        onClick={() => openDetailDrawer('booking', b)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors"
                      >
                        View Slip
                      </button>
                    </div>
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
