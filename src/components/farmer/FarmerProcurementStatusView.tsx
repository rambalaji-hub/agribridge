import React from 'react';
import { 
  Scale, 
  Clock, 
  CheckCircle2, 
  FileText, 
  CreditCard, 
  ArrowRight, 
  AlertCircle,
  Truck,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FarmerProcurementStatusView: React.FC = () => {
  const { bookings, openDetailDrawer, setActiveTab, openPrintModal, t, tD, localizeCrop, localizeMandi } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {tD('grainConsignmentLifecycle')}
          </span>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            {tD('procurementLotStatusTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {tD('procurementLotStatusDesc')}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('book-slot')}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs self-start md:self-auto"
        >
          {tD('bookNewLot')}
        </button>
      </div>

      {/* Bookings Tracker Cards */}
      <div className="space-y-4">
        {bookings.map(booking => {
          const isCompleted = booking.status === 'paid' || booking.status === 'approved';
          const isWeighed = !!booking.weighingSlip;

          return (
            <div 
              key={booking.id} 
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {booking.tokenNumber}
                    </span>
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      {localizeCrop(booking.crop)} &bull; {booking.quantityQuintals} {tD('quintalsUnit', 'Quintals')}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {tD('mandiLabel')}: <strong>{localizeMandi(booking.centreName)}</strong> &bull; {tD('scheduledSlotLabel')}: <strong>{booking.slotTime}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    booking.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : booking.status === 'approved'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {booking.status === 'paid' 
                      ? tD('statusPaid') 
                      : booking.status === 'approved' 
                      ? tD('statusApproved') 
                      : booking.status === 'booking_confirmed' 
                      ? tD('statusConfirmed') 
                      : booking.status ? String(booking.status).replace(/_/g, ' ') : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                <div className="space-y-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center mx-auto text-xs">
                    ✓
                  </div>
                  <span className="font-bold text-slate-900 block text-[11px]">{tD('milestoneSlotBooked')}</span>
                  <span className="text-[10px] text-slate-400">{tD('tokenActive')}</span>
                </div>

                <div className="space-y-1">
                  <div className={`w-7 h-7 rounded-full text-white font-bold flex items-center justify-center mx-auto text-xs ${
                    booking.status !== 'booking_confirmed' ? 'bg-emerald-700' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {booking.status !== 'booking_confirmed' ? '✓' : '2'}
                  </div>
                  <span className={`font-bold block text-[11px] ${booking.status !== 'booking_confirmed' ? 'text-slate-900' : 'text-slate-400'}`}>
                    {tD('milestoneGateVerification')}
                  </span>
                  <span className="text-[10px] text-slate-400">{tD('entryScan')}</span>
                </div>

                <div className="space-y-1">
                  <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center mx-auto text-xs ${
                    isWeighed ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isWeighed ? '✓' : '3'}
                  </div>
                  <span className={`font-bold block text-[11px] ${isWeighed ? 'text-slate-900' : 'text-slate-400'}`}>
                    {tD('milestoneWeighment')}
                  </span>
                  <span className="text-[10px] text-slate-400">{isWeighed ? `${booking.weighingSlip?.netWeightQuintals} ${tD('qtlUnit', 'Qtl')}` : tD('pendingWeigh')}</span>
                </div>

                <div className="space-y-1">
                  <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center mx-auto text-xs ${
                    booking.status === 'paid' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {booking.status === 'paid' ? '✓' : '4'}
                  </div>
                  <span className={`font-bold block text-[11px] ${booking.status === 'paid' ? 'text-slate-900' : 'text-slate-400'}`}>
                    {tD('milestoneDbtCredit')}
                  </span>
                  <span className="text-[10px] text-slate-400">{booking.status === 'paid' ? tD('creditedToBank') : tD('pendingDisbursal')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => openPrintModal('token', booking, true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-1.5"
                  title="Print Official Government Gate Token"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{tD('printGateToken')}</span>
                </button>

                {booking.weighingSlip && (
                  <button
                    onClick={() => openPrintModal('weigh-slip', booking, true)}
                    className="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50/50 hover:bg-sky-100/70 font-semibold text-sky-900 flex items-center gap-1.5"
                    title="Print Official Legal Metrology Weigh Slip"
                  >
                    <Printer className="w-3.5 h-3.5 text-sky-700" />
                    <span>{tD('printWeighSlip')}</span>
                  </button>
                )}

                {booking.paymentDetails && (
                  <button
                    onClick={() => openDetailDrawer('payment', booking.paymentDetails)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{tD('paymentVoucher')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
