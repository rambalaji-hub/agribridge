import React, { useState } from 'react';
import { 
  Sprout, 
  Building2, 
  ShoppingCart, 
  HeartHandshake, 
  Landmark, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Scale, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Phone, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Globe,
  Volume2,
  FileText,
  AlertTriangle,
  Award,
  Users,
  Search,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, LanguageCode } from '../../types';

// Import generated procurement project images
import mandiHeroImg from '../../assets/images/agricultural_procurement_hero_1789721128951.jpg';
import grainTestingImg from '../../assets/images/grain_quality_testing_1789718793565.jpg';
import warehouseImg from '../../assets/images/procurement_warehouse_1789718810574.jpg';

interface LandingPageProps {
  onSelectRolePortal: (role: UserRole) => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRolePortal,
  onOpenLogin,
}) => {
  const { 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    loginAsRole, 
    centres, 
    openVoiceModal, 
    speakText 
  } = useApp();

  // Calculator state
  const [calcCrop, setCalcCrop] = useState('Paddy (Grade A)');
  const [calcQty, setCalcQty] = useState<number>(45);

  const mspRatesList = [
    { crop: 'Paddy (Grade A)', tamil: 'நெல் (கிரேடு ஏ)', msp: 2320, season: 'Kharif', lastYear: 2203, change: '+₹117' },
    { crop: 'Paddy (Common)', tamil: 'நெல் (சாதாரண)', msp: 2300, season: 'Kharif', lastYear: 2183, change: '+₹117' },
    { crop: 'Wheat', tamil: 'கோதுமை', msp: 2275, season: 'Rabi', lastYear: 2125, change: '+₹150' },
    { crop: 'Maize / Corn', tamil: 'மக்காச்சோளம்', msp: 2090, season: 'Kharif', lastYear: 1962, change: '+₹128' },
    { crop: 'Moong (Green Gram)', tamil: 'பாசிப்பயறு', msp: 8682, season: 'Kharif', lastYear: 8558, change: '+₹124' },
    { crop: 'Cotton (Medium)', tamil: 'பருத்தி (நடுத்தர இழை)', msp: 7121, season: 'Kharif', lastYear: 6620, change: '+₹501' },
    { crop: 'Groundnut in Shell', tamil: 'நிலக்கடலை', msp: 6783, season: 'Kharif', lastYear: 6377, change: '+₹406' },
    { crop: 'Soyabean (Yellow)', tamil: 'சோயாபீன்', msp: 4892, season: 'Kharif', lastYear: 4600, change: '+₹292' },
  ];

  const selectedCropMsp = mspRatesList.find(c => c.crop === calcCrop)?.msp || 2320;
  const calculatedEarnings = (calcQty * selectedCropMsp).toLocaleString('en-IN');

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-black text-slate-900 dark:text-slate-100 selection:bg-emerald-100 transition-colors">
      
      {/* 1. TOP OFFICIAL ANNOUNCEMENT BAR */}
      <div className="bg-emerald-800 dark:bg-emerald-950 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/50">
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-emerald-600 dark:bg-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Official Govt Portal
          </span>
          <span>Department of Food, Civil Supplies & Agricultural Marketing • DPC KMS 2025-26</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-100 text-[11px]">
          <span className="hidden sm:inline">Kisan Toll-Free: <strong>1800-180-1551</strong></span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">24x7 Mandi Grievance Cell: <strong>1967</strong></span>
        </div>
      </div>

      {/* 2. PRIMARY NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  AgriBridge
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  e-Procure
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
                வேளாண் மின்-கொள்முதல் & நேரடி சந்தை தளம்
              </p>
            </div>
          </div>

          {/* Quick Nav Anchors for Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#overview" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Overview</a>
            <a href="#procurement-flow" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Procurement Flow</a>
            <a href="#live-stats" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Live Mandi Stats</a>
            <a href="#msp-rates" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">MSP Rates</a>
            <a href="#portals" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Role Portals</a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Voice Assistant Button */}
            <button
              onClick={openVoiceModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              title="Voice Assisted Navigation in Tamil/Hindi"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice / குரல்</span>
            </button>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-slate-50 dark:bg-neutral-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ml">മലയാളം</option>
              <option value="mr">मराठी</option>
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-white/10 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Login CTA Button */}
            <button
              onClick={onOpenLogin}
              id="landing-portal-login-btn"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 group"
            >
              <span>Portal Sign In / உள்நுழைவு</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </header>

      {/* 3. HERO SECTION WITH GENERATED PROCUREMENT MANDI IMAGE */}
      <section id="overview" className="relative pt-8 pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & Call to Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>National Agricultural MSP Procurement & Mandi Digitization Mission</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                  Transparent MSP Procurement, Digital Weighment & Direct Farm Gate Trade
                </h1>
                <p className="text-sm sm:text-base text-emerald-800 dark:text-emerald-400 font-bold">
                  நேர்மையான ஆதரவு விலை (MSP), வெளிப்படையான டிஜிட்டல் எடை & உழவர் நேரடி விற்பனை
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  AgriBridge connects <strong>Farmers, APMC Mandi Officers, Bulk Millers & Buyers</strong> in an end-to-end e-governance workflow. Book arrival tokens from home, eliminate 2-day tractor waiting queues, verify calibrated electronic weighbridge slips, and receive 100% Direct Benefit Transfer (DBT) into your bank account within 48 hours.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectRolePortal('farmer')}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 group"
                >
                  <Sprout className="w-4 h-4" />
                  <span>Farmer Slot Booking & Login / உழவர் டோக்கன்</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onSelectRolePortal('officer')}
                  className="px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Officer Mandi Portal / அதிகாரி</span>
                </button>

                <button
                  onClick={() => onSelectRolePortal('buyer')}
                  className="px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buyer Marketplace / வாங்குபவர்</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero Middleman Cuts</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>48h Direct DBT Transfer</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Aadhaar E-KYC Verified</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>SMS & Voice Token Updates</span>
                </div>
              </div>

            </div>

            {/* Right Column: Clean Procurement Hero Image (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 bg-slate-900 group">
                <img
                  src={mandiHeroImg}
                  alt="Agricultural Grain Procurement Center"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 lg:h-[430px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. REAL-TIME PROCUREMENT TELEMETRY STATS */}
      <section id="live-stats" className="py-8 bg-emerald-900 text-white border-y border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 text-center">
            
            <div className="p-3">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-300 tracking-tight block">
                1,48,250
              </span>
              <span className="text-xs font-medium text-emerald-100 mt-1 block">
                Quintals Grain Procured (நடப்பு கொள்முதல்)
              </span>
            </div>

            <div className="p-3">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-300 tracking-tight block">
                ₹34.46 Cr
              </span>
              <span className="text-xs font-medium text-emerald-100 mt-1 block">
                Direct DBT Disbursed (நேரடி வங்கி பரிமாற்றம்)
              </span>
            </div>

            <div className="p-3">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-300 tracking-tight block">
                24,800+
              </span>
              <span className="text-xs font-medium text-emerald-100 mt-1 block">
                Farmers Protected under MSP (பயனடைந்த உழவர்கள்)
              </span>
            </div>

            <div className="p-3">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-300 tracking-tight block">
                18 Mandis
              </span>
              <span className="text-xs font-medium text-emerald-100 mt-1 block">
                Live Digitized DPC Centers (செயல்பாட்டிலுள்ள மையங்கள்)
              </span>
            </div>

            <div className="p-3 col-span-2 md:col-span-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-300 tracking-tight block">
                18 Mins
              </span>
              <span className="text-xs font-medium text-emerald-100 mt-1 block">
                Avg Turnaround Time (சராசரி காத்திருப்பு நேரம்)
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 5. STEP-BY-STEP PROCUREMENT PIPELINE WITH GENERATED IMAGES */}
      <section id="procurement-flow" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>End-to-End Digital Workflow • முழுமையான கொள்முதல் முறை</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How AgriBridge Modernizes Agricultural Procurement
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Eliminating traditional mandi bottlenecks with scheduled token management, scientific testing, calibrated weighbridge telemetry, and zero-leakage direct bank disbursement.
          </p>
        </div>

        {/* Step 1 & 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-10">
          
          {/* Step 1: Token Scheduling */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow-md">
                  1
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Pre-Arrival Slot
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Intelligent Slot Booking & Digital Mandi Token
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Farmers or CSC village operators choose a convenient date and time window from their smartphone or local kiosk. The system predicts queue density, books the nearest DPC centre, and issues an SMS token with QR code.
              </p>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 text-xs space-y-1.5">
                <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero Queue Congestion</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Farmers arrive directly at their scheduled time, avoiding overnight tractor parking on highways.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Supports 7 Regional Languages</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 2: Quality Inspection with Generated Image */}
          <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 shadow-md overflow-hidden flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative">
              <img
                src={grainTestingImg}
                alt="Grain Moisture & Quality Testing Analyzer at Procurement Center"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Step 2 • Scientific Quality Lab</span>
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Electronic Moisture Meter & FAQ Grading
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  At the inspection bay, certified APMC officers sample grain with electronic moisture sensors and digital optical graders. Fair Average Quality (FAQ) certification is issued instantly on the tablet.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Moisture Standard: ≤17.0%</span>
                <span>•</span>
                <span>Foreign Matter: ≤1.0%</span>
                <span>•</span>
                <span>Instant Slip Sync</span>
              </div>
            </div>
          </div>

        </div>

        {/* Step 3, 4 & 5 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 3: Digital Weighbridge */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="w-9 h-9 rounded-xl bg-sky-600 text-white font-black text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tamper-Proof Electronic Weighbridge
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Tractor trolley gross weight and tare weight are automatically recorded via IoT-calibrated digital weighbridges. A tamper-proof printed Weigh Slip is handed to the farmer on the spot.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-900 dark:text-sky-300 text-[11px] font-semibold border border-sky-200 dark:border-sky-800">
              Direct telemetry sync prevents weight manipulation.
            </div>
          </div>

          {/* Step 4: Warehouse Storage with Generated Image */}
          <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 shadow-md overflow-hidden flex flex-col justify-between">
            <div className="h-36 overflow-hidden relative">
              <img
                src={warehouseImg}
                alt="FCI and State Warehouse Grain Sacks Stacking and Logistics Dispatch"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                Step 4 • Safe Storage
              </div>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                FCI & SWC Godown Barcode Stacking
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Procured grain bags are batch-coded with tamper seals and transferred directly to Food Corporation of India godowns or state buffer reserves.
              </p>
            </div>
          </div>

          {/* Step 5: Direct Benefit Transfer */}
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                5
              </span>
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300">
                Direct Benefit Transfer (DBT) in 48 Hours
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                As soon as the Procurement Officer verifies the weigh slip, payment vouchers are queued on PFMS. Funds are credited directly to the farmer's Aadhaar-linked bank account without middlemen.
              </p>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Direct Bank SMS & Receipt Generation</span>
            </div>
          </div>

        </div>

      </section>

      {/* 6. INTERACTIVE MSP RATES TABLE & INCOME CALCULATOR */}
      <section id="msp-rates" className="py-16 bg-slate-50 dark:bg-neutral-950 border-t border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Live MSP Rate Board (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>Government Notified Minimum Support Prices (KMS 2025-26)</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Official Procurement MSP Rates • குறைந்தபட்ச ஆதரவு விலை
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fixed benchmark prices guaranteed by the Central and State Governments for farmer grain procurement.
                </p>
              </div>

              {/* MSP Table */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-neutral-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
                      <tr>
                        <th className="py-3 px-4">Crop / பயிர் வகை</th>
                        <th className="py-3 px-3">Season</th>
                        <th className="py-3 px-3">Current MSP (₹/Qtl)</th>
                        <th className="py-3 px-3">Hike</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {mspRatesList.map((item) => (
                        <tr key={item.crop} className="hover:bg-slate-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 dark:text-white block">{item.crop}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.tamil}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300">
                              {item.season}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                              ₹{item.msp}
                            </span>
                            <span className="text-[10px] text-slate-400 block">per 100 kg</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              {item.change}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setCalcCrop(item.crop);
                                const calcElem = document.getElementById('msp-calculator');
                                if (calcElem) calcElem.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold hover:bg-emerald-100"
                            >
                              Calculate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Farmer Payout Calculator (5 cols) */}
            <div id="msp-calculator" className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg p-6 space-y-5">
              
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    MSP Income Estimator • வருமானக் கணிப்பான்
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Calculate your guaranteed government payout before visiting the mandi
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Your Harvested Crop:
                  </label>
                  <select
                    value={calcCrop}
                    onChange={(e) => setCalcCrop(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {mspRatesList.map((c) => (
                      <option key={c.crop} value={c.crop}>
                        {c.crop} — ₹{c.msp} / Quintal ({c.tamil})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Estimated Harvest Quantity (Quintals):
                    </label>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                      {calcQty} Quintals ({calcQty * 100} kg)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={calcQty}
                    onChange={(e) => setCalcQty(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>5 Qtl (Small Farmer)</span>
                    <span>50 Qtl</span>
                    <span>100 Qtl</span>
                    <span>200 Qtl (Bulk)</span>
                  </div>
                </div>

                {/* Calculation Output Box */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block">
                    Guaranteed Mandi Bank Payout:
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                      ₹{calculatedEarnings}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Direct DBT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Net amount transferred directly to your bank account with 0% middleman commission or brokerage fee.
                  </p>
                </div>

                {/* Quick Slot Booking Action */}
                <button
                  onClick={() => onSelectRolePortal('farmer')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Procurement Slot for {calcCrop}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 7. DEDICATED ROLE PORTALS SECTION */}
      <section id="portals" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Dedicated Stakeholder Gateways • ஒவ்வொரு பாத்திரத்திற்கும் தனித்தளம்</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Tailored Portals for Every Participant
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Whether you are a grower booking an arrival slot, an APMC officer managing the electronic weighbridge, or an IAS secretary supervising state-wide procurement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Farmer Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-emerald-200 dark:border-emerald-800/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Farmer</h3>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">உழவர் தளம்</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Slot booking, live queue tokens, moisture checker, weigh slip downloads & direct surplus sales.
              </p>
            </div>
            <button
              onClick={() => onSelectRolePortal('farmer')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Officer Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-sky-200 dark:border-sky-800/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Officer</h3>
                <span className="text-xs font-semibold text-sky-700 dark:text-sky-400 block">கொள்முதல் அதிகாரி</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Mandi queue calling, electronic weighbridge bridge sync, moisture grading & payment approvals.
              </p>
            </div>
            <button
              onClick={() => onSelectRolePortal('officer')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Buyer Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-800/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Buyer</h3>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">நேரடி வாங்குபவர்</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Direct farm gate bulk purchase, grain inspection certificates, transparent escrow & logistics.
              </p>
            </div>
            <button
              onClick={() => onSelectRolePortal('buyer')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Staff Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-purple-200 dark:border-purple-800/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">CSC Staff</h3>
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 block">கிராம உதவியாளர்</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Assisted farmer registration, voice guidance, vernacular kiosk booking for elder farmers.
              </p>
            </div>
            <button
              onClick={() => onSelectRolePortal('assisted')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Admin Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-indigo-200 dark:border-indigo-800/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Admin</h3>
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 block">அரசு நிர்வாகி</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                State APMC surveillance, MSP budget monitoring, grievance redressal & vigilance logs.
              </p>
            </div>
            <button
              onClick={() => onSelectRolePortal('admin')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </section>

      {/* 8. ACTIVE MANDI LOCATIONS IN REGION */}
      <section className="py-12 bg-slate-100/70 dark:bg-neutral-950 border-t border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Digitized Procurement Centres (DPCs)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active APMC mandi centers accepting digital tokens and real-time weighments
              </p>
            </div>
            <button
              onClick={() => onSelectRolePortal('farmer')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All 18 Centres</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {centres.slice(0, 4).map((centre) => (
              <div 
                key={centre.id}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {centre.name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{centre.taluk}, {centre.district}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-100 dark:border-white/5">
                  <div>
                    <span className="text-slate-400 block">Queue Waiting</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{centre.currentQueueCount} farmers</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Est. Wait Time</span>
                    <strong className="text-slate-700 dark:text-slate-300 font-bold">{centre.averageWaitTimeMinutes} mins</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CITIZEN CHARTER & COMPLIANCE FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sprout className="w-5 h-5 text-emerald-500" />
                <span>AgriBridge e-Procurement</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                National Digital Agriculture Infrastructure protecting Indian farmers with guaranteed Minimum Support Price (MSP), tamper-proof weighment, and frictionless DBT.
              </p>
              <div className="text-[10px] text-emerald-400 font-semibold">
                Open Network for Digital Commerce (ONDC) Agriculture Protocol Compliant
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Farmer Services</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => onSelectRolePortal('farmer')} className="hover:text-white">Book Arrival Token</button></li>
                <li><button onClick={() => onSelectRolePortal('farmer')} className="hover:text-white">Live Mandi Queue Tracking</button></li>
                <li><button onClick={() => onSelectRolePortal('farmer')} className="hover:text-white">Download Digital Weigh Slip</button></li>
                <li><button onClick={() => onSelectRolePortal('farmer')} className="hover:text-white">Direct Crop Marketplace</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Government Links</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="#msp-rates" className="hover:text-white">National MSP Notification 2025-26</a></li>
                <li><button onClick={() => onSelectRolePortal('officer')} className="hover:text-white">APMC Centre Administration</button></li>
                <li><button onClick={() => onSelectRolePortal('admin')} className="hover:text-white">IAS State Command Center</button></li>
                <li><button onClick={() => onSelectRolePortal('assisted')} className="hover:text-white">CSC Gramin Mitra Registration</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Help & Support</h4>
              <p className="text-[11px]">Kisan Call Center: <strong>1800-180-1551</strong></p>
              <p className="text-[11px]">Mandi Grievance Desk: <strong>procure-help@agribridge.gov.in</strong></p>
              <p className="text-[11px]">Language support: தமிழ், English, हिन्दी, తెలుగు, ಕನ್ನಡ, മലയാളം, मराठी</p>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 AgriBridge • National Digital Agriculture Infrastructure. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Security Audited (NIC/STQC)</span>
              <span>•</span>
              <span>Data Protection & Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
