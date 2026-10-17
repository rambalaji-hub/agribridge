import React, { useState } from 'react';
import { 
  Sprout, 
  Building2,
  ShoppingCart,
  HeartHandshake,
  Landmark,
  ShieldCheck, 
  Sun,
  Moon,
  ChevronRight,
  Info,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, LanguageCode } from '../../types';
import { FarmerAuthForm } from './FarmerAuthForm';
import { OfficerAuthForm } from './OfficerAuthForm';
import { BuyerAuthForm } from './BuyerAuthForm';
import { StaffAuthForm } from './StaffAuthForm';
import { AdminAuthForm } from './AdminAuthForm';
import { QuickPersonaSelector } from './QuickPersonaSelector';

interface LoginViewProps {
  initialRole?: UserRole;
  onBackToLanding?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  initialRole = 'farmer',
  onBackToLanding,
}) => {
  const { language, setLanguage, theme, toggleTheme } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  const rolesConfig: Array<{
    id: UserRole;
    label: string;
    tamilLabel: string;
    badgeText: string;
    icon: React.ReactNode;
    badgeStyle: string;
    activeTabStyle: string;
    borderStyle: string;
  }> = [
    {
      id: 'farmer',
      label: 'Farmer',
      tamilLabel: 'விவசாயி',
      badgeText: 'Farmer',
      icon: <Sprout className="w-4 h-4" />,
      badgeStyle: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      activeTabStyle: 'bg-emerald-600 text-white shadow-sm',
      borderStyle: 'border-emerald-500',
    },
    {
      id: 'officer',
      label: 'Officer',
      tamilLabel: 'கொள்முதல் அதிகாரி',
      badgeText: 'Officer',
      icon: <Building2 className="w-4 h-4" />,
      badgeStyle: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800',
      activeTabStyle: 'bg-sky-600 text-white shadow-sm',
      borderStyle: 'border-sky-500',
    },
    {
      id: 'buyer',
      label: 'Buyer',
      tamilLabel: 'நேரடி வாங்குபவர்',
      badgeText: 'Buyer',
      icon: <ShoppingCart className="w-4 h-4" />,
      badgeStyle: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      activeTabStyle: 'bg-amber-600 text-white shadow-sm',
      borderStyle: 'border-amber-500',
    },
    {
      id: 'assisted',
      label: 'Staff',
      tamilLabel: 'கிராம உதவியாளர்',
      badgeText: 'Staff',
      icon: <HeartHandshake className="w-4 h-4" />,
      badgeStyle: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      activeTabStyle: 'bg-purple-600 text-white shadow-sm',
      borderStyle: 'border-purple-500',
    },
    {
      id: 'admin',
      label: 'Admin',
      tamilLabel: 'அரசு நிர்வாகி',
      badgeText: 'Admin',
      icon: <Landmark className="w-4 h-4" />,
      badgeStyle: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      activeTabStyle: 'bg-indigo-600 text-white shadow-sm',
      borderStyle: 'border-indigo-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-black text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-100 transition-colors">
      {/* Top Banner */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-slate-300 px-4 py-2 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-emerald-700 dark:text-emerald-400 font-bold hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors mr-2"
              title="Return to Public Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing Page / முகப்பு</span>
            </button>
          )}
          <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-emerald-800 dark:text-emerald-400">
            AgriBridge • National Agricultural E-Procurement Portal
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-neutral-700">•</span>
          <span className="hidden md:inline text-slate-600 dark:text-slate-400 font-medium">
            தனித்தனி உள்நுழைவு & பதிவு தளம் (Dedicated Role Portals)
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="bg-white dark:bg-neutral-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs focus:outline-none shadow-2xs font-medium"
          >
            <option value="en">English</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>

          <button
            id="login-theme-toggle-btn"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200 dark:border-white/10 transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-slate-700" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        
        {/* Role Portal Selection Tabs */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Select Your Role Portal / உங்கள் பாத்திரத்தைத் தேர்வுசெய்யவும்
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl mx-auto">
              Each portal has a dedicated <strong>Login</strong> and <strong>Registration</strong> system with tailored verification and workflows.
            </p>
          </div>

          {/* 5 Distinct Role Cards / Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
            {rolesConfig.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  id={`role-tab-${role.id}`}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? `bg-white dark:bg-neutral-950 ${role.borderStyle} ring-2 ring-emerald-500/20 shadow-md scale-[1.02]`
                      : 'bg-white/80 dark:bg-neutral-900/60 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className={`p-1.5 rounded-xl ${isSelected ? 'bg-slate-100 dark:bg-neutral-800' : 'bg-slate-50 dark:bg-neutral-800/50'}`}>
                      {role.icon}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${role.badgeStyle}`}>
                      {role.badgeText}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {role.label}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                      {role.tamilLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Column Layout: Dedicated Role Auth on Left, Test Personas on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Active Role's Dedicated Login & Register Box (7 cols on large) */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-950 border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-xl p-5 sm:p-7">
            {selectedRole === 'farmer' && <FarmerAuthForm />}
            {selectedRole === 'officer' && <OfficerAuthForm />}
            {selectedRole === 'buyer' && <BuyerAuthForm />}
            {selectedRole === 'assisted' && <StaffAuthForm />}
            {selectedRole === 'admin' && <AdminAuthForm />}
          </div>

          {/* Test Persona Instant Authenticate List (5 cols on large) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-neutral-950 border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-md p-4 sm:p-5">
              <QuickPersonaSelector 
                activeRole={selectedRole}
                onSelectRole={(role) => setSelectedRole(role)}
              />
            </div>

            {/* Portal Architecture Explainer Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>Unified Single Sign-On & Dedicated Registration</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                You can test any role directly via <strong>1-Click Instant Access</strong> or register a new profile with customized attributes (Land Area & Bank DBT for Farmers, Mandi Centre for Officers, GSTIN for Buyers, Kiosk ID for Staff, and Secretariat Cadre for Admins).
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Notice */}
      <div className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black p-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p className="text-slate-600 dark:text-slate-400">
          AgriBridge • National Digital Agriculture Infrastructure & Smart Procurement Platform
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">
          Government e-Governance compliant • Open Network for Digital Commerce (ONDC) Agriculture Protocol
        </p>
      </div>
    </div>
  );
};
