import React from 'react';
import { 
  X, 
  Printer, 
  Volume2, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Clock, 
  CreditCard, 
  ShoppingBag, 
  ShieldCheck,
  Scale,
  QrCode as QrIcon,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProcurementBooking, MarketplaceListing, ComplaintTicket, PaymentDetails } from '../../types';

export const RightDetailDrawer: React.FC = () => {
  const { 
    drawerState, 
    closeDetailDrawer, 
    speakText, 
    approveProcurement, 
    rejectProcurement, 
    processPaymentForBooking,
    currentUser,
    createMarketplaceOrder,
    openPrintModal,
  } = useApp();

  if (!drawerState.isOpen || !drawerState.data) {
    return null;
  }

  const { type, data } = drawerState;

  const handlePrint = (docType: 'token' | 'weigh-slip' = 'token') => {
    openPrintModal(docType, data, true);
  };

  const renderBookingDrawer = (booking: ProcurementBooking) => {
    const isOfficer = currentUser?.role === 'officer' || currentUser?.role === 'admin';
    const isFarmer = currentUser?.role === 'farmer';

    return (
      <div className="space-y-6">
        {/* Token Header Banner */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Token Number
            </span>
            <div className="text-2xl font-black font-mono text-emerald-950">
              {booking.tokenNumber}
            </div>
          </div>
          <button
            onClick={() => speakText(`Your token is ${booking.tokenNumber}. Status is ${booking.status}. Quantity is ${booking.quantityQuintals} Quintals.`)}
            className="w-10 h-10 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 flex items-center justify-center shadow-xs transition-colors"
            title="Read Booking Details"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Current Queue Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-medium">Queue Position</span>
            <span className="font-heading text-xl font-bold text-slate-900">
              {booking.queuePosition ? `#${booking.queuePosition}` : 'Processing'}
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-medium">Est. Waiting Time</span>
            <span className="font-heading text-xl font-bold text-slate-900">
              {booking.estimatedWaitMinutes ? `${booking.estimatedWaitMinutes} mins` : 'Immediate'}
            </span>
          </div>
        </div>

        {/* Core Booking Fields */}
        <div className="space-y-3 divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 font-medium">Farmer Name</span>
            <span className="font-bold text-slate-900">{booking.farmerName}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 font-medium">Farmer Mobile</span>
            <span className="font-mono text-slate-800">{booking.farmerMobile}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 font-medium">Crop & Variety</span>
            <span className="font-bold text-emerald-800">{booking.crop}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 font-medium">Allocated Quantity</span>
            <span className="font-bold text-slate-900">{booking.quantityQuintals} Quintals</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 font-medium">Procurement Centre</span>
            <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">
              {booking.centreName}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 font-medium">Scheduled Slot</span>
            <span className="font-medium text-slate-800">{booking.bookingDate}, {booking.slotTime}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 font-medium">Current Workflow Stage</span>
            <span className="uppercase font-bold text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
              {booking.status ? String(booking.status).replace(/_/g, ' ') : 'N/A'}
            </span>
          </div>
        </div>

        {/* QR Code Verification Preview */}
        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center text-center">
          <div className="w-28 h-28 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center">
            <QrIcon className="w-24 h-24 text-slate-800" />
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-600 mt-2">
            Digital Token Verifiable QR
          </span>
          <span className="text-[10px] text-slate-400 max-w-xs break-all mt-0.5">
            {booking.qrPayload}
          </span>
        </div>

        {/* Weighing Slip details if recorded */}
        {booking.weighingSlip && (
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-sky-700" /> Weighbridge Record
              </span>
              <span className="font-mono text-[11px] font-bold text-sky-800">{booking.weighingSlip.slipNumber}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
              <div>Gross: <span className="font-semibold text-slate-900">{booking.weighingSlip.grossWeightKg} kg</span></div>
              <div>Tare: <span className="font-semibold text-slate-900">{booking.weighingSlip.tareWeightKg} kg</span></div>
              <div>Net: <span className="font-bold text-sky-950 font-heading">{booking.weighingSlip.netWeightQuintals} Qtl</span></div>
              <div>Vehicle: <span className="font-mono text-slate-900">{booking.weighingSlip.vehicleNumber}</span></div>
            </div>
          </div>
        )}

        {/* Quality Test details if recorded */}
        {booking.qualityMetrics && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Quality Lab Clearance
              </span>
              <span className="font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">{booking.qualityMetrics.grade}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
              <div>Moisture: <span className="font-bold text-slate-900">{booking.qualityMetrics.moisturePercentage}%</span></div>
              <div>Foreign Matter: <span className="font-bold text-slate-900">{booking.qualityMetrics.foreignMatterPercentage}%</span></div>
            </div>
            <p className="text-[11px] text-slate-600 italic">
              "{booking.qualityMetrics.remarks}"
            </p>
          </div>
        )}

        {/* Actions for Officer / Admin */}
        {isOfficer && (
          <div className="pt-3 border-t border-slate-200 space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Officer Administrative Overrides
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  approveProcurement(booking.id);
                  closeDetailDrawer();
                }}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-colors shadow-2xs"
              >
                Approve Lot
              </button>
              <button
                onClick={() => {
                  rejectProcurement(booking.id, 'High moisture reading > 18%');
                  closeDetailDrawer();
                }}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors shadow-2xs"
              >
                Reject Lot
              </button>
            </div>
            {booking.status === 'approved' && (
              <button
                onClick={() => {
                  processPaymentForBooking(booking.id);
                  closeDetailDrawer();
                }}
                className="w-full px-3 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <CreditCard className="w-4 h-4" /> Trigger Direct DBT Payment
              </button>
            )}
          </div>
        )}

        {/* Official Print Documentation Actions */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Official Government Documentation
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handlePrint('token')}
              id="drawer-print-token-btn"
              className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 font-bold text-xs text-emerald-950 flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Print Gate Pass</span>
            </button>

            {booking.weighingSlip && (
              <button
                onClick={() => handlePrint('weigh-slip')}
                id="drawer-print-weighslip-btn"
                className="py-2.5 px-3 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 font-bold text-xs text-sky-950 flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Scale className="w-4 h-4 text-sky-700" />
                <span>Print Weigh Slip</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentDrawer = (payment: PaymentDetails) => (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
          Net Disbursed Amount
        </span>
        <div className="font-heading text-3xl font-black text-emerald-950 mt-1">
          ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-bold bg-white text-emerald-800 border border-emerald-300">
          {payment.status}
        </span>
      </div>

      <div className="space-y-3 divide-y divide-slate-100 text-xs">
        <div className="flex items-center justify-between pt-2">
          <span className="text-slate-500">Transaction Reference ID</span>
          <span className="font-mono font-bold text-slate-900">{payment.transactionId}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-slate-500">Payment Date</span>
          <span className="font-medium text-slate-800">{payment.paymentDate}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-slate-500">Payment Gateway / System</span>
          <span className="font-medium text-slate-800">{payment.method}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-slate-500">Beneficiary Bank</span>
          <span className="font-medium text-slate-800">{payment.bankName}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-slate-500">Account Ending</span>
          <span className="font-mono font-bold text-slate-800">{payment.accountEnding}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-slate-500">Procurement MSP Rate</span>
          <span className="font-bold text-emerald-800">₹{payment.mspRatePerQuintal} / Quintal</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-slate-500">RBI / PFMS Reference</span>
          <span className="font-mono text-slate-700">{payment.referenceNo}</span>
        </div>
      </div>

      <button
        onClick={() => handlePrint('weigh-slip')}
        id="drawer-print-dbt-slip-btn"
        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
      >
        <Printer className="w-4 h-4" /> Print Form-VI Weigh & DBT Voucher
      </button>
    </div>
  );

  const renderCropDrawer = (listing: MarketplaceListing) => {
    return (
      <div className="space-y-6">
        <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 bg-slate-100">
          <img
            src={listing.imageUrl}
            alt={listing.crop}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {listing.category}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-slate-900">{listing.crop}</h3>
            <span className="font-heading text-lg font-black text-emerald-800">
              ₹{listing.pricePerQuintal} <span className="text-xs font-normal text-slate-500">/ Qtl</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        <div className="space-y-2.5 divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between pt-1.5">
            <span className="text-slate-500">Farmer / Supplier</span>
            <span className="font-bold text-slate-900">{listing.farmerName}</span>
          </div>
          <div className="flex items-center justify-between pt-1.5">
            <span className="text-slate-500">Farm Location</span>
            <span className="font-medium text-slate-800">{listing.location}</span>
          </div>
          <div className="flex items-center justify-between pt-1.5">
            <span className="text-slate-500">Surplus Available</span>
            <span className="font-bold text-slate-900">{listing.quantityQuintals} Quintals</span>
          </div>
          <div className="flex items-center justify-between pt-1.5">
            <span className="text-slate-500">Harvest / Curing Info</span>
            <span className="text-slate-800">{listing.harvestDate}</span>
          </div>
          <div className="flex items-center justify-between pt-1.5">
            <span className="text-slate-500">Verification Status</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> FPO Verified Lot
            </span>
          </div>
        </div>

        {currentUser?.role === 'buyer' && (
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                createMarketplaceOrder(listing.id, Math.min(20, listing.quantityQuintals), listing.pricePerQuintal, 'Tomorrow, 10:00 AM');
                closeDetailDrawer();
              }}
              className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingBag className="w-4 h-4" /> Procure Lot
            </button>
            <button
              onClick={() => {
                alert(`Offer of ₹${listing.pricePerQuintal - 100}/Qtl submitted to farmer ${listing.farmerName}`);
                closeDetailDrawer();
              }}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 transition-colors"
            >
              Counter Offer
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderComplaintDrawer = (complaint: ComplaintTicket) => (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Grievance Ticket</span>
        <div className="text-xl font-bold font-mono text-amber-950">
          {complaint.ticketNo}
        </div>
        <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900">
          {complaint.status}
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <span className="text-slate-400 font-medium block">Category</span>
          <span className="font-bold text-slate-900 text-sm">{complaint.category}</span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Description</span>
          <p className="mt-1 p-3 rounded-xl bg-slate-50 text-slate-700 leading-relaxed border border-slate-200/80">
            {complaint.description}
          </p>
        </div>
        {complaint.resolutionNote && (
          <div>
            <span className="text-emerald-800 font-bold block">Resolution Action</span>
            <p className="mt-1 p-3 rounded-xl bg-emerald-50 text-emerald-950 leading-relaxed border border-emerald-200">
              {complaint.resolutionNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-2xs transition-opacity"
        onClick={closeDetailDrawer}
      />

      {/* Slide-in Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-black shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-black">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Quick Detail Drawer
              </span>
            </div>
            <button
              onClick={closeDetailDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {type === 'booking' && renderBookingDrawer(data)}
            {type === 'payment' && renderPaymentDrawer(data)}
            {type === 'crop' && renderCropDrawer(data)}
            {type === 'complaint' && renderComplaintDrawer(data)}
            {type === 'queue' && renderBookingDrawer(data)}
          </div>
        </div>
      </div>
    </div>
  );
};
