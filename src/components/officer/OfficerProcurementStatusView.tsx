import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Truck, 
  Search, 
  Download,
  Filter,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfficerProcurementStatusView: React.FC = () => {
  const { currentUser, bookings, centres, openDetailDrawer } = useApp();
  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];
  const centreBookings = bookings.filter(b => b.centreId === currentCentre.id);

  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'approved' | 'rejected'>('all');

  const approvedLots = centreBookings.filter(b => b.status === 'approved' || b.status === 'paid' || b.status === 'completed');
  const rejectedLots = centreBookings.filter(b => b.status === 'rejected');

  const displayedLots = activeTabFilter === 'approved' ? approvedLots :
                        activeTabFilter === 'rejected' ? rejectedLots : centreBookings;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Procurement Audit & FCI Rail Handover
            </span>
            <span className="text-xs text-slate-400">&bull; Centre: <strong className="text-slate-700">{currentCentre.name}</strong></span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Procurement Clearance & Rejection Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit approved mandi consignments ready for FCI rail siding dispatch and documented rejection memos
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('FCI Freight Dispatch Manifest exported as PDF.')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export FCI Manifest</span>
          </button>
        </div>
      </div>

      {/* Aggregate Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTabFilter('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${activeTabFilter === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-900 border-slate-200/90 shadow-2xs hover:border-slate-300'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${activeTabFilter === 'all' ? 'text-slate-400' : 'text-slate-500'}`}>
            Total Consignments Audited
          </span>
          <div className="font-heading text-2xl font-black mt-1">
            {centreBookings.length} Lots
          </div>
          <span className={`text-xs mt-0.5 block ${activeTabFilter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
            Cumulative today
          </span>
        </div>

        <div 
          onClick={() => setActiveTabFilter('approved')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${activeTabFilter === 'approved' ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm' : 'bg-white text-slate-900 border-slate-200/90 shadow-2xs hover:border-emerald-300'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${activeTabFilter === 'approved' ? 'text-emerald-200' : 'text-slate-500'}`}>
            Approved for Public Distribution
          </span>
          <div className="font-heading text-2xl font-black mt-1">
            {approvedLots.length} Lots
          </div>
          <span className={`text-xs mt-0.5 block ${activeTabFilter === 'approved' ? 'text-emerald-100' : 'text-emerald-700'}`}>
            100% FAQ standard compliant
          </span>
        </div>

        <div 
          onClick={() => setActiveTabFilter('rejected')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${activeTabFilter === 'rejected' ? 'bg-rose-800 text-white border-rose-800 shadow-sm' : 'bg-white text-slate-900 border-slate-200/90 shadow-2xs hover:border-rose-300'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${activeTabFilter === 'rejected' ? 'text-rose-200' : 'text-slate-500'}`}>
            Rejected / Sub-Standard
          </span>
          <div className="font-heading text-2xl font-black mt-1">
            {rejectedLots.length} Lots
          </div>
          <span className={`text-xs mt-0.5 block ${activeTabFilter === 'rejected' ? 'text-rose-100' : 'text-rose-700'}`}>
            With documented cause memos
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Consignment Audit Register ({displayedLots.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3 pr-3">Token No</th>
                <th className="pb-3 pr-3">Farmer</th>
                <th className="pb-3 pr-3">Crop</th>
                <th className="pb-3 pr-3">Net Qty</th>
                <th className="pb-3 pr-3">Audit Outcome</th>
                <th className="pb-3 pr-3">Inspection Note / Reason</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedLots.map(b => {
                const isApproved = b.status === 'approved' || b.status === 'paid' || b.status === 'completed';
                const isRejected = b.status === 'rejected';
                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-3 font-mono font-bold text-emerald-800">
                      {b.tokenNumber}
                    </td>
                    <td className="py-3.5 pr-3">
                      <div className="font-bold text-slate-900">{b.farmerName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{b.farmerMobile}</div>
                    </td>
                    <td className="py-3.5 pr-3 font-medium text-slate-800">{b.crop}</td>
                    <td className="py-3.5 pr-3 font-semibold text-slate-900">
                      {b.weighingSlip?.netWeightQuintals || b.quantityQuintals} Qtl
                    </td>
                    <td className="py-3.5 pr-3">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Approved
                        </span>
                      ) : isRejected ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <XCircle className="w-3 h-3 text-rose-700" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Pending Assay
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 pr-3 text-slate-600 max-w-xs truncate">
                      {b.rejectionReason || b.qualityMetrics?.remarks || 'Grain moisture assayed < 14%. Cleared for FCI rail siding transfer.'}
                    </td>
                    <td className="py-3.5">
                      <button
                        onClick={() => openDetailDrawer('booking', b)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Slip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
