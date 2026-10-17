import React, { useState } from 'react';
import { 
  TrendingUp, 
  Download, 
  Printer, 
  Calendar, 
  Scale, 
  PieChart as PieIcon, 
  BarChart3, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../../context/AppContext';

const HOURLY_INTAKE_DATA = [
  { time: '08:00', quintals: 120 },
  { time: '09:00', quintals: 210 },
  { time: '10:00', quintals: 280 },
  { time: '11:00', quintals: 310 },
  { time: '12:00', quintals: 190 },
  { time: '13:00', quintals: 80 },
  { time: '14:00', quintals: 230 },
  { time: '15:00', quintals: 180 },
];

const COMMODITY_BREAKDOWN = [
  { name: 'Paddy Grade-A', value: 680, color: '#059669' },
  { name: 'Paddy Common', value: 340, color: '#10b981' },
  { name: 'Wheat (Gehun)', value: 160, color: '#0284c7' },
  { name: 'Maize (Makka)', value: 60, color: '#f59e0b' },
];

export const OfficerReportsView: React.FC = () => {
  const { currentUser, centres } = useApp();
  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];

  const [dateRange, setDateRange] = useState('today');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
              Procurement Intelligence
            </span>
            <span className="text-xs text-slate-400">&bull; Mandi Node: <strong className="font-mono text-slate-700">{currentCentre.code}</strong></span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Operational Analytics & Procurement Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily intake metrics, commodity volume breakdown, and weighbridge telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Official Mandi Daily Summary exported as PDF.')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Daily Report</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Intake Today</span>
          <div className="font-heading text-2xl font-black text-slate-900 mt-1">
            1,240 <span className="text-xs font-semibold text-slate-400">Qtl</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">82% of 1,500 Target</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Farmers Served</span>
          <div className="font-heading text-2xl font-black text-slate-900 mt-1">
            48 Farmers
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Zero grievance escalations</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Avg Weigh Cycle</span>
          <div className="font-heading text-2xl font-black text-slate-900 mt-1">
            3.8 <span className="text-xs font-semibold text-slate-400">Mins</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">Target &lt; 5 mins per tractor</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rejection Ratio</span>
          <div className="font-heading text-2xl font-black text-slate-900 mt-1">
            1.8%
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Mostly high moisture dockage</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Volume Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
                <span>Hourly Grain Intake (Quintals)</span>
              </h3>
              <p className="text-xs text-slate-500">Distribution of intake volume across shift hours</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_INTAKE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="quintals" fill="#047857" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commodity Breakdown Pie Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-sky-700" />
              <span>Commodity Share</span>
            </h3>
            <p className="text-xs text-slate-500">Intake composition by crop variety</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMMODITY_BREAKDOWN}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {COMMODITY_BREAKDOWN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {COMMODITY_BREAKDOWN.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </span>
                <span className="font-bold text-slate-900">{c.value} Qtl</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
