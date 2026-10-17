import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Calendar, 
  ShieldAlert, 
  FileText,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfficerNotificationsView: React.FC = () => {
  const { notifications, centres, currentUser } = useApp();
  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];

  const officialCirculars = [
    {
      id: 'CIRC-01',
      title: 'Revised FAQ Moisture Tolerance Protocol for Kharif Paddy',
      sender: 'Ministry of Consumer Affairs, Food & Public Distribution',
      date: 'Today, 08:30 AM',
      priority: 'high',
      body: 'All APMC mandi officers must ensure strict adherence to 17% maximum moisture limits. Grain lots exceeding 17% must be routed to covered drying sheds before weighbridge certification.',
    },
    {
      id: 'CIRC-02',
      title: 'PFMS e-Kuber 2.0 Integration & 48-Hour DBT Mandate',
      sender: 'Directorate of Agriculture & Farmer Welfare',
      date: 'Yesterday, 04:15 PM',
      priority: 'medium',
      body: 'Weighment slips certified before 3:00 PM must be batch-authorized via DSC token on the same working day to guarantee 48-hour Aadhaar bank transfer credit.',
    },
    {
      id: 'CIRC-03',
      title: 'Weather Warning: Regional Rain Precipitation Forecast',
      sender: 'India Meteorological Department (IMD) Agromet',
      date: '14 Sep 2026',
      priority: 'high',
      body: 'Scattered rain showers expected in this district over next 36 hours. Ensure all open yard grain piles are transferred under waterproof tarpaulins and silo sheds.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Mandi Administrative Bulletin
            </span>
            <span className="text-xs text-slate-400">&bull; Centre: <strong className="text-slate-700">{currentCentre.name}</strong></span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Official Circulars & Mandi Advisories
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Regulatory directives, weather inflow advisories, and ministry compliance circulars
          </p>
        </div>
      </div>

      {/* Official Circulars List */}
      <div className="space-y-4">
        {officialCirculars.map(c => (
          <div key={c.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.priority === 'high' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>
                  {c.priority === 'high' ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-slate-900">{c.title}</h3>
                  <span className="text-[11px] text-slate-400">Issued by {c.sender}</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">{c.date}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pl-11">
              {c.body}
            </p>

            <div className="pl-11 flex items-center gap-3 pt-2 text-[11px]">
              <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${c.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                {c.priority} Priority
              </span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Acknowledged by Nodal Officer
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
