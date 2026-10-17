import React, { useState } from 'react';
import { 
  Activity, 
  Play, 
  Volume2, 
  Users, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProcurementBooking } from '../../types';

interface OfficerQueueViewProps {
  onOpenWeighingModal: (booking: ProcurementBooking) => void;
}

export const OfficerQueueView: React.FC<OfficerQueueViewProps> = ({ onOpenWeighingModal }) => {
  const { currentUser, bookings, centres, advanceQueueForCentre, speakText, updateBookingStatus } = useApp();
  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];
  const centreBookings = bookings.filter(b => b.centreId === currentCentre.id);

  const [announcementMsg, setAnnouncementMsg] = useState('');

  const waitingList = centreBookings.filter(b => b.status === 'waiting');
  const calledList = centreBookings.filter(b => b.status === 'called');
  const weighingList = centreBookings.filter(b => b.status === 'weighing');
  const completedList = centreBookings.filter(b => b.status === 'approved' || b.status === 'paid');

  const handleCallToken = (booking: ProcurementBooking) => {
    updateBookingStatus(booking.id, 'called');
    speakText(`Calling Token Number ${booking.tokenNumber}, Farmer ${booking.farmerName}. Please bring your vehicle to Weighbridge Number 1.`);
    setAnnouncementMsg(`Announced Token ${booking.tokenNumber} on Mandi Public Address Speaker!`);
    setTimeout(() => setAnnouncementMsg(''), 4000);
  };

  const handleSendSmsAlert = (booking: ProcurementBooking) => {
    alert(`SMS Alert dispatched to ${booking.farmerMobile}: "Govt Mandi Alert: Token ${booking.tokenNumber} - Your vehicle is called to Weighbridge 1 immediately."`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Live Mandi Yard Traffic Control
            </span>
            <span className="text-xs text-slate-400">&bull; Yard: <strong>Tractor Staging Bay A & B</strong></span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Real-Time Vehicle Queue & Gate Dispatch
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor multi-stage progression from Gate Arrival to Gross Weighing, Lab Assay, and Tare Exit
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              advanceQueueForCentre(currentCentre.id);
              const next = waitingList[0];
              if (next) {
                speakText(`Token ${next.tokenNumber}, ${next.farmerName}, please report to Weighbridge 1`);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs flex items-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Advance Next Tractor</span>
          </button>
        </div>
      </div>

      {announcementMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <Volume2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{announcementMsg}</span>
        </div>
      )}

      {/* 4-Stage Visual Queue Kanban Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stage 1: Waiting */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              1. Waiting in Yard
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
              {waitingList.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {waitingList.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No vehicles waiting</div>
            ) : (
              waitingList.map(b => (
                <div key={b.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-800">{b.tokenNumber}</span>
                    <span className="text-[10px] text-slate-400">{b.slotTime}</span>
                  </div>
                  <div className="font-bold text-slate-900">{b.farmerName}</div>
                  <div className="text-[11px] text-slate-500">{b.crop} &bull; {b.quantityQuintals} Qtl</div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => handleCallToken(b)}
                      className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Volume2 className="w-3 h-3" /> Call to Gate
                    </button>
                    <button
                      onClick={() => handleSendSmsAlert(b)}
                      className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700"
                      title="Send SMS notification to farmer"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stage 2: Called */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              2. Called to Weighbridge
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800">
              {calledList.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {calledList.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">None currently called</div>
            ) : (
              calledList.map(b => (
                <div key={b.id} className="p-3 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-900">{b.tokenNumber}</span>
                    <span className="text-[10px] font-bold text-sky-700">At Gate 1</span>
                  </div>
                  <div className="font-bold text-slate-900">{b.farmerName}</div>
                  <div className="text-[11px] text-slate-500">{b.crop} &bull; {b.quantityQuintals} Qtl</div>
                  <button
                    onClick={() => onOpenWeighingModal(b)}
                    className="w-full py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Scale className="w-3 h-3" /> Start Gross Weighing
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stage 3: Weighing & Lab */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              3. Weighing & Assay
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">
              {weighingList.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {weighingList.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No lots currently weighing</div>
            ) : (
              weighingList.map(b => (
                <div key={b.id} className="p-3 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-900">{b.tokenNumber}</span>
                    <span className="text-[10px] font-bold text-purple-700">Lab Testing</span>
                  </div>
                  <div className="font-bold text-slate-900">{b.farmerName}</div>
                  <div className="text-[11px] text-slate-500">{b.crop} &bull; {b.quantityQuintals} Qtl</div>
                  <button
                    onClick={() => onOpenWeighingModal(b)}
                    className="w-full py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    Complete Slip & Clear
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stage 4: Completed Today */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              4. Unloaded & Approved
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
              {completedList.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {completedList.slice(0, 5).map(b => (
              <div key={b.id} className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-900">{b.tokenNumber}</span>
                  <span className="text-[10px] font-bold text-emerald-700">Cleared</span>
                </div>
                <div className="font-bold text-slate-900">{b.farmerName}</div>
                <div className="text-[11px] text-slate-500">{b.crop} &bull; {b.quantityQuintals} Qtl</div>
                <div className="text-[10px] font-bold text-emerald-800">Ready for DBT Credit</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
