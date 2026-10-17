import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Eye, 
  CalendarClock, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProcurementBooking } from '../../types';

interface OfficerBookingsViewProps {
  onOpenWeighingModal: (booking: ProcurementBooking) => void;
}

export const OfficerBookingsView: React.FC<OfficerBookingsViewProps> = ({ onOpenWeighingModal }) => {
  const { currentUser, bookings, centres, openDetailDrawer, setActiveTab } = useApp();
  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];
  const centreBookings = bookings.filter(b => b.centreId === currentCentre.id);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCrop, setFilterCrop] = useState<string>('all');

  const filtered = centreBookings.filter(b => {
    const matchesSearch = 
      b.tokenNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      b.farmerMobile.includes(search);
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesCrop = filterCrop === 'all' || b.crop === filterCrop;
    return matchesSearch && matchesStatus && matchesCrop;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Mandi Registry
            </span>
            <span className="text-xs text-slate-400">&bull; Centre: <strong className="text-slate-700">{currentCentre.name}</strong></span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Farmer Procurement Bookings Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit, inspect, and verify state-wide crop arrivals booked at this APMC centre
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Centre Bookings</span>
            <div className="font-heading text-xl font-black text-slate-900">
              {centreBookings.length} Consignments
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Token (e.g. #AG240024), Farmer Name, or Mobile..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">All Statuses</option>
            <option value="waiting">Waiting in Yard</option>
            <option value="called">Called to Gate</option>
            <option value="weighing">Under Weighment</option>
            <option value="approved">Approved & Cleared</option>
            <option value="paid">DBT Disbursed</option>
          </select>

          <select
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">All Crops</option>
            <option value="Paddy (Dhan)">Paddy (Dhan)</option>
            <option value="Wheat (Gehun)">Wheat (Gehun)</option>
            <option value="Maize (Makka)">Maize (Makka)</option>
            <option value="Groundnut (Mungfali)">Groundnut</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <span>Matched Farmer Records ({filtered.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3 pr-3">Token</th>
                <th className="pb-3 pr-3">Farmer & Mobile</th>
                <th className="pb-3 pr-3">Crop</th>
                <th className="pb-3 pr-3">Quantity</th>
                <th className="pb-3 pr-3">Booked Slot</th>
                <th className="pb-3 pr-3">Land KYC</th>
                <th className="pb-3 pr-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 pr-3 font-mono font-bold text-emerald-800">
                    {b.tokenNumber}
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="font-bold text-slate-900">{b.farmerName}</div>
                    <div className="text-[11px] font-mono text-slate-500">{b.farmerMobile}</div>
                  </td>
                  <td className="py-3.5 pr-3 font-medium text-slate-800">{b.crop}</td>
                  <td className="py-3.5 pr-3 font-semibold text-slate-900">{b.quantityQuintals} Qtl</td>
                  <td className="py-3.5 pr-3 text-slate-600">
                    <div className="font-medium">{b.bookingDate}</div>
                    <div className="text-[11px] text-slate-400">{b.slotTime}</div>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      e-KYC Verified
                    </span>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {b.status ? String(b.status).replace(/_/g, ' ') : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenWeighingModal(b)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors shadow-2xs"
                      >
                        Weigh
                      </button>
                      <button
                        onClick={() => openDetailDrawer('booking', b)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors"
                      >
                        Details
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
