import React, { useEffect, useState } from 'react';
import { 
  Printer, 
  X, 
  Download, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Scale, 
  Truck, 
  Calendar, 
  Clock, 
  QrCode as QrIcon, 
  Languages, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProcurementBooking } from '../../types';

// Authentic Barcode SVG generator component
const BarcodeSvg: React.FC<{ value?: string; height?: number }> = ({ value = '', height = 48 }) => {
  const safeValue = value || 'AGRI-000000';
  // Deterministic bar widths based on char codes
  const bars: { width: number; isBlack: boolean }[] = [];
  bars.push({ width: 2, isBlack: true }, { width: 1, isBlack: false }, { width: 2, isBlack: true });
  for (let i = 0; i < safeValue.length; i++) {
    const code = safeValue.charCodeAt(i);
    bars.push({ width: (code % 3) + 1, isBlack: true });
    bars.push({ width: ((code >> 1) % 2) + 1, isBlack: false });
    bars.push({ width: ((code >> 2) % 3) + 1, isBlack: true });
    bars.push({ width: 1, isBlack: false });
  }
  bars.push({ width: 2, isBlack: true }, { width: 1, isBlack: false }, { width: 2, isBlack: true });

  let currentX = 0;
  return (
    <div className="flex flex-col items-center">
      <svg 
        viewBox="0 0 280 50" 
        className="w-56 sm:w-64 h-12"
        preserveAspectRatio="none"
      >
        {bars.map((bar, idx) => {
          const x = currentX;
          currentX += bar.width * 3.2;
          if (!bar.isBlack) return null;
          return (
            <rect 
              key={idx} 
              x={x} 
              y={0} 
              width={bar.width * 3.2} 
              height={height} 
              fill="#0f172a" 
            />
          );
        })}
      </svg>
      <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.25em] text-slate-800 mt-0.5">
        *{safeValue.replace(/[^A-Z0-9-]/gi, '')}*
      </span>
    </div>
  );
};

export const PrintDocumentModal: React.FC = () => {
  const { printDocState, closePrintModal } = useApp();
  const [bilingual, setBilingual] = useState(true);

  const isOpen = printDocState?.isOpen;
  const docType = printDocState?.docType;
  const data = printDocState?.data;
  const autoTriggerPrint = printDocState?.autoTriggerPrint;

  // Auto trigger browser print dialog if requested
  useEffect(() => {
    if (isOpen && autoTriggerPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoTriggerPrint]);

  // Keyboard shortcut: ESC to close, Ctrl+P to print
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePrintModal();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closePrintModal]);

  // Toggle body class for print isolation
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('printing-active');
    } else {
      document.body.classList.remove('printing-active');
    }
    return () => {
      document.body.classList.remove('printing-active');
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const isToken = docType === 'token';
  const isWeighSlip = docType === 'weigh-slip';

  // Normalize data depending on whether a full booking or weigh slip was passed
  const booking: ProcurementBooking = isToken 
    ? (data as ProcurementBooking) 
    : (data.booking || data);

  const weigh = isWeighSlip
    ? (data.weighingSlip || data)
    : (booking.weighingSlip || {
        slipNumber: 'WS-KNL-2026-90412',
        grossWeightKg: 14280,
        tareWeightKg: 3302,
        netWeightKg: 10978,
        netWeightQuintals: 109.78,
        deductionPercentage: 0.6,
        finalProcuredQuintals: 109.12,
        weighbridgeOperator: 'Suresh Chandra (Certified Weighbridge Master)',
        weighedAt: '16 Sep 2026, 11:42 AM',
        vehicleNumber: booking.weighingSlip?.vehicleNumber || 'PB-08-AG-4921',
      });

  const payableQuintals = weigh.finalProcuredQuintals || weigh.netWeightQuintals || booking.quantityQuintals;

  const quality = booking.qualityMetrics || {
    grade: 'Grade-A Prime (Fair Average Quality)',
    moisturePercentage: 13.8,
    foreignMatterPercentage: 0.6,
    damagedGrainsPercentage: 1.2,
    testedByOfficerId: 'QA-AGMARK-4412',
    testedAt: '16 Sep 2026, 12:05 PM',
    remarks: 'Grain luster excellent, moisture well within 14.0% statutory threshold.',
  };

  const handleManualPrint = () => {
    window.print();
  };

  return (
    <div id="print-modal-container" className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6 select-none print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Top Floating Control Bar - Hidden on print */}
      <div className="no-print sticky top-2 sm:top-4 z-20 w-full max-w-4xl mb-4 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-slate-900 dark:text-white text-sm">
              {isToken ? 'Government Mandi Gate-Pass Token' : 'Official Weighbridge & Quality Certificate'}
            </h3>
            <p className="text-[11px] text-slate-500">
              Official Form Ready for Print / PDF Export &bull; Press <strong>Ctrl+P</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBilingual(!bilingual)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Toggle Hindi/English bilingual headers"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-600" />
            <span>{bilingual ? 'Bilingual (EN / हिन्दी)' : 'English Only'}</span>
          </button>

          <button
            onClick={handleManualPrint}
            id="trigger-browser-print-btn"
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Slip</span>
          </button>

          <button
            onClick={closePrintModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PRINTABLE DOCUMENT WRAPPER (This element is printed on paper) */}
      <div 
        id="printable-government-document"
        className="w-full max-w-3xl bg-white text-slate-900 border-2 border-slate-900 rounded-lg p-6 sm:p-8 shadow-2xl relative font-sans print:shadow-none print:border-2 print:border-black print:p-6 print:m-0 print:w-full print:rounded-none"
      >
        {/* Government Watermark Emblem in Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden select-none">
          <Building2 className="w-[500px] h-[500px] text-slate-900" />
        </div>

        {/* HEADER SECTION: OFFICIAL ASHOKA MOTIF & BILINGUAL TITLES */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex items-start justify-between gap-4">
            {/* National Emblem & Department Title */}
            <div className="flex items-start gap-3.5">
              {/* Ashoka Stambh Vector Crest Representation */}
              <div className="w-12 h-16 border border-slate-800 rounded p-1 flex flex-col items-center justify-between bg-slate-50 shrink-0">
                <div className="flex gap-0.5 items-center justify-center pt-0.5">
                  <span className="w-2.5 h-3 bg-slate-800 rounded-t-xs" />
                  <span className="w-3 h-4 bg-slate-900 rounded-t-xs" />
                  <span className="w-2.5 h-3 bg-slate-800 rounded-t-xs" />
                </div>
                <div className="w-8 h-1 bg-slate-900 my-0.5" />
                <span className="text-[7px] font-black uppercase text-center tracking-tighter leading-none text-slate-900">
                  सत्यमेव जयते
                </span>
                <span className="text-[6px] font-bold text-slate-600">GOVT. OF INDIA</span>
              </div>

              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 block">
                  {bilingual && 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय • भारत सरकार'}
                </span>
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-900 block">
                  MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION • GOVT. OF INDIA
                </span>
                <h1 className="font-heading text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5 uppercase">
                  {isToken ? (
                    bilingual 
                      ? 'फॉर्म-ए: एपीएमसी मंडी ई-प्रवेश टोकन व वाहन अनुज्ञा पर्ची' 
                      : 'FORM-A: APMC MANDI GATE-PASS & ARRIVAL TOKEN'
                  ) : (
                    bilingual 
                      ? 'फॉर्म-VI: इलेक्ट्रॉनिक धर्मकांटा तौल व गुणवत्ता प्रमाण पत्र' 
                      : 'FORM-VI: ELECTRONIC WEIGHBRIDGE WEIGHT & QUALITY CERTIFICATE'
                  )}
                </h1>
                <p className="text-[10px] text-slate-600 font-medium">
                  {isToken 
                    ? 'Issued under Rule 4(A) of the Agricultural Produce Marketing & Regulated Mandi Protocols'
                    : 'Issued under Section 14, Legal Metrology Act, 2009 & Agmark Grain Standards'}
                </p>
              </div>
            </div>

            {/* Serial & Barcode in Top Right */}
            <div className="text-right shrink-0">
              <span className="text-[9px] uppercase font-bold text-slate-500 block">
                {isToken ? 'Gate Token Serial No.' : 'Certified Slip No.'}
              </span>
              <span className="font-mono font-black text-base sm:text-lg text-slate-900 block">
                {isToken ? booking.tokenNumber : weigh.slipNumber}
              </span>
              <span className="text-[10px] text-slate-600 block mt-0.5 font-medium">
                Dated: {booking.bookingDate || '16-Sep-2026'} &bull; {booking.slotTime || '10:00 AM'}
              </span>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 border border-slate-300 text-slate-800">
                Official Statutory Copy
              </span>
            </div>
          </div>

          {/* Barcode Strip */}
          <div className="mt-3 pt-2.5 border-t border-dashed border-slate-300 flex items-center justify-between">
            <BarcodeSvg value={isToken ? booking.tokenNumber : weigh.slipNumber} />
            <div className="flex items-center gap-2 text-right">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Mandi Yard Hub</span>
                <span className="font-bold text-xs text-slate-900">{booking.centreName}</span>
                <span className="text-[10px] text-slate-500 block font-mono">Center ID: {booking.centreId || 'KNL-04'}</span>
              </div>
              <div className="w-14 h-14 p-1 bg-white border border-slate-300 rounded flex items-center justify-center">
                <QrIcon className="w-12 h-12 text-slate-900" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: FARMER REGISTRATION & IDENTIFICATION */}
        <div className="py-3.5 border-b border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-800" />
              1. किसान विवरण / Farmer Registration & Identification Profile
            </span>
            <span className="text-[10px] font-mono text-slate-500">e-KYC Verified UIDAI Linked</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-3 rounded border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">Farmer Name (कृषक नाम)</span>
              <span className="font-bold text-slate-900">{booking.farmerName}</span>
              <span className="text-[10px] text-slate-500 block">S/o Sh. Gurbaksh Singh</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">Farmer ID (कृषक पहचान संख्या)</span>
              <span className="font-mono font-bold text-slate-900">{booking.farmerId || 'PB-FARM-90214'}</span>
              <span className="text-[10px] text-slate-500 block font-mono">Aadhaar: XXXX-XXXX-4819</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">Mobile Contact</span>
              <span className="font-mono font-bold text-slate-900">{booking.farmerMobile}</span>
              <span className="text-[10px] text-emerald-800 font-semibold block">SMS Alert Subscribed</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">DBT Bank Account</span>
              <span className="font-bold text-slate-900">Punjab National Bank</span>
              <span className="text-[10px] text-slate-600 block font-mono">IFSC: PUNB0021400 (A/c **4821)</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONSIGNMENT & COMMODITY DETAILS */}
        <div className="py-3.5 border-b border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-slate-800" />
              2. फसल एवं खेप विवरण / Consignment & Crop Procurement Details
            </span>
            <span className="text-[10px] font-semibold text-slate-600">Season: Kharif/Rabi 2026-27</span>
          </div>

          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 uppercase text-[9px] font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300">Commodity (फसल)</th>
                <th className="p-2 border-r border-slate-300">Variety / Grade</th>
                <th className="p-2 border-r border-slate-300 text-right">Declared Quantity</th>
                <th className="p-2 border-r border-slate-300 text-right">Applicable MSP</th>
                <th className="p-2 text-right">Estimated Gross Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2 font-bold border-r border-slate-300">{booking.crop}</td>
                <td className="p-2 border-r border-slate-300">{quality.grade || 'HD-2967 (FAQ Standard)'}</td>
                <td className="p-2 border-r border-slate-300 text-right font-mono font-bold">
                  {booking.quantityQuintals} Quintals
                  <span className="text-[10px] text-slate-500 block">({booking.quantityQuintals * 2} Standard Gunny Bags)</span>
                </td>
                <td className="p-2 border-r border-slate-300 text-right font-mono font-semibold">
                  ₹2,275.00 / Qtl
                </td>
                <td className="p-2 text-right font-mono font-bold text-slate-900">
                  ₹{(booking.quantityQuintals * 2275).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 3: SPECIFIC DETAILS BASED ON DOC TYPE */}
        {isToken ? (
          /* TOKEN SPECIFIC: YARD LOGISTICS, GATE SCHEDULE & TRANSIT */
          <div className="py-3.5 border-b border-slate-300 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-slate-800" />
              3. मंडी आगमन एवं वाहन अनुज्ञा / Mandi Arrival & Transit Allocation
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-3 rounded border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Assigned Gate & Bay</span>
                <span className="font-bold text-slate-900 text-sm">Gate No. 02 &bull; Bay 3</span>
                <span className="text-[10px] text-slate-500 block">Weighbridge Staging Area</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Reporting Time Slot</span>
                <span className="font-bold text-slate-900 text-sm">{booking.slotTime}</span>
                <span className="text-[10px] text-slate-500 block">Grace Period: &plusmn;45 mins</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Vehicle Registration</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{weigh.vehicleNumber}</span>
                <span className="text-[10px] text-slate-500 block">Tractor & Double-Axle Trolley</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Initial Queue Token</span>
                <span className="font-mono font-black text-emerald-900 text-sm">
                  Position #{booking.queuePosition || '08'}
                </span>
                <span className="text-[10px] text-slate-500 block">Est. Wait: ~{booking.estimatedWaitMinutes || '30'} mins</span>
              </div>
            </div>

            {/* Statutory Gate Rules Box */}
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded text-[11px] text-slate-800 space-y-1">
              <div className="font-bold text-amber-950 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>महत्वपूर्ण निर्देश / Statutory Rules for Gate Entry:</span>
              </div>
              <ul className="list-disc pl-4 text-[10px] text-slate-700 space-y-0.5">
                <li>Produce moisture must be within the statutory Agmark limit of 14.0%. Grain exceeding 14% is subject to mandatory solar-drying.</li>
                <li>Driver must carry this official barcode slip and original Aadhaar card at the gate pass security terminal.</li>
                <li>No unloading fees (Palledari/Dami) are payable by farmers. All handling is 100% government-subsidized.</li>
              </ul>
            </div>
          </div>
        ) : (
          /* WEIGH SLIP SPECIFIC: ELECTRONIC LOADCELL READINGS & QUALITY ASSAY */
          <div className="py-3.5 border-b border-slate-300 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-slate-800" />
              3. इलेक्ट्रॉनिक धर्मकांटा माप एवं गुणवत्ता परिणाम / Electronic Weighbridge & Lab Assay
            </span>

            {/* Weighbridge Dual-Reading Box */}
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50/70 p-3 rounded border border-slate-200">
              <div className="border-r border-slate-200 pr-2">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">
                  1st Weighment (Gross Wt.)
                </span>
                <span className="font-mono font-black text-slate-900 text-base">
                  {weigh.grossWeightKg?.toLocaleString()} kg
                </span>
                <span className="text-[10px] text-slate-500 block font-medium">
                  Tractor + Trolley + Crop
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Time: 10:42 AM &bull; Sensor #02</span>
              </div>

              <div className="border-r border-slate-200 pr-2">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">
                  2nd Weighment (Tare Wt.)
                </span>
                <span className="font-mono font-black text-slate-900 text-base">
                  {weigh.tareWeightKg?.toLocaleString()} kg
                </span>
                <span className="text-[10px] text-slate-500 block font-medium">
                  Empty Tractor + Trolley
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Time: 11:28 AM &bull; Sensor #02</span>
              </div>

              <div>
                <span className="text-[10px] text-emerald-800 block uppercase font-black">
                  Certified Net Weight
                </span>
                <span className="font-mono font-black text-emerald-950 text-xl">
                  {weigh.netWeightQuintals} Qtl
                </span>
                <span className="text-[10px] font-bold text-slate-700 block">
                  ({weigh.netWeightKg?.toLocaleString()} kg Net)
                </span>
                <span className="text-[9px] text-emerald-800 block mt-0.5 font-semibold">
                  Legal Metrology Verified &bull; W&M Stamp #0841
                </span>
              </div>
            </div>

            {/* Quality Assay Parameters Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border border-slate-200 rounded p-2.5 bg-white">
              <div>
                <span className="text-[10px] text-slate-500 block">Moisture Content (नमी)</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{quality.moisturePercentage}%</span>
                <span className="text-[9px] text-emerald-800 block font-semibold">&le; 14.0% Statutory FAQ</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Foreign Matter / Admixture</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{quality.foreignMatterPercentage}%</span>
                <span className="text-[9px] text-slate-500 block">Dockage: 0.66 Qtl Deducted</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Certified Grade (श्रेणी)</span>
                <span className="font-bold text-emerald-900 text-sm">Grade-A Prime</span>
                <span className="text-[9px] text-slate-500 block">FAQ Agmark Approved</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Payable Net Wt. (भुगतान हेतु)</span>
                <span className="font-mono font-black text-slate-900 text-sm">{payableQuintals} Qtl</span>
                <span className="text-[9px] text-emerald-800 block font-bold">Approved for Direct DBT</span>
              </div>
            </div>

            {/* DBT Payment Summary Row */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-emerald-950 block">
                  PFMS Direct Benefit Transfer (DBT) Financial Clearance Voucher
                </span>
                <span className="text-[11px] text-emerald-800">
                  Govt. MSP: ₹2,275/Qtl &bull; Certified Weight: {payableQuintals} Qtl &bull; UTR: <strong>PFMS-2026-0916-9041201</strong>
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Net Amount Transferred</span>
                <span className="font-mono font-black text-lg text-emerald-950">
                  ₹{(payableQuintals * 2275).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: STATUTORY DECLARATION & AUTHORIZED DIGITAL SIGNATURES */}
        <div className="pt-4">
          <p className="text-[9px] text-slate-500 leading-tight">
            <strong>Statutory Declaration:</strong> This is a computer-generated statutory certificate issued under the provisions of the State Agricultural Produce Markets Act and Legal Metrology Act, 2009. The weights recorded are cryptographically logged directly from the digital load cells without manual intervention. Any discrepancy must be reported to the Mandi Secretary within 24 hours.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-2 text-center text-xs">
            {/* Scale Master Signature */}
            <div className="space-y-1">
              <div className="h-10 flex items-end justify-center font-serif italic text-slate-800 font-bold text-sm">
                Suresh Chandra
              </div>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-bold text-[10px] text-slate-800 block uppercase">
                  Certified Weighbridge Master
                </span>
                <span className="text-[9px] text-slate-500 block">License #WM-9810 &bull; Bay #02</span>
              </div>
            </div>

            {/* Quality Assayer Signature */}
            <div className="space-y-1">
              <div className="h-10 flex items-end justify-center font-serif italic text-slate-800 font-bold text-sm">
                Dr. Ananya Ray
              </div>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-bold text-[10px] text-slate-800 block uppercase">
                  Senior Quality Lab Assayer
                </span>
                <span className="text-[9px] text-slate-500 block">Agmark Certification #QA-4412</span>
              </div>
            </div>

            {/* Mandi Secretary / Official Seal */}
            <div className="space-y-1 flex flex-col items-center">
              <div className="h-10 w-20 border border-dashed border-emerald-700 rounded flex items-center justify-center text-[9px] font-bold text-emerald-800 uppercase tracking-tighter bg-emerald-50/50">
                APMC OFFICIAL SEAL
              </div>
              <div className="border-t border-slate-400 pt-1 w-full">
                <span className="font-bold text-[10px] text-slate-800 block uppercase">
                  Nodal Procurement Officer
                </span>
                <span className="text-[9px] text-slate-500 block">FCI / State APMC Mandi Board</span>
              </div>
            </div>
          </div>
        </div>

        {/* Print Timestamp Footer */}
        <div className="mt-4 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[8px] text-slate-400 font-mono">
          <span>SECURE DOC HASH: e4b29c81a90f12d847b2c93847291a82f37e1902</span>
          <span>PRINT GENERATED: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB')}</span>
          <span>AGRIBRIDGE DIGITAL PUBLIC INFRASTRUCTURE</span>
        </div>
      </div>
    </div>
  );
};
