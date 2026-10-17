import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';
import { UserRole } from '../../types';

interface QuickPersonaSelectorProps {
  onSelectRole?: (role: UserRole) => void;
  activeRole?: UserRole;
}

export const QuickPersonaSelector: React.FC<QuickPersonaSelectorProps> = ({
  onSelectRole,
  activeRole
}) => {
  const { loginAsRole } = useApp();

  const personas: Array<{
    roleKey: UserRole;
    name: string;
    detail: string;
    badgeText: string;
    badgeStyle: string;
    icon: string;
    activeBorder: string;
  }> = [
    {
      roleKey: 'farmer',
      name: 'Sardar Ramesh Kumar',
      detail: 'Farmer (PB-FARM-90214 • Mobile: 9876543210)',
      badgeText: 'Farmer',
      badgeStyle: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
      icon: '🌾',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900',
    },
    {
      roleKey: 'officer',
      name: 'Rajesh Verma (Procurement Officer)',
      detail: 'Officer ID: PO-CENTRE-04 • Karnal APMC Hub',
      badgeText: 'Officer',
      badgeStyle: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800',
      icon: '🏢',
      activeBorder: 'border-sky-500 ring-2 ring-sky-200 dark:ring-sky-900',
    },
    {
      roleKey: 'buyer',
      name: 'Priya Sharma (Direct Buyer)',
      detail: 'Buyer ID: BYR-DL-8821 • Ananya Agro Traders',
      badgeText: 'Buyer',
      badgeStyle: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
      icon: '🛒',
      activeBorder: 'border-amber-500 ring-2 ring-amber-200 dark:ring-amber-900',
    },
    {
      roleKey: 'assisted',
      name: 'Kavitha Ramanathan (CSC Assisted Staff)',
      detail: 'Staff ID: CSC-STAFF-12 • Village Digital Access',
      badgeText: 'Staff',
      badgeStyle: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800',
      icon: '🤝',
      activeBorder: 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-900',
    },
    {
      roleKey: 'admin',
      name: 'Dr. Arvind Swaminathan (IAS Administrator)',
      detail: 'Admin ID: ADM-GOV-01 • Directorate of Marketing',
      badgeText: 'Admin',
      badgeStyle: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800',
      icon: '🏛️',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900',
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          SELECT TEST PERSONA TO AUTHENTICATE:
        </span>
        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wide">
          Instant Access
        </span>
      </div>

      <div className="space-y-2">
        {personas.map((persona) => {
          const isSelected = activeRole === persona.roleKey;
          return (
            <div
              key={persona.roleKey}
              className={`p-3 rounded-xl bg-white dark:bg-neutral-950 border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                isSelected 
                  ? `${persona.activeBorder} shadow-sm` 
                  : 'border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50/70 dark:hover:bg-neutral-900/60'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectRole?.(persona.roleKey)}
                className="flex items-center gap-2.5 text-left flex-1 min-w-0"
              >
                <span className="text-base shrink-0">{persona.icon}</span>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block truncate">
                    {persona.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    {persona.detail}
                  </span>
                </div>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => loginAsRole(persona.roleKey)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${persona.badgeStyle}`}
                  title={`1-Click Login as ${persona.badgeText}`}
                >
                  {persona.badgeText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
