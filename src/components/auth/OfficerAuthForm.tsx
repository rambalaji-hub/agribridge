import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  BadgeCheck,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';

interface OfficerAuthFormProps {
  initialMode?: 'login' | 'register';
}

export const OfficerAuthForm: React.FC<OfficerAuthFormProps> = ({
  initialMode = 'login',
}) => {
  const { loginWithCredentials, loginAsRole, registerUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login States
  const [officerId, setOfficerId] = useState('PO-CENTRE-04');
  const [password, setPassword] = useState('officerGov2026');
  const [errorMessage, setErrorMessage] = useState('');

  // Register States
  const [fullName, setFullName] = useState('');
  const [cadre, setCadre] = useState('Procurement Quality Inspector');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [assignedCentre, setAssignedCentre] = useState('Karnal Central APMC Hub');
  const [stateName, setStateName] = useState('Haryana');
  const [district, setDistrict] = useState('Karnal');
  const [govPasscode, setGovPasscode] = useState('');
  const [clearancePin, setClearancePin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!officerId.trim()) {
      setErrorMessage('Please enter your Officer ID (e.g. PO-CENTRE-04) or Mobile Number');
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await loginWithCredentials(officerId, password);
      if (!ok) setErrorMessage('Officer credentials were not recognized. Check your ID and password.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !mobile.trim()) {
      setErrorMessage('Please enter Officer Full Name and Official Mobile');
      return;
    }

    const randomNum = Math.floor(10 + Math.random() * 90);
    const generatedOfficerId = `PO-CENTRE-${randomNum}`;

    const newOfficerProfile: UserProfile = {
      id: `usr-officer-${Date.now()}`,
      name: `${fullName.trim()} (${cadre})`,
      role: 'officer',
      identifier: generatedOfficerId,
      mobile: mobile.trim(),
      email: email.trim() || `officer.${mobile.slice(-4)}@procure.gov.in`,
      location: `${assignedCentre}, ${district}`,
      state: stateName,
      district: district,
      verificationStatus: 'verified',
      assignedCentreId: 'centre-01',
      govCadre: cadre,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    };

    setIsSubmitting(true);
    try {
      await registerUser(newOfficerProfile, clearancePin);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not submit the registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Officer Banner */}
      <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Procurement Officer Portal • கொள்முதல் அதிகாரி
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700">
              DPC Terminal
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Mandi Gate Ingress, Digital Weighment, FAQ Quality Grading & Direct Benefit Release
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
              ? 'bg-white dark:bg-black text-sky-700 dark:text-sky-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          🏢 Officer Sign In / உள்நுழைவு
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setErrorMessage(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'register'
              ? 'bg-white dark:bg-black text-sky-700 dark:text-sky-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          📝 New Officer Posting / பதிவு
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
              Officer ID / APMC Code / Mobile
            </label>
            <div className="relative">
              <input
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="e.g. PO-CENTRE-04 or 9845012345"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all"
                required
              />
              <BadgeCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Authorized Mandi / DPC official identifier
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Officer Security PIN / Gov Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>{isSubmitting ? 'Signing in…' : 'Access Procurement Terminal'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Quick Demo Fill for Officer */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => loginAsRole('officer')}
              className="w-full p-2.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-300 text-xs font-semibold flex items-center justify-between hover:bg-sky-100 transition-colors"
            >
              <span>Instant Test: <strong>Rajesh Verma</strong> (PO-CENTRE-04)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-600 text-white font-bold">1-Click</span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Officer Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. S. Meenakshi Sundaram"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-sky-600"
                  required
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Mobile *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Official 10-digit mobile"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-sky-600"
                  required
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Designation / Cadre
              </label>
              <select
                value={cadre}
                onChange={(e) => setCadre(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="DPC Quality Inspector">DPC Quality Inspector</option>
                <option value="APMC Mandi Secretary">APMC Mandi Secretary</option>
                <option value="Weighment Superintendent">Weighment Superintendent</option>
                <option value="Procurement Field Officer">Procurement Field Officer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@procure.gov.in"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Procurement Centre *
              </label>
              <input
                type="text"
                value={assignedCentre}
                onChange={(e) => setAssignedCentre(e.target.value)}
                placeholder="e.g. Karnal Central APMC Hub"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                District / State
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="w-1/2 px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="State"
                  className="w-1/2 px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gov Verification Passcode
              </label>
              <input
                type="text"
                value={govPasscode}
                onChange={(e) => setGovPasscode(e.target.value)}
                placeholder="Official Mandi Token Code"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Create Officer PIN *
              </label>
              <input
                type="password"
                value={clearancePin}
                onChange={(e) => setClearancePin(e.target.value)}
                placeholder="6-digit clearance PIN"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting…' : 'Register Officer Credential & Open Mandi Terminal'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
