import React, { useState } from 'react';
import { 
  Building2, 
  Scale, 
  Activity, 
  ShieldCheck, 
  Truck, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Cpu, 
  Camera, 
  Wrench,
  Thermometer,
  Droplets,
  HardDrive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfficerCentreOverview: React.FC = () => {
  const { currentUser, centres } = useApp();
  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];

  const [weighbridges, setWeighbridges] = useState([
    { id: 'WB-01', name: 'Weighbridge Gate 1 (Heavy Inflow)', type: 'Pitless 60 Ton Electronic', status: 'Online', calibratedOn: '12 Sep 2026', currentLoadKg: 0, vehiclesToday: 42 },
    { id: 'WB-02', name: 'Weighbridge Gate 2 (Heavy Inflow)', type: 'Pitless 60 Ton Electronic', status: 'Online', calibratedOn: '10 Sep 2026', currentLoadKg: 14200, vehiclesToday: 38 },
    { id: 'WB-03', name: 'Tare Weighbridge (Exit Gate)', type: 'Pitless 50 Ton Tare Station', status: 'Online', calibratedOn: '14 Sep 2026', currentLoadKg: 3200, vehiclesToday: 76 },
    { id: 'WB-04', name: 'Auxiliary Weighbridge (Express)', type: 'Surface 40 Ton Load Cell', status: 'Standby', calibratedOn: '08 Sep 2026', currentLoadKg: 0, vehiclesToday: 12 },
  ]);

  const [silos] = useState([
    { id: 'SILO-A', name: 'Paddy Storage Silo 1', capacity: 2500, filled: 1980, tempC: 24.2, moisturePct: 12.8, aeration: 'Active' },
    { id: 'SILO-B', name: 'Paddy Storage Silo 2', capacity: 2500, filled: 1250, tempC: 24.5, moisturePct: 13.1, aeration: 'Active' },
    { id: 'SILO-C', name: 'Wheat Silo Unit 1', capacity: 2000, filled: 1840, tempC: 22.8, moisturePct: 11.4, aeration: 'Idle' },
    { id: 'SILO-D', name: 'Buffer Storage Covered Shed', capacity: 1500, filled: 620, tempC: 25.1, moisturePct: 12.2, aeration: 'Active' },
  ]);

  const [staffOnDuty] = useState([
    { name: 'Rajesh Verma', role: 'Nodal Procurement Officer (Class-I)', badge: 'GOV-INSP-402', shift: '08:00 AM - 04:00 PM', status: 'On Duty' },
    { name: 'Gurpreet Singh', role: 'Chief Weighbridge In-Charge', badge: 'WB-TECH-109', shift: '08:00 AM - 04:00 PM', status: 'On Duty' },
    { name: 'Dr. Anita Joshi', role: 'Quality Assurance Chemist', badge: 'QA-LAB-881', shift: '09:00 AM - 05:00 PM', status: 'In Lab' },
    { name: 'Balwinder Ram', role: 'Gate Pass Verifier & Security', badge: 'SEC-GATE-04', shift: '07:30 AM - 03:30 PM', status: 'At Gate 1' },
  ]);

  return (
    <div className="space-y-6">
      {/* Centre Facility Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Mandi Hub Infrastructure Status
            </span>
            <span className="text-xs text-slate-400">&bull; Gov Portal Node: <strong className="font-mono text-slate-700">{currentCentre.code}</strong></span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            {currentCentre.name} &bull; Facility Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentCentre.taluk}, {currentCentre.district}, {currentCentre.state} - PIN: {currentCentre.pincode}</span>
            <span>&bull;</span>
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>Nodal Helplines: {currentCentre.phone}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-right">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">Hub Compliance</span>
            <div className="font-heading text-lg font-black text-emerald-900 flex items-center gap-1.5 justify-end">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>ISO 9001:2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Silos & Storage Capacity Gauges */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-700" />
              <span>Grain Silos & Covered Shed Yard Capacities</span>
            </h3>
            <p className="text-xs text-slate-500">Live moisture, aeration and fill level sensors</p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            Total Capacity: 8,500 Quintals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {silos.map(silo => {
            const fillPct = Math.round((silo.filled / silo.capacity) * 100);
            return (
              <div key={silo.id} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{silo.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${fillPct > 80 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {fillPct}% Full
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${fillPct > 80 ? 'bg-amber-600' : 'bg-emerald-600'}`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>{silo.filled} Qtl stored</span>
                  <span className="text-slate-400">Cap: {silo.capacity} Qtl</span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                    <span>{silo.tempC}°C Temp</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span>{silo.moisturePct}% Moist</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Electronic Weighbridge Load Cells Status */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              <span>Certified Electronic Weighbridges (4 Heavy Scale Stations)</span>
            </h3>
            <p className="text-xs text-slate-500">Legal Metrology certified digital load cells with tamper-proof optic telemetry</p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Legal Metrology Calibrated: 100% Valid
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weighbridges.map(wb => (
            <div key={wb.id} className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800">{wb.id}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{wb.name}</h4>
                  <span className="text-xs text-slate-500">{wb.type}</span>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${wb.status === 'Online' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${wb.status === 'Online' ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                    {wb.status}
                  </span>
                  <div className="text-xs text-slate-400 mt-1">
                    Calibrated: {wb.calibratedOn}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Load Cell Reading</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {wb.currentLoadKg > 0 ? `${wb.currentLoadKg} KG` : '0.00 KG (Station Empty)'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicles Processed Today</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {wb.vehiclesToday} Consignments
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff on Duty & Mandi Security */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <span>Authorized Procurement Roster & Gate Personnel</span>
            </h3>
            <p className="text-xs text-slate-500">Government appointed mandi officers, quality chemists, and security staff</p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            Shift: Active (Day Operation)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {staffOnDuty.map((staff, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{staff.name}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {staff.status}
                </span>
              </div>
              <div className="text-xs text-slate-600">{staff.role}</div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/70">
                <span className="font-mono">{staff.badge}</span>
                <span>{staff.shift}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
