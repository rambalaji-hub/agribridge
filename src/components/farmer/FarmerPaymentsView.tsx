import React from 'react';
import { 
  CreditCard, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Building2,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FarmerPaymentsView: React.FC = () => {
  const { bookings, openDetailDrawer, speakText, t, tD, localizeCrop } = useApp();

  const paidBookings = bookings.filter(b => b.paymentDetails);

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {tD('pfmsTitle')}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {tD('dbtDisbursementsTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {tD('dbtDisbursementsDesc')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">{tD('totalDisbursedFY')}</span>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              ₹2,49,749.50
            </div>
          </div>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          {tD('allDbtTransactions')}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3 pr-4">{tD('transactionIdCol')}</th>
                <th className="pb-3 pr-4">{tD('paymentDateCol')}</th>
                <th className="pb-3 pr-4">{tD('procuredCommodityCol')}</th>
                <th className="pb-3 pr-4">{tD('netQuantityCol')}</th>
                <th className="pb-3 pr-4">{tD('mspRateCol')}</th>
                <th className="pb-3 pr-4">{tD('disbursedAmountCol')}</th>
                <th className="pb-3 pr-4">{tD('bankUtrCol')}</th>
                <th className="pb-3 pr-4">{tD('statusCol')}</th>
                <th className="pb-3">{tD('actionCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paidBookings.map(b => {
                const p = b.paymentDetails!;
                return (
                  <tr key={p.transactionId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                      {p.transactionId}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                      {p.paymentDate}
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                      {localizeCrop(b.crop)}
                    </td>
                    <td className="py-3.5 pr-4">
                      {b.quantityQuintals} {tD('quintalsUnit', 'Quintals')}
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-emerald-700">
                      ₹{p.mspRatePerQuintal} / {tD('qtlUnit', 'Qtl')}
                    </td>
                    <td className="py-3.5 pr-4 font-black text-slate-900 dark:text-white text-sm">
                      ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{p.bankName}</span>
                      <span className="font-mono text-[10px] text-slate-400 block">{p.referenceNo}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> {tD('creditedStatus')}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <button
                        onClick={() => openDetailDrawer('payment', p)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> {tD('voucherBtn')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
