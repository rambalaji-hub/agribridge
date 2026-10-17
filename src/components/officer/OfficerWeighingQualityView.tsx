import React, { useState } from 'react';
import { 
  Scale, 
  Droplets, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  ShieldCheck, 
  Save, 
  FileText, 
  RotateCcw,
  Sparkles,
  Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProcurementBooking } from '../../types';

export const OfficerWeighingQualityView: React.FC = () => {
  const { 
    currentUser, 
    bookings, 
    centres, 
    recordWeighment, 
    recordQualityTest, 
    rejectProcurement,
    openDetailDrawer
  } = useApp();

  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];
  const centreBookings = bookings.filter(b => b.centreId === currentCentre.id);

  // Active testing candidate
  const [selectedBookingId, setSelectedBookingId] = useState<string>(centreBookings[0]?.id || '');
  const activeBooking = centreBookings.find(b => b.id === selectedBookingId) || centreBookings[0];

  // Weighing inputs
  const [grossWeight, setGrossWeight] = useState<number>(14200);
  const [tareWeight, setTareWeight] = useState<number>(3150);
  const [vehicleNo, setVehicleNo] = useState<string>('PB-10-BX-9021');
  const [driverName, setDriverName] = useState<string>('Sukhdev Singh');

  // Quality inputs
  const [moisture, setMoisture] = useState<number>(13.2);
  const [foreignMatter, setForeignMatter] = useState<number>(0.6);
  const [damagedGrains, setDamagedGrains] = useState<number>(1.2);
  const [grade, setGrade] = useState<'FAQ (Fair Average Quality)' | 'Grade A' | 'Sub-Standard'>('FAQ (Fair Average Quality)');
  const [submissionFeedback, setSubmissionFeedback] = useState<string>('');

  const netWeightKg = Math.max(0, grossWeight - tareWeight);
  const netQuintals = Number((netWeightKg / 100).toFixed(2));
  const isMoistureAcceptable = moisture <= 17.0; // FAQ threshold for paddy/wheat

  const handleCommitWeighment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;

    // 1. Record certified weighment
    try {
      await recordWeighment(activeBooking.id, {
        slipNumber: `WS-${currentCentre.code}-${Date.now().toString().slice(-5)}`,
        grossWeightKg: grossWeight,
        tareWeightKg: tareWeight,
        netWeightKg,
        netWeightQuintals: netQuintals,
        vehicleNumber: vehicleNo,
        driverName,
        weighmanName: currentUser?.name || 'Officer Rajesh Verma',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      await recordQualityTest(activeBooking.id, moisture, foreignMatter, grade, 'FAQ standards verified via electronic moisture meter.');
      if (!isMoistureAcceptable) {
        await rejectProcurement(activeBooking.id, `Excess moisture content (${moisture}% exceeds standard maximum 17%). Requires sun drying.`);
      }
      setSubmissionFeedback(isMoistureAcceptable
        ? `Certified Weighment Slip generated for ${activeBooking.farmerName} (${netQuintals} Qtl). Consignment Approved!`
        : `Consignment rejected due to high moisture (${moisture}%). Rejection notice issued.`);
    } catch (error) {
      setSubmissionFeedback(error instanceof Error ? error.message : 'Could not save the quality assessment.');
      return;
    }

    setTimeout(() => {
      setSubmissionFeedback('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Inspection Terminal & Legal Metrology Station
            </span>
            <span className="text-xs text-slate-400">&bull; Weighbridge 1 Pitless 60T</span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Certified Electronic Weighment & Quality Lab
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture calibrated gross/tare load cell readings and digital grain moisture analysis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">Sensor Link</span>
            <div className="font-heading text-sm font-bold text-emerald-900 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Optic Telemetry Active</span>
            </div>
          </div>
        </div>
      </div>

      {submissionFeedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{submissionFeedback}</span>
          </div>
          <button
            onClick={() => activeBooking && openDetailDrawer('booking', activeBooking)}
            className="px-3 py-1 bg-white border border-emerald-300 rounded-lg text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            View Official Slip
          </button>
        </div>
      )}

      {/* Select Lot to Inspect */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-2 whitespace-nowrap">
          <Truck className="w-4 h-4 text-emerald-700" />
          <span>Active Consignment on Platform:</span>
        </label>
        <select
          value={selectedBookingId}
          onChange={(e) => setSelectedBookingId(e.target.value)}
          className="w-full sm:w-auto flex-1 max-w-md px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          {centreBookings.map(b => (
            <option key={b.id} value={b.id}>
              {b.tokenNumber} &bull; {b.farmerName} ({b.crop} - Declared: {b.quantityQuintals} Qtl)
            </option>
          ))}
        </select>
      </div>

      {/* Main Form Split: Weighing & Quality Assay */}
      <form onSubmit={handleCommitWeighment} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Electronic Weighbridge Platform */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-700" />
                <span>Weighbridge Measurement</span>
              </h3>
              <p className="text-xs text-slate-500">Gross Weight (Loaded) minus Tare (Empty)</p>
            </div>
            <span className="font-mono text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
              Station #WB-01
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Registration No.</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="e.g. PB-10-BX-9021"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold uppercase focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Driver Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Driver Full Name"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gross Weight (Loaded KG)</label>
                <input
                  type="number"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-black text-slate-900 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tare Weight (Empty Vehicle KG)</label>
                <input
                  type="number"
                  value={tareWeight}
                  onChange={(e) => setTareWeight(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-black text-slate-900 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Calculated Net Weight Display */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Computed Net Certified Weight</span>
              <div className="flex items-baseline justify-between">
                <span className="font-heading font-black text-2xl text-slate-900">
                  {netQuintals} <span className="text-sm font-bold text-slate-500">Quintals</span>
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">
                  ({netWeightKg.toLocaleString()} KG)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Grain Quality Lab */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-sky-700" />
                <span>Grain Quality & Moisture Assay</span>
              </h3>
              <p className="text-xs text-slate-500">Moisture meter calibration & dockage assessment</p>
            </div>
            <span className="font-mono text-xs font-bold bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg border border-sky-200">
              Lab Probe: Calibrated
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Digital Moisture Sensor Reading (%)</label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isMoistureAcceptable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {isMoistureAcceptable ? 'Within FAQ Limit (Max 17%)' : 'Exceeds FAQ Threshold'}
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                min={5}
                max={30}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Foreign Matter / Dockage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={foreignMatter}
                  onChange={(e) => setForeignMatter(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Damaged / Discolored (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={damagedGrains}
                  onChange={(e) => setDamagedGrains(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Quality Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              >
                <option value="FAQ (Fair Average Quality)">FAQ (Fair Average Quality) - Standard MSP</option>
                <option value="Grade A">Grade A (Superior Grain) - Premium</option>
                <option value="Sub-Standard">Sub-Standard (Below Mandi Specifications)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-colors mt-4"
            >
              <Printer className="w-4 h-4" />
              <span>Generate Certified Weighment Slip & Issue Mandi Pass</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
