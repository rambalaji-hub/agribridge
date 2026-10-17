import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  MapPin,
  User,
  Phone,
  Mail,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';

interface StaffAuthFormProps {
  initialMode?: 'login' | 'register';
}

export const StaffAuthForm: React.FC<StaffAuthFormProps> = ({
  initialMode = 'login',
}) => {
  const { loginWithCredentials, loginAsRole, registerUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login States
  const [staffId, setStaffId] = useState('CSC-STAFF-12');
  const [pin, setPin] = useState('cscPass2026');
  const [errorMessage, setErrorMessage] = useState('');

  // Register States
  const [vleName, setVleName] = useState('');
  const [kioskCode, setKioskCode] = useState('');
  const [panchayat, setPanchayat] = useState('');
  const [district, setDistrict] = useState('Karnal');
  const [stateName, setStateName] = useState('Haryana');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [kioskPin, setKioskPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!staffId.trim()) {
      setErrorMessage('Please enter your CSC Staff ID (e.g. CSC-STAFF-12) or Mobile Number');
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await loginWithCredentials(staffId, pin);
      if (!ok) setErrorMessage('Staff credentials were not recognized. Check your ID and PIN.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!vleName.trim() || !mobile.trim()) {
      setErrorMessage('Please provide Staff Full Name and Mobile Number');
      return;
    }

    const randomNum = Math.floor(10 + Math.random() * 90);
    const generatedStaffId = `CSC-STAFF-${randomNum}`;

    const newStaffProfile: UserProfile = {
      id: `usr-staff-${Date.now()}`,
      name: vleName.trim(),
      role: 'assisted',
      identifier: generatedStaffId,
      mobile: mobile.trim(),
      email: email.trim() || `${vleName.toLowerCase().replace(/[^a-z]/g, '')}.csc@samadhan.org`,
      location: `${panchayat ? panchayat + ' Village ' : ''}CSC Centre, ${district}`,
      state: stateName,
      district: district,
      verificationStatus: 'verified',
      cscKioskId: kioskCode || `VLE-${Math.floor(100000 + Math.random() * 900000)}`,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    };

    setIsSubmitting(true);
    try {
      await registerUser(newStaffProfile, kioskPin);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not submit the registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Staff Banner */}
      <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              CSC Assisted Staff Portal • கிராம சேவை உதவியாளர்
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
              Gramin Seva
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Assisted Farmer Registration, Crop Slot Booking, Voice-Assisted Vernacular Access
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
              ? 'bg-white dark:bg-black text-purple-700 dark:text-purple-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          🤝 Staff Sign In / உள்நுழைவு
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setErrorMessage(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'register'
              ? 'bg-white dark:bg-black text-purple-700 dark:text-purple-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          📝 New Kiosk Node Registration / பதிவு
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
              CSC Staff ID / VLE Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="e.g. CSC-STAFF-12 or 9443221100"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                required
              />
              <Smartphone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Village Level Entrepreneur (VLE) or Digital Mitra credential
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              CSC Digital Seva PIN
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 6-digit staff PIN"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>{isSubmitting ? 'Signing in…' : 'Launch Assisted Farmer Kiosk'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Quick Demo Fill for Staff */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => loginAsRole('assisted')}
              className="w-full p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-xs font-semibold flex items-center justify-between hover:bg-purple-100 transition-colors"
            >
              <span>Instant Test: <strong>Kavitha Ramanathan</strong> (CSC-STAFF-12)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold">1-Click</span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                VLE / Staff Operator Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={vleName}
                  onChange={(e) => setVleName(e.target.value)}
                  placeholder="e.g. Kavitha Ramanathan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                CSC Digital Seva Kiosk ID
              </label>
              <input
                type="text"
                value={kioskCode}
                onChange={(e) => setKioskCode(e.target.value)}
                placeholder="e.g. VLE-882190"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-mono focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gram Panchayat / Village Hub
              </label>
              <input
                type="text"
                value={panchayat}
                onChange={(e) => setPanchayat(e.target.value)}
                placeholder="e.g. Gharaunda Village Center"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                District & State
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

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Create Kiosk PIN *
              </label>
              <input
                type="password"
                value={kioskPin}
                onChange={(e) => setKioskPin(e.target.value)}
                placeholder="6-digit security PIN"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting…' : 'Register CSC Assistance Kiosk & Start Helping Farmers'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
