import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProcurementBooking } from '../../types';

// Distinct Sub-Pages for Officer Dashboard
import { OfficerOverview } from './OfficerOverview';
import { OfficerCentreOverview } from './OfficerCentreOverview';
import { OfficerSlotManagement } from './OfficerSlotManagement';
import { OfficerBookingsView } from './OfficerBookingsView';
import { OfficerTokenManagement } from './OfficerTokenManagement';
import { OfficerQueueView } from './OfficerQueueView';
import { OfficerWeighingQualityView } from './OfficerWeighingQualityView';
import { OfficerProcurementStatusView } from './OfficerProcurementStatusView';
import { OfficerPaymentsView } from './OfficerPaymentsView';
import { OfficerReportsView } from './OfficerReportsView';
import { OfficerNotificationsView } from './OfficerNotificationsView';
import { OfficerProfileView } from './OfficerProfileView';

export const OfficerDashboard: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    centres, 
    recordWeighment, 
    recordQualityTest
  } = useApp();

  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];

  // Quick Inspection Modal (shared across overview and booking tables)
  const [selectedBookingForWeighing, setSelectedBookingForWeighing] = useState<ProcurementBooking | null>(null);
  const [grossWeight, setGrossWeight] = useState<number>(13800);
  const [tareWeight, setTareWeight] = useState<number>(3100);
  const [vehicleNo, setVehicleNo] = useState<string>('PB-08-AG-4921');
  const [moisture, setMoisture] = useState<number>(13.5);
  const [foreignMatter, setForeignMatter] = useState<number>(0.5);
  const [grade, setGrade] = useState<string>('Grade-A Prime (Fair Average Quality)');
  const [actionSuccess, setActionSuccess] = useState<string>('');

  const netWeightKg = Math.max(0, grossWeight - tareWeight);
  const netQuintals = Number((netWeightKg / 100).toFixed(2));

  const handleSaveWeighment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForWeighing) return;

    try {
      await recordWeighment(selectedBookingForWeighing.id, {
        slipNumber: `WS-${currentCentre.code}-${Date.now().toString().slice(-5)}`,
        grossWeightKg: grossWeight,
        tareWeightKg: tareWeight,
        netWeightKg,
        netWeightQuintals: netQuintals,
        vehicleNumber: vehicleNo,
        driverName: 'Assigned Driver',
        weighmanName: currentUser?.name || 'Officer Rajesh Verma',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      await recordQualityTest(selectedBookingForWeighing.id, moisture, foreignMatter, 'Grade A', 'Recorded at the weighing station.');
      setActionSuccess(`Weighment of ${netQuintals} Quintals recorded and Lot Approved!`);
    } catch (error) {
      setActionSuccess(error instanceof Error ? error.message : 'Could not save the weighment.');
      return;
    }
    setTimeout(() => {
      setSelectedBookingForWeighing(null);
      setActionSuccess('');
    }, 2000);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OfficerOverview onOpenWeighingModal={setSelectedBookingForWeighing} />;
      case 'centre-overview':
        return <OfficerCentreOverview />;
      case 'slot-management':
        return <OfficerSlotManagement />;
      case 'farmer-bookings':
        return <OfficerBookingsView onOpenWeighingModal={setSelectedBookingForWeighing} />;
      case 'token-management':
        return <OfficerTokenManagement />;
      case 'live-queue':
        return <OfficerQueueView onOpenWeighingModal={setSelectedBookingForWeighing} />;
      case 'weighing-quality':
        return <OfficerWeighingQualityView />;
      case 'procurement-status':
        return <OfficerProcurementStatusView />;
      case 'payments':
        return <OfficerPaymentsView />;
      case 'reports':
        return <OfficerReportsView />;
      case 'notifications':
        return <OfficerNotificationsView />;
      case 'profile':
        return <OfficerProfileView />;
      default:
        return <OfficerOverview onOpenWeighingModal={setSelectedBookingForWeighing} />;
    }
  };

  return (
    <>
      {renderActivePage()}

      {/* Modal for Quick Weighbridge Inspection */}
      {selectedBookingForWeighing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200/90 w-full max-w-lg rounded-2xl shadow-xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Record Certified Weighment & Quality Test
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Token: <strong className="font-mono text-emerald-800">{selectedBookingForWeighing.tokenNumber}</strong> &bull; Farmer: <strong>{selectedBookingForWeighing.farmerName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForWeighing(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-base"
              >
                &times;
              </button>
            </div>

            {actionSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold text-center">
                {actionSuccess}
              </div>
            ) : (
              <form onSubmit={handleSaveWeighment} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Vehicle Registration Number</label>
                    <input
                      type="text"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Commodity / Crop</label>
                    <input
                      type="text"
                      disabled
                      value={selectedBookingForWeighing.crop}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Gross Weight (Loaded KG)</label>
                    <input
                      type="number"
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Tare Weight (Empty KG)</label>
                    <input
                      type="number"
                      value={tareWeight}
                      onChange={(e) => setTareWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Net Weight Automatic Calculator Banner */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <span className="font-semibold text-emerald-900">Net Procurement Weight:</span>
                  <span className="font-heading font-black text-emerald-950 text-base">
                    {netQuintals} Quintals <span className="text-xs font-mono font-normal">({netWeightKg} KG)</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Grain Moisture (%) [Max 17%]</label>
                    <input
                      type="number"
                      step="0.1"
                      value={moisture}
                      onChange={(e) => setMoisture(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Foreign Matter / Dockage (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={foreignMatter}
                      onChange={(e) => setForeignMatter(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quality Assay Classification</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  >
                    <option>Grade-A Prime (Fair Average Quality)</option>
                    <option>Common Grade (Fair Average Quality)</option>
                    <option>Sub-standard / High Moisture (Rejection Warranted)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForWeighing(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Issue Certified Weighment Slip & Approve
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
