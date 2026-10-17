import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Download, 
  Clock, 
  FileText,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_CROPS } from '../../data/mockData';

export const OfficerPaymentsView: React.FC = () => {
  const { currentUser, bookings, centres, processPaymentForBooking, openDetailDrawer } = useApp();
  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];
  const centreBookings = bookings.filter(b => b.centreId === currentCentre.id);

  const [paymentSuccess, setPaymentSuccess] = useState<string>('');

  const eligibleForPayment = centreBookings.filter(b => b.status === 'approved');
  const paidBookings = centreBookings.filter(b => b.status === 'paid');

  const handleApproveBatchPayout = () => {
    if (eligibleForPayment.length === 0) return;
    eligibleForPayment.forEach(b => {
      processPaymentForBooking(b.id);
    });
    setPaymentSuccess(`PFMS Digital Signature Certificate applied! Released DBT credits for ${eligibleForPayment.length} farmers directly to Aadhaar-linked accounts.`);
    setTimeout(() => setPaymentSuccess(''), 5000);
  };

  const handlePaySingle = (bookingId: string) => {
    processPaymentForBooking(bookingId);
    setPaymentSuccess('DBT Direct Bank Transfer order transmitted to PFMS / e-Kuber gateway.');
    setTimeout(() => setPaymentSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
              Direct Benefit Transfer (DBT) & PFMS Nodal Terminal
            </span>
            <span className="text-xs text-slate-400">&bull; Officer DSC: <strong className="text-slate-700">Valid Class-3 Gov Token</strong></span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Farmer Payment Disbursals & Treasury Release
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Approve authenticated MSP payouts directly into Aadhaar-linked bank accounts via PFMS
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleApproveBatchPayout}
            disabled={eligibleForPayment.length === 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xs flex items-center gap-2 transition-all ${
              eligibleForPayment.length === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign & Release All ({eligibleForPayment.length} Lots)</span>
          </button>
        </div>
      </div>

      {paymentSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{paymentSuccess}</span>
        </div>
      )}

      {/* Aggregate DBT Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ready for Disbursal</span>
          <div className="font-heading text-2xl font-black text-amber-700 mt-1">
            {eligibleForPayment.length} Approved Lots
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">Awaiting officer DSC sign-off</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">DBT Credited Today</span>
          <div className="font-heading text-2xl font-black text-emerald-800 mt-1">
            ₹28,74,200
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">48-Hour DBT Mandate: 100% On Time</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">PFMS Gateway Status</span>
          <div className="font-heading text-xl font-black text-slate-900 mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>OPERATIONAL (0.2s)</span>
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">Direct link to RBI e-Kuber</span>
        </div>
      </div>

      {/* Ready for Release Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-700" />
              <span>Weighed Consignments Pending PFMS Payment Authorization</span>
            </h3>
            <p className="text-xs text-slate-500">Calculate net payout based on official minimum support prices</p>
          </div>
        </div>

        {eligibleForPayment.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            All weighed and inspected lots have already been disbursed through DBT!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="pb-3 pr-3">Token</th>
                  <th className="pb-3 pr-3">Farmer & Bank Account</th>
                  <th className="pb-3 pr-3">Crop</th>
                  <th className="pb-3 pr-3">Net Qty</th>
                  <th className="pb-3 pr-3">Govt MSP Rate</th>
                  <th className="pb-3 pr-3">Gross Payment</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {eligibleForPayment.map(b => {
                  const cropObj = OFFICIAL_CROPS.find(c => c.name === b.crop) || OFFICIAL_CROPS[0];
                  const qtl = b.weighingSlip?.netWeightQuintals || b.quantityQuintals;
                  const totalAmt = qtl * cropObj.mspPrice;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pr-3 font-mono font-bold text-emerald-800">
                        {b.tokenNumber}
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="font-bold text-slate-900">{b.farmerName}</div>
                        <div className="text-[11px] font-mono text-slate-500">Aadhaar Bank Acc Ending •••• 4092</div>
                      </td>
                      <td className="py-3.5 pr-3 font-medium text-slate-800">{b.crop}</td>
                      <td className="py-3.5 pr-3 font-semibold text-slate-900">{qtl} Qtl</td>
                      <td className="py-3.5 pr-3 font-semibold text-emerald-800">₹{cropObj.mspPrice}/Qtl</td>
                      <td className="py-3.5 pr-3 font-black text-slate-900 text-sm">₹{totalAmt.toLocaleString()}</td>
                      <td className="py-3.5">
                        <button
                          onClick={() => handlePaySingle(b.id)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-colors"
                        >
                          Release DBT
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Disbursed Payment History */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-heading font-bold text-base text-slate-900">
            Recent DBT Credit Vouchers ({paidBookings.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3 pr-3">Token</th>
                <th className="pb-3 pr-3">Farmer</th>
                <th className="pb-3 pr-3">Crop</th>
                <th className="pb-3 pr-3">Amount</th>
                <th className="pb-3 pr-3">PFMS Ref No.</th>
                <th className="pb-3 pr-3">Status</th>
                <th className="pb-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paidBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 pr-3 font-mono font-bold text-emerald-800">{b.tokenNumber}</td>
                  <td className="py-3.5 pr-3 font-bold text-slate-900">{b.farmerName}</td>
                  <td className="py-3.5 pr-3 font-medium text-slate-800">{b.crop}</td>
                  <td className="py-3.5 pr-3 font-black text-emerald-800">
                    ₹{(b.paymentDetails?.amount || (b.quantityQuintals * 2300)).toLocaleString()}
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-slate-500">
                    {b.paymentDetails?.referenceNo || 'PFMS-RBI-9018274'}
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Credited
                    </span>
                  </td>
                  <td className="py-3.5">
                    <button
                      onClick={() => openDetailDrawer('payment', b.paymentDetails || {
                        transactionId: 'TXN-990182',
                        amount: b.quantityQuintals * 2300,
                        mspRatePerQuintal: 2300,
                        paymentDate: 'Today',
                        method: 'PFMS / DBT direct bank transfer',
                        bankName: 'State Bank of India',
                        accountEnding: '4092',
                        status: 'Credited to Farmer',
                        referenceNo: 'PFMS-RBI-9018274'
                      })}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors"
                    >
                      Voucher
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
