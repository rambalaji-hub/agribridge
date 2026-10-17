import React from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  Landmark,
  FileText,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { MarketplaceOrder } from '../../types';

interface OrderTransactionReceiptModalProps {
  order: MarketplaceOrder;
  onClose: () => void;
}

export const OrderTransactionReceiptModal: React.FC<OrderTransactionReceiptModalProps> = ({ order, onClose }) => {
  const txn = order.transactionDetails;
  const baseAmount = txn?.baseAmount || order.totalAmount;
  const mandiCess = txn?.mandiCess ?? Number((baseAmount * 0.015).toFixed(2));
  const escrowFee = txn?.escrowFee ?? 250;
  const transportCost = txn?.transportCost ?? (order.estimatedTransportCost || 3500);
  const totalTransacted = txn?.totalTransacted ?? (baseAmount + mandiCess + escrowFee + transportCost);
  const paymentMethod = order.paymentMethod || txn?.paymentMethod || 'UPI / Dynamic QR Code (Google Pay)';
  const txId = txn?.transactionId || `TXN-AGRI-${order.id.replace('ord-', '88')}`;
  const utrNo = txn?.utrNumber || `UTR-SBIN-2026-${order.id.replace('ord-', '942')}`;
  const paidAt = txn?.paidAt || order.orderDate;
  const gateway = txn?.paymentGateway || 'NPCI Bharat e-Market Escrow (SBI Nodal Account)';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* Modal Header */}
        <div className="bg-emerald-800 dark:bg-emerald-950 text-white px-6 py-4 flex items-center justify-between print:bg-emerald-800 print:text-white border-b border-emerald-900 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700">
                  Government e-NAM Escrow Clearing
                </span>
                <span className="text-[10px] text-emerald-200 font-mono">
                  Receipt #{txId}
                </span>
              </div>
              <h3 className="font-heading font-black text-lg text-white mt-0.5">
                Official Money Transaction & Settlement Voucher
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 flex items-center justify-center font-bold text-lg print:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Status & UTR Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                  Payment Status: {txn?.escrowStatus || 'Escrow Secured'}
                </span>
                <span className="font-heading font-black text-base text-emerald-950 dark:text-emerald-200">
                  ₹{totalTransacted.toLocaleString()} Transacted & Secured
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right font-mono text-[11px] bg-white dark:bg-slate-800/80 px-3 py-2 rounded-lg border border-emerald-200/80 dark:border-emerald-700/40 w-full sm:w-auto">
              <div className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-bold">RBI Bank UTR Reference</div>
              <strong className="text-slate-900 dark:text-slate-100 text-xs">{utrNo}</strong>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-bold uppercase">Transaction ID</span>
              <strong className="text-slate-900 dark:text-slate-100 font-mono">{txId}</strong>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-bold uppercase">Payment Mode</span>
              <strong className="text-slate-900 dark:text-slate-100">{paymentMethod}</strong>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-bold uppercase">Paid At</span>
              <strong className="text-slate-900 dark:text-slate-100">{paidAt}</strong>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-bold uppercase">Clearing Gateway</span>
              <strong className="text-slate-900 dark:text-slate-100">{gateway}</strong>
            </div>
          </div>

          {/* Counterparties: Buyer & Farmer Beneficiary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Buyer Details */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Payer (Institutional Buyer)</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="font-bold text-slate-900 dark:text-slate-100">{order.buyerName}</div>
                <div className="text-slate-500 dark:text-slate-400">GSTIN: <strong className="font-mono text-slate-700 dark:text-slate-300">07AAACR4910K1ZP</strong></div>
                <div className="text-slate-500 dark:text-slate-400">Delivery Hub: <span className="text-slate-700 dark:text-slate-300">{order.deliveryLocation}</span></div>
                <div className="text-slate-500 dark:text-slate-400">Buyer Mobile: <span className="text-slate-700 dark:text-slate-300">{order.buyerPhone}</span></div>
              </div>
            </div>

            {/* Farmer Beneficiary */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                <Landmark className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Farmer Beneficiary (DBT Account)</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{order.farmerName}</span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    Aadhaar DBT Verified
                  </span>
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Bank: <span className="text-slate-700 dark:text-slate-300">{txn?.farmerBeneficiary?.bankName || 'Punjab National Bank, Agri Special Branch'}</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  A/c No: <strong className="font-mono text-slate-700 dark:text-slate-300">{txn?.farmerBeneficiary?.accountMasked || '•••• •••• •••• 4019'}</strong> (IFSC: {txn?.farmerBeneficiary?.ifsc || 'PUNB0024900'})
                </div>
                <div className="text-slate-500 dark:text-slate-400">Farm Gate: <span className="text-slate-700 dark:text-slate-300">{order.pickupLocation}</span></div>
              </div>
            </div>
          </div>

          {/* Itemized Financial Ledger */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                Itemized Money Transaction Breakdown
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                Contract Ref: {order.id.toUpperCase()}
              </span>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Commodity Produce Base Value</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      {order.crop} &bull; {order.quantityQuintals} Quintals @ ₹{order.agreedPricePerQuintal.toLocaleString()} / Qtl
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                    ₹{baseAmount.toLocaleString()}
                  </td>
                </tr>

                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">APMC Mandi Cess & Regulatory Levy (1.5%)</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">Statutory state agricultural marketing fee</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                    ₹{mandiCess.toLocaleString()}
                  </td>
                </tr>

                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Quality Assured Escrow Protection</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">100% Capital security & assaying lab validation guarantee</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                    ₹{escrowFee.toLocaleString()}
                  </td>
                </tr>

                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Farm Gate Transport & Freight Deposit</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      Vehicle: {order.vehicleNumber || 'Assigned Logistics Carrier'} &bull; Pickup: {order.pickupDate}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                    ₹{transportCost.toLocaleString()}
                  </td>
                </tr>

                <tr className="bg-emerald-50/70 dark:bg-emerald-950/30 font-bold border-t-2 border-emerald-600/30">
                  <td className="py-3 px-4 text-emerald-950 dark:text-emerald-200 text-sm">
                    Total Amount Paid & Transacted
                  </td>
                  <td className="py-3 px-4 text-right font-heading font-black text-emerald-950 dark:text-emerald-200 text-base">
                    ₹{totalTransacted.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Government Escrow Protocol Assurance */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              RBI & APMC Escrow Protection Policy
            </div>
            <p>
              Your payment is safely held in the Reserve Bank of India e-Kuber / State Bank of India Nodal Clearing Account. Funds will only be automatically disbursed into Sardar Ramesh Kumar's DBT bank account after digital weighbridge gate-in and quality verification at your destination hub.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Digital Signature: <span className="font-mono text-slate-700 dark:text-slate-300">SHA256: 7f89b...e21a</span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl shadow-xs flex items-center gap-2 text-xs transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Download Receipt
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
