import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Building,
  User,
  Phone,
  Mail,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';

interface BuyerAuthFormProps {
  initialMode?: 'login' | 'register';
}

export const BuyerAuthForm: React.FC<BuyerAuthFormProps> = ({
  initialMode = 'login',
}) => {
  const { loginWithCredentials, loginAsRole, registerUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login States
  const [buyerId, setBuyerId] = useState('BYR-DL-8821');
  const [password, setPassword] = useState('buyerAgro2026');
  const [errorMessage, setErrorMessage] = useState('');

  // Register States
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [tradeCategory, setTradeCategory] = useState('Rice & Grain Miller');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Delhi NCR');
  const [traderPin, setTraderPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!buyerId.trim()) {
      setErrorMessage('Please enter your Buyer ID (e.g. BYR-DL-8821) or Registered Mobile');
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await loginWithCredentials(buyerId, password);
      if (!ok) setErrorMessage('Buyer credentials were not recognized. Check your ID and password.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!companyName.trim() || !contactPerson.trim() || !mobile.trim()) {
      setErrorMessage('Please provide Company Name, Contact Person, and Mobile');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const stateCode = stateName.slice(0, 2).toUpperCase();
    const generatedBuyerId = `BYR-${stateCode}-${randomNum}`;

    const newBuyerProfile: UserProfile = {
      id: `usr-buyer-${Date.now()}`,
      name: `${contactPerson.trim()} (${companyName.trim()})`,
      role: 'buyer',
      identifier: generatedBuyerId,
      mobile: mobile.trim(),
      email: email.trim() || `procure@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      location: `${city ? city + ', ' : ''}${stateName}`,
      state: stateName,
      district: city || 'Central Hub',
      verificationStatus: 'verified',
      gstin: gstin.trim(),
      tradeCategory: tradeCategory,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    };

    setIsSubmitting(true);
    try {
      await registerUser(newBuyerProfile, traderPin);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not submit the registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Buyer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Direct Agro-Buyer Portal • நேரடி வாங்குபவர்
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              Bulk Trade
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Bulk Farmer Procurement, Direct Farm Gate Purchase, Escrow Transactions & Invoicing
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
              ? 'bg-white dark:bg-black text-amber-700 dark:text-amber-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          🛒 Buyer Sign In / உள்நுழைவு
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setErrorMessage(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'register'
              ? 'bg-white dark:bg-black text-amber-700 dark:text-amber-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          📝 Buyer Business Registration / பதிவு
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
              Buyer ID / Business Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                placeholder="e.g. BYR-DL-8821 or 9711223344"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all"
                required
              />
              <Building className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Registered APMC trader or wholesale buyer ID
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Trader Security Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>{isSubmitting ? 'Signing in…' : 'Sign In to Buyer Marketplace'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Quick Demo Fill for Buyer */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => loginAsRole('buyer')}
              className="w-full p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold flex items-center justify-between hover:bg-amber-100 transition-colors"
            >
              <span>Instant Test: <strong>Priya Sharma</strong> (BYR-DL-8821)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600 text-white font-bold">1-Click</span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company / Firm Trading Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Sri Murugan Agro Traders"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
                <Building className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Authorized Contact Person *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Trade Category
              </label>
              <select
                value={tradeCategory}
                onChange={(e) => setTradeCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="Rice & Grain Miller">Rice & Grain Miller</option>
                <option value="Wholesale Mandi Trader">Wholesale Mandi Trader</option>
                <option value="Agro Food Processor">Agro Food Processor</option>
                <option value="Agricultural Exporter">Agricultural Exporter</option>
                <option value="Retail Supermarket Chain">Retail Supermarket Chain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Business Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                GSTIN / FSSAI License No.
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 07AAACA1234F1Z5"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-mono focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
                <FileCheck className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Business Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@agrotraders.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                City & State
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City / Mandi Hub"
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
                Create Account Password *
              </label>
              <input
                type="password"
                value={traderPin}
                onChange={(e) => setTraderPin(e.target.value)}
                placeholder="Create secure password"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-xs"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting…' : 'Complete Buyer Registration & Access Direct Marketplace'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
