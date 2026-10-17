import React from 'react';
import { 
  User, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  CreditCard, 
  Sprout, 
  Building2, 
  FileCheck,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FarmerProfileView: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
          alt={currentUser?.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {currentUser?.name || 'Sardar Ramesh Kumar'}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Government Farmer Identification: <strong>{currentUser?.identifier || 'PB-FARM-90214'}</strong>
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Aadhaar & DigiLocker e-KYC Verified
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {currentUser?.mobile}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {currentUser?.location}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Assigned APMC: Karnal Mandi Hub
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Land Record & Bank Account Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Land Records */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Registered Land Holding Records</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Revenue Verified
            </span>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Total Cultivable Area:</span>
              <span className="font-bold text-slate-900 dark:text-white">6.5 Acres (2.63 Hectares)</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Khasra / Survey Numbers:</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">24/11, 24/12, 25/1</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Irrigation Classification:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">Perennial Canal + Tube-well</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Kharif Registered Crop:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Paddy (PR-126) - 4.5 Acres</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Rabi Registered Crop:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Wheat (HD-3086) - 5.0 Acres</span>
            </div>
          </div>
        </div>

        {/* Bank & DBT Account */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Direct Benefit Transfer (DBT) Bank Account</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              NPCI Aadhaar Seeded
            </span>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Bank Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">Punjab National Bank</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Branch Name:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">Taraori Main Branch, Karnal</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Account Number:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">•••• •••• •••• 4019</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">IFSC Code:</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">PUNB0128900</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">PFMS Beneficiary Status:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Validated & Approved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
