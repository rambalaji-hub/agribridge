import React from 'react';
import { 
  User, 
  ShieldCheck, 
  Key, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfficerProfileView: React.FC = () => {
  const { currentUser, centres } = useApp();
  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-heading font-black text-2xl border border-emerald-200 shadow-2xs">
            {currentUser?.name?.slice(0, 2).toUpperCase() || 'RV'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Gazetted Procurement Officer (Class-I)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> DSC Token Active
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1">
              {currentUser?.name || 'Rajesh Verma'}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Govt Service ID: <strong>{currentUser?.identifier || 'OFF-PB-4029'}</strong> &bull; Nodal Officer, Food & Civil Supplies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 font-mono text-xs rounded-xl font-semibold border border-slate-200">
            PFMS Nodal Code: <strong>PFMS-PB-NODAL-882</strong>
          </span>
        </div>
      </div>

      {/* Grid: Credentials & Jurisdiction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Officer Information & Security */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-700" />
              <span>Digital Security & Authorization Profile</span>
            </h3>
            <p className="text-xs text-slate-500">Government PKI digital signature and biometric authentication</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Class-3 DSC Token</span>
                <span className="font-bold text-slate-900">e-Mudhra USB Cryptographic Dongle</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active & Plugged In
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">PFMS Mandate Authority</span>
                <span className="font-bold text-slate-900">Direct Benefit Transfer Approval Node</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Single Batch Limit: ₹1.5 Cr
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Aadhaar Biometric e-Sign</span>
                <span className="font-bold text-slate-900">Linked to Registered Fingerprint / Iris</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                UIDAI Verified
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Mandi Jurisdiction */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-700" />
              <span>Assigned APMC Jurisdiction</span>
            </h3>
            <p className="text-xs text-slate-500">Authorized primary and auxiliary procurement centres</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{currentCentre.name}</span>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {currentCentre.code}
              </span>
            </div>
            <div className="text-slate-600 space-y-1 text-[11px]">
              <div>Location: <strong>{currentCentre.taluk}, {currentCentre.district}, {currentCentre.state}</strong></div>
              <div>PIN Code: <strong>{currentCentre.pincode}</strong></div>
              <div>Daily Capacity: <strong>{currentCentre.dailyCapacityQuintals} Quintals</strong></div>
              <div>Authorized Commodities: <strong>{currentCentre.supportedCrops.join(', ')}</strong></div>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500">
            For transfers or jurisdictional reassignment requests, contact the State Directorate of Agricultural Marketing.
          </div>
        </div>
      </div>
    </div>
  );
};
