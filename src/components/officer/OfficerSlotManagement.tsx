import React, { useState } from 'react';
import { 
  CalendarClock, 
  Clock, 
  Users, 
  SlidersHorizontal, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Flame,
  Save,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SlotConfig {
  id: string;
  timeWindow: string;
  maxVehicles: number;
  bookedVehicles: number;
  emergencyReserved: number;
  status: 'Open' | 'Throttled' | 'Full' | 'Closed';
}

export const OfficerSlotManagement: React.FC = () => {
  const { currentUser, centres } = useApp();
  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];

  const [slots, setSlots] = useState<SlotConfig[]>([
    { id: 'S1', timeWindow: '08:00 AM - 09:30 AM', maxVehicles: 20, bookedVehicles: 18, emergencyReserved: 2, status: 'Open' },
    { id: 'S2', timeWindow: '09:30 AM - 11:00 AM', maxVehicles: 25, bookedVehicles: 25, emergencyReserved: 2, status: 'Full' },
    { id: 'S3', timeWindow: '11:00 AM - 12:30 PM', maxVehicles: 25, bookedVehicles: 22, emergencyReserved: 3, status: 'Open' },
    { id: 'S4', timeWindow: '12:30 PM - 02:00 PM', maxVehicles: 15, bookedVehicles: 14, emergencyReserved: 1, status: 'Throttled' },
    { id: 'S5', timeWindow: '02:00 PM - 03:30 PM', maxVehicles: 20, bookedVehicles: 12, emergencyReserved: 2, status: 'Open' },
    { id: 'S6', timeWindow: '03:30 PM - 05:00 PM', maxVehicles: 15, bookedVehicles: 8, emergencyReserved: 2, status: 'Open' },
  ]);

  const [saveFeedback, setSaveFeedback] = useState(false);

  const handleAdjustCapacity = (id: string, delta: number) => {
    setSlots(prev => prev.map(s => {
      if (s.id !== id) return s;
      const nextMax = Math.max(s.bookedVehicles, s.maxVehicles + delta);
      return {
        ...s,
        maxVehicles: nextMax,
        status: nextMax <= s.bookedVehicles ? 'Full' : 'Open'
      };
    }));
  };

  const handleToggleThrottle = (id: string) => {
    setSlots(prev => prev.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        status: s.status === 'Throttled' ? 'Open' : 'Throttled'
      };
    }));
  };

  const handleSaveChanges = () => {
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const totalMax = slots.reduce((acc, s) => acc + s.maxVehicles, 0);
  const totalBooked = slots.reduce((acc, s) => acc + s.bookedVehicles, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
              Mandi Gate Slot Controller
            </span>
            <span className="text-xs text-slate-400">&bull; Centre: <strong className="text-slate-700">{currentCentre.name}</strong></span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Hourly Vehicle Capacity & Slot Quotas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure hourly tractor throughput limits to prevent yard congestion and weighbridge backlogs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {saveFeedback && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Capacity Saved
            </span>
          )}
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Apply Quota Changes</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Daily Gate Capacity</span>
          <div className="font-heading text-2xl font-black text-slate-900 mt-1">
            {totalMax} Vehicles / Day
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">Across 6 operational operating windows</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Booked Consignments</span>
          <div className="font-heading text-2xl font-black text-slate-900 mt-1">
            {totalBooked} / {totalMax} Slots
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">
            {totalMax - totalBooked} Open Slots for Farmers
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Emergency Buffer Reserved</span>
          <div className="font-heading text-2xl font-black text-amber-700 mt-1">
            12 Tokens
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">Reserved for distressed or perishable arrivals</span>
        </div>
      </div>

      {/* Hourly Slot Control Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-emerald-700" />
              <span>Hourly Operating Windows Configuration</span>
            </h3>
            <p className="text-xs text-slate-500">Increase or decrease allowed vehicles per window based on weighbridge throughput</p>
          </div>
        </div>

        <div className="space-y-3">
          {slots.map(slot => {
            const available = slot.maxVehicles - slot.bookedVehicles;
            return (
              <div 
                key={slot.id} 
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span className="font-heading text-sm font-bold text-slate-900">{slot.timeWindow}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      slot.status === 'Open' ? 'bg-emerald-100 text-emerald-800' :
                      slot.status === 'Full' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {slot.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>Booked: <strong className="text-slate-800">{slot.bookedVehicles}</strong></span>
                    <span>&bull;</span>
                    <span>Available: <strong className="text-emerald-700">{available}</strong></span>
                    <span>&bull;</span>
                    <span>Emergency Reserve: <strong className="text-amber-700">{slot.emergencyReserved}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => handleAdjustCapacity(slot.id, -1)}
                      className="px-2.5 py-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Decrease Slot Capacity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 font-mono text-xs font-black text-slate-900 min-w-10 text-center">
                      {slot.maxVehicles}
                    </span>
                    <button
                      onClick={() => handleAdjustCapacity(slot.id, 1)}
                      className="px-2.5 py-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Increase Slot Capacity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggleThrottle(slot.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      slot.status === 'Throttled' 
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {slot.status === 'Throttled' ? 'Unthrottle' : 'Throttle Slot'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
