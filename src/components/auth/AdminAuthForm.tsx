import React, { useState } from 'react';
import { 
  Landmark, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  ShieldAlert,
  User,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';

interface AdminAuthFormProps {
  initialMode?: 'login' | 'register';
}

export const AdminAuthForm: React.FC<AdminAuthFormProps> = ({
  initialMode = 'login',
}) => {
  const { loginWithCredentials, loginAsRole, registerUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login States
  const [adminId, setAdminId] = useState('ADM-GOV-01');
  const [password, setPassword] = useState('iasGovPass2026');
  const [errorMessage, setErrorMessage] = useState('');

  // Register States
  const [adminName, setAdminName] = useState('');
  const [designation, setDesignation] = useState('IAS Joint Secretary (Procurement)');
  const [department, setDepartment] = useState('Directorate of Agricultural Marketing');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [clearanceKey, setClearanceKey] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!adminId.trim()) {
      setErrorMessage('Please enter your Admin ID (e.g. ADM-GOV-01) or Gov Mobile');
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await loginWithCredentials(adminId, password);
      if (!ok) setErrorMessage('Administrative credentials were not recognized. Check your ID and password.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!adminName.trim() || !mobile.trim()) {
      setErrorMessage('Please provide Administrator Name and Official Gov Mobile');
      return;
    }

    const randomNum = Math.floor(10 + Math.random() * 90);
    const generatedAdminId = `ADM-GOV-${randomNum}`;

    const newAdminProfile: UserProfile = {
      id: `usr-admin-${Date.now()}`,
      name: `${adminName.trim()} (${designation})`,
      role: 'admin',
      identifier: generatedAdminId,
      mobile: mobile.trim(),
      email: email.trim() || `director.procurement@agri.gov.in`,
      location: `${department}, State HQ`,
      state: 'National / State HQ',
      district: 'Directorate Secretariat',
      verificationStatus: 'verified',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    };

    setIsSubmitting(true);
    try {
      await registerUser(newAdminProfile, adminPin);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not submit the registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Admin Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Landmark className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              State Directorate & IAS Admin Portal • அரசு நிர்வாகி
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700">
              State HQ
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            State-Wide APMC Analytics, MSP Budget Allocation, Real-time Vigilance & Grievance Resolution
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-white/10">
        <button
          type="button"
          onClick={() => { setMode('login'); setErrorMessage(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'login'
              ? 'bg-white dark:bg-black text-indigo-700 dark:text-indigo-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          🏛️ Admin Sign In / உள்நுழைவு
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setErrorMessage(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'register'
              ? 'bg-white dark:bg-black text-indigo-700 dark:text-indigo-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          📝 Directorate Credential Registration / பதிவு
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Admin ID / NIC Official Email / Gov Mobile
            </label>
            <div className="relative">
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. ADM-GOV-01 or 9940112233"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                required
              />
              <Award className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Directorate of Agriculture & Farmer Welfare Secretariat
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Government Administrative Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>{isSubmitting ? 'Signing in…' : 'Access State Administrative Command Center'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Quick Demo Fill for Admin */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => loginAsRole('admin')}
              className="w-full p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 text-xs font-semibold flex items-center justify-between hover:bg-indigo-100 transition-colors"
            >
              <span>Instant Test: <strong>Dr. Arvind Swaminathan (IAS)</strong> (ADM-GOV-01)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold">1-Click</span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Administrator Officer Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Dr. Arvind Swaminathan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Designation *
              </label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="IAS Joint Secretary (Procurement)">IAS Joint Secretary (Procurement)</option>
                <option value="Director of Agricultural Marketing">Director of Agricultural Marketing</option>
                <option value="State Vigilance Commissioner">State Vigilance Commissioner</option>
                <option value="Chief Technology Advisor (Agri-Stack)">Chief Technology Advisor (Agri-Stack)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Department / Ministry
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Department name"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official NIC Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agri.gov.in"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gov Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Official 10-digit mobile"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Create Admin PIN *
              </label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Master security PIN"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting…' : 'Register Directorate Admin Account & Open Command Center'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
