import React from 'react';
import { 
  Scale, 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  QrCode as QrIcon,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WeighSlipView: React.FC = () => {
  const { bookings, speakText, currentUser, openPrintModal, t, tD, localizeCrop, localizeMandi } = useApp();

  const slipBooking = bookings.find(b => b.weighingSlip) || bookings[3] || bookings[0];
  const weigh = slipBooking.weighingSlip || {
    slipNumber: 'WS-KNL-2026-90412',
    grossWeightKg: 14280,
    tareWeightKg: 3302,
    netWeightKg: 10978,
    netWeightQuintals: 109.78,
    vehicleNumber: 'PB-08-AG-4921',
    driverName: 'Harpreet Singh',
    weighmanName: 'Suresh Chandra (Certified Weighbridge Master)',
    timestamp: '16 Sep 2026, 11:42 AM',
  };

  const quality = slipBooking.qualityMetrics || {
    grade: 'Grade-A Prime (Fair Average Quality)',
    moisturePercentage: 13.8,
    foreignMatterPercentage: 0.6,
    approvedQuantityQuintals: 109.78,
    rejectionReason: undefined,
    inspectorName: 'Dr. Ananya Ray, Senior Quality Analyst',
    timestamp: '16 Sep 2026, 12:05 PM',
    remarks: 'Grain luster excellent, moisture well within 14.0% statutory threshold.',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Bar with Print & Listen */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {tD('govCertifiedDoc')}
          </span>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            {tD('officialWeighQualityCert')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => speakText(`Weigh slip number ${weigh.slipNumber}. Net weight certified is ${weigh.netWeightQuintals} Quintals. Quality Grade A approved.`)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">{tD('readAloud')}</span>
          </button>
          <button
            onClick={() => openPrintModal('weigh-slip', slipBooking, true)}
            id="print-official-weigh-slip-btn"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{tD('printOfficialSlip')}</span>
          </button>
        </div>
      </div>

      {/* Official Government Printable Document Card */}
      <div className="bg-white text-slate-900 border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-md relative print:shadow-none print:border-none">
        {/* Document Watermark Emblems */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900">
              <Building2 className="w-6 h-6 text-emerald-700" />
              <span className="font-extrabold text-sm tracking-tight uppercase">
                {tD('ministryTitle')}
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              {tD('digitalWeighRecordCert')}
            </h2>
            <p className="text-[11px] text-slate-600 font-medium">
              {tD('issuedUnderAct')}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">{tD('certificateNo')}</span>
            <span className="font-mono font-black text-sm text-slate-900">{weigh.slipNumber}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{(weigh as any).timestamp || (weigh as any).weighedAt || '10:45 AM'}</span>
          </div>
        </div>

        {/* Farmer and Lot Information */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block">{tD('farmerNameLabel')}</span>
            <span className="font-bold text-slate-900">{slipBooking.farmerName}</span>
            <span className="text-[10px] text-slate-500 font-mono block">ID: {currentUser?.identifier || 'PB-FARM-90214'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">{tD('cropVarietyLabel')}</span>
            <span className="font-bold text-slate-900">{localizeCrop(slipBooking.crop)}</span>
            <span className="text-[10px] text-emerald-700 font-semibold block">{tD('mspLotLabel')} #KNL-902</span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">{tD('procurementCentreLabel')}</span>
            <span className="font-bold text-slate-900">{localizeMandi(slipBooking.centreName)}</span>
            <span className="text-[10px] text-slate-500 block">{tD('bayWeighbridge')}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">{tD('vehicleTrailerLabel')}</span>
            <span className="font-mono font-bold text-slate-900">{weigh.vehicleNumber}</span>
            <span className="text-[10px] text-slate-500 block">{tD('driverLabel')}: {(weigh as any).driverName || 'Designated Driver'}</span>
          </div>
        </div>

        {/* Certified Weighment Calculations */}
        <div className="py-4 border-b border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>{tD('certifiedWeighbridgeMeasurement')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px] font-medium block">{tD('grossVehicleWeight')}</span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                {weigh.grossWeightKg.toLocaleString()} <span className="text-xs font-normal text-slate-600">kg</span>
              </div>
              <span className="text-[10px] text-slate-400">{tD('truckTrailerProduce')}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px] font-medium block">{tD('tareUnloadedWeight')}</span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                {weigh.tareWeightKg.toLocaleString()} <span className="text-xs font-normal text-slate-600">kg</span>
              </div>
              <span className="text-[10px] text-slate-400">{tD('emptyVehicleTare')}</span>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border-2 border-emerald-600">
              <span className="text-emerald-800 text-[11px] font-bold block">{tD('netCertifiedProduce')}</span>
              <div className="text-2xl font-black font-mono text-emerald-950 mt-1">
                {weigh.netWeightQuintals} <span className="text-xs font-normal text-emerald-800">{tD('quintalsUnit', 'Quintals')}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                (= {weigh.netWeightKg.toLocaleString()} kg)
              </span>
            </div>
          </div>
        </div>

        {/* Quality Analysis Lab Report */}
        <div className="py-4 border-b border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{tD('officialQualityTestingResults')}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px] block">{tD('certifiedGrade')}</span>
              <span className="font-bold text-slate-900 block mt-0.5">{quality.grade}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px] block">{tD('moistureContent')}</span>
              <span className="font-bold text-emerald-700 text-sm block mt-0.5">{quality.moisturePercentage}%</span>
              <span className="text-[10px] text-slate-400">{tD('permissibleMoisture')}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px] block">{tD('foreignInclusions')}</span>
              <span className="font-bold text-emerald-700 text-sm block mt-0.5">{quality.foreignMatterPercentage}%</span>
              <span className="text-[10px] text-slate-400">{tD('permissibleForeign')}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[11px] block">{tD('lotAcceptance')}</span>
              <span className="font-bold text-emerald-700 text-sm block mt-0.5">{tD('approvedHundred')}</span>
              <span className="text-[10px] text-slate-400">{tD('zeroDeduction')}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 mt-2 italic">
            Quality Analyst Remark: "{quality.remarks}"
          </p>
        </div>

        {/* Verification Seals & Signatures */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white p-1 rounded border border-slate-300 flex items-center justify-center">
              <QrIcon className="w-14 h-14 text-slate-900" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">NIC / AgriBridge Cryptographic Hash:</span>
              <span className="font-mono text-[10px] text-slate-700 max-w-xs break-all block">
                SHA256:7f8a92...e1b092c44
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                {tD('digitallyTamperProof')}
              </span>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-serif italic text-slate-800 text-sm">
              {tD('digitallySigned')}
            </div>
            <div className="font-bold text-slate-900 mt-0.5">
              {(weigh as any).weighmanName || (weigh as any).weighbridgeOperator || 'Authorized Weighman'}
            </div>
            <div className="text-[10px] text-slate-500">
              {tD('authorizedWeighmaster')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
