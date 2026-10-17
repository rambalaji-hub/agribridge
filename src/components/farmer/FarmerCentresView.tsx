import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  CalendarClock, 
  CheckCircle2, 
  Search, 
  Phone,
  Scale,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FarmerCentresView: React.FC = () => {
  const { centres, setActiveTab, t, tD, localizeCrop, localizeMandi } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCentres = centres.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {tD('apmcDirectoryBadge')}
          </span>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            {tD('procurementCentresWaitTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {tD('procurementCentresWaitDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={tD('searchMandiPlaceholder')}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Centres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCentres.map(c => {
          const isCrowded = c.currentQueueCount > 15;

          return (
            <div 
              key={c.id} 
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">{localizeMandi(c.name)}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.taluk}, {c.district}, {c.state} - {c.pincode}</span>
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isCrowded 
                      ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {c.operatingStatus === 'Operational' ? tD('operatingNormal', 'Operational') : c.operatingStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{tD('queueLoadLabel')}</span>
                    <span className="font-heading font-black text-slate-900 text-base">
                      {c.currentQueueCount} {tD('tractorsUnit')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{tD('waitingInYard')}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{tD('estimatedWaitLabel')}</span>
                    <span className="font-heading font-black text-emerald-800 text-base">
                      ~{c.averageWaitTimeMinutes} {tD('minutesUnit')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{tD('atWeighbridge')}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div>{tD('dailyIntakeQuota')}: <strong>{c.dailyCapacityQuintals.toLocaleString()} {tD('quintalsUnit')}</strong></div>
                  <div>{tD('supportedCommodities')}: <strong>{c.supportedCrops.map(crop => localizeCrop(crop)).join(', ')}</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('book-slot')}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CalendarClock className="w-4 h-4" />
                  <span>{tD('bookSlotAtCentre')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
