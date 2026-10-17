import React, { useState } from 'react';
import { 
  Sprout, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  CreditCard,
  FileText,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';

interface FarmerAuthFormProps {
  initialMode?: 'login' | 'register';
  onSwitchMode?: (mode: 'login' | 'register') => void;
}

export const FarmerAuthForm: React.FC<FarmerAuthFormProps> = ({
  initialMode = 'login',
}) => {
  const { loginWithCredentials, loginAsRole, registerUser, t } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login States
  const [loginIdentifier, setLoginIdentifier] = useState('9876543210');
  const [loginPassword, setLoginPassword] = useState('kisanPass2026');
  const [showPassword, setShowPassword] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register States
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [stateName, setStateName] = useState('Haryana');
  const [district, setDistrict] = useState('Karnal');
  const [village, setVillage] = useState('');
  const [landAcres, setLandAcres] = useState('3.5');
  const [primaryCrop, setPrimaryCrop] = useState('Paddy (Dhan)');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your Mobile Number or Farmer ID (PB-FARM-XXXXX)');
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await loginWithCredentials(loginIdentifier, loginPassword);
      if (!ok) setLoginError('Credentials not recognized. Please check your mobile number or Farmer ID and password.');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Could not sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!fullName.trim() || !mobile.trim()) {
      setLoginError('Please fill in Farmer Full Name and 10-digit Mobile Number');
      return;
    }

    if (mobile.length < 10) {
      setLoginError('Mobile number must be 10 digits');
      return;
    }

    const randomIdNumber = Math.floor(10000 + Math.random() * 90000);
    const statePrefix = stateName.substring(0, 2).toUpperCase();
    const generatedFarmerId = `${statePrefix}-FARM-${randomIdNumber}`;

    const newFarmerProfile: UserProfile = {
      id: `usr-farmer-${Date.now()}`,
      name: fullName.trim(),
      role: 'farmer',
      identifier: generatedFarmerId,
      mobile: mobile.trim(),
      location: `${village ? village + ', ' : ''}${district}, ${stateName}`,
      state: stateName,
      district: district,
      verificationStatus: 'verified',
      aadhaarLinked: !!aadhaar,
      bankAccountLinked: !!bankAccount,
      landAcres: parseFloat(landAcres) || 2.5,
      primaryCrops: [primaryCrop],
      accountNumber: bankAccount,
      ifscCode: ifsc,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    };

    setIsSubmitting(true);
    try {
      await registerUser(newFarmerProfile, newPassword);
      setRegisterSuccess('Registration complete. Your account is pending verification.');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Could not complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner for Farmer */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Sprout className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Farmer Portal • உழவர் தளம்
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              Kisan Direct
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            MSP Procurement, Digital Tokens, Live Mandi Queues & Direct Marketplace
          </p>
        </div>
      </div>

      {/* Mode Switch Tabs (Login vs Register) */}
      <div className="flex p-1 bg-slate-100 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-white/10">
        <button
          type="button"
          onClick={() => { setMode('login'); setLoginError(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'login'
              ? 'bg-white dark:bg-black text-emerald-700 dark:text-emerald-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          🌾 Farmer Sign In / உள்நுழைவு
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setLoginError(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'register'
              ? 'bg-white dark:bg-black text-emerald-700 dark:text-emerald-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          📝 New Farmer Registration / பதிவு
        </button>
      </div>

      {loginError && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{loginError}</span>
        </div>
      )}

      {/* LOGIN FORM */}
      {mode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Farmer Mobile Number / Kisan ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. 9876543210 or PB-FARM-90214"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                required
              />
              <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Use registered 10-digit mobile or assigned PM-Kisan ID
            </p>
          </div>

          {!useOtp ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password / Kisan PIN
                </label>
                <button
                  type="button"
                  onClick={() => setUseOtp(true)}
                  className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  Login via Aadhaar OTP
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your security PIN or password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3.5 top-3"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  6-Digit Aadhaar / Mobile OTP
                </label>
                <button
                  type="button"
                  onClick={() => setUseOtp(false)}
                  className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  Use Password instead
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit OTP (e.g. 552190)"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-mono font-bold tracking-widest text-center focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>{isSubmitting ? 'Signing in…' : 'Sign In to Farmer Portal'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Quick Demo Fill for Farmer */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => loginAsRole('farmer')}
              className="w-full p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between hover:bg-emerald-100 transition-colors"
            >
              <span>Instant Test: <strong>Sardar Ramesh Kumar</strong> (PB-FARM-90214)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">1-Click</span>
            </button>
          </div>
        </form>
      ) : (
        /* REGISTER FORM */
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Farmer Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Murugan Palanisamy"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Aadhaar-Linked Mobile *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Aadhaar / PM-Kisan ID
              </label>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="12-digit Aadhaar / Kisan ID"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Land Holding (Acres) *
              </label>
              <input
                type="number"
                step="0.1"
                value={landAcres}
                onChange={(e) => setLandAcres(e.target.value)}
                placeholder="e.g. 4.5"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                State
              </label>
              <select
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Haryana">Haryana</option>
                <option value="Punjab">Punjab</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Karnal or Thanjavur"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Village / Taluk
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Taraori"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Cultivated Crop
              </label>
              <select
                value={primaryCrop}
                onChange={(e) => setPrimaryCrop(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Paddy (Dhan)">Paddy (Dhan) - MSP ₹2,300/Qtl</option>
                <option value="Wheat (Gehun)">Wheat (Gehun) - MSP ₹2,275/Qtl</option>
                <option value="Maize (Makka)">Maize (Makka) - MSP ₹2,090/Qtl</option>
                <option value="Cotton (Kapas)">Cotton (Kapas) - MSP ₹7,120/Qtl</option>
                <option value="Groundnut (Mungfali)">Groundnut (Mungfali) - MSP ₹6,780/Qtl</option>
                <option value="Sugarcane">Sugarcane - FRP ₹340/Qtl</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Create Security PIN / Password *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create 6-digit PIN"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          {/* Bank DBT Info */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Benefit Transfer (DBT) Bank Account</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Bank Account Number"
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg text-xs font-mono"
              />
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="IFSC Code (e.g. SBIN0001234)"
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-600"
              required
            />
            <span>
              I certify that land ownership and crop sowing details are accurate under the State Farmer Registry protocols.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Registering…' : 'Complete Farmer Registration & Access Portal'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
