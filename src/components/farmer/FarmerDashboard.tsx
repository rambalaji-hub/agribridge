import React from 'react';
import { 
  Sprout, 
  Ticket, 
  CalendarClock, 
  Activity, 
  CreditCard, 
  Users, 
  ArrowRight, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Receipt, 
  PlusCircle, 
  FileText, 
  AlertCircle, 
  TrendingUp, 
  Scale 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProcurementBooking, ProcurementStage } from '../../types';

export const FarmerDashboard: React.FC = () => {
  const { 
    currentUser, 
    bookings, 
    openDetailDrawer, 
    setActiveTab, 
    speakText, 
    advanceQueueForCentre, 
    t,
    tD,
    localizeCrop,
    localizeMandi,
    language,
    centres
  } = useApp();

  const userBookings = bookings.filter(b => b.farmerId === currentUser?.id || b.tokenNumber === '#AG240024');
  const defaultFallbackBooking: ProcurementBooking = {
    id: 'sample-fb-01',
    tokenNumber: '#AG240024',
    farmerId: currentUser?.id || 'farmer-01',
    farmerName: currentUser?.name || 'Sardar Ramesh Kumar',
    farmerMobile: '9876543210',
    crop: 'Paddy (Dhan)',
    quantityQuintals: 65,
    centreId: 'centre-01',
    centreName: 'Taraori Grain Market Yard #4',
    bookingDate: '2026-09-17',
    slotTime: '10:30 AM - 12:00 PM',
    status: 'waiting',
    queuePosition: 8,
    estimatedWaitMinutes: 32,
    createdAt: new Date().toISOString(),
    qrPayload: 'AGRI-GATE-ENTRY-KNL-2026-0024',
  };
  const activeBooking: ProcurementBooking = userBookings.find(b => b.status !== 'completed' && b.status !== 'rejected') || userBookings[0] || bookings[0] || defaultFallbackBooking;

  const stages: { key: ProcurementStage; label: string }[] = [
    { key: 'booking_confirmed', label: t.stageBookingConfirmed },
    { key: 'token_generated', label: t.stageTokenGenerated },
    { key: 'waiting', label: t.stageWaiting },
    { key: 'called', label: t.stageCalled },
    { key: 'weighing', label: t.stageWeighing },
    { key: 'quality_check', label: t.stageQualityCheck },
    { key: 'approved', label: t.stageApproved },
    { key: 'payment_processing', label: t.stagePaymentProcessing },
    { key: 'paid', label: t.stagePaid },
    { key: 'completed', label: t.stageCompleted },
  ];

  const currentStageIndex = stages.findIndex(s => s.key === (activeBooking?.status || 'waiting'));

  const handleListenQueueSummary = () => {
    speakText(t.voiceQueueStatus, language);
  };

  return (
    <div className="space-y-6">
      {/* Header with Welcome, Verified Identity and Action Buttons */}
      <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {t.verifiedFarmerBadge}
            </span>
            <span className="text-xs text-slate-400 font-mono bg-slate-100 dark:bg-neutral-900 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
              {currentUser?.identifier || 'PB-FARM-90214'}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            {t.welcomeBack}, {currentUser?.name || 'Sardar Ramesh Kumar'}
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
            {t.procurementSubtitle}
          </p>

          <div className="mt-3 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              {t.registeredMandiLabel}: <strong className="text-slate-800 dark:text-white">{localizeMandi('Punjab Agro APMC Khanna Hub')}</strong>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t.activeLotLabel}: <strong className="text-slate-800 dark:text-white">{localizeCrop('Paddy (Grade A)')} &bull; 65 {tD('quintalsUnit', 'Quintals')}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          <button
            onClick={handleListenQueueSummary}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold text-xs flex items-center gap-2 transition-all shadow-2xs"
            title="Listen to Status in chosen language"
          >
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">{t.voiceListen}</span>
          </button>

          <button
            id="book-slot-primary-btn"
            onClick={() => setActiveTab('book-slot')}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.bookSlotBtn}</span>
          </button>
        </div>
      </div>

      {/* Top 5 Procurement Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Registered Crops */}
        <div 
          onClick={() => setActiveTab('crop-details')}
          className="bg-white dark:bg-black p-4 rounded-xl border border-slate-200/90 dark:border-white/10 hover:border-emerald-400/80 dark:hover:border-emerald-600 shadow-2xs hover:shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.registeredCrops}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-2xl font-black text-slate-900 dark:text-white mt-2">
            {tD('threeCropsCount', '3 Crops')}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
            <span className="font-medium text-emerald-700 dark:text-emerald-400 truncate">{t.threeCropsSummary}</span>
          </div>
        </div>

        {/* Card 2: Upcoming Slot */}
        <div 
          onClick={() => openDetailDrawer('booking', activeBooking)}
          className="bg-white dark:bg-black p-4 rounded-xl border border-slate-200/90 dark:border-white/10 hover:border-sky-400/80 dark:hover:border-sky-600 shadow-2xs hover:shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.upcomingSlot}</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-xl font-black text-slate-900 dark:text-white mt-2 truncate">
            {activeBooking?.slotTime ? activeBooking.slotTime.split('-')[0] : '10:30 AM'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {activeBooking?.bookingDate || t.todayDateLabel} &bull; {t.gateBayLabel}
          </div>
        </div>

        {/* Card 3: Active Token */}
        <div 
          onClick={() => setActiveTab('live-queue')}
          className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 shadow-2xs hover:shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">{t.activeToken}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-2">
            {activeBooking?.tokenNumber || '#AG240024'}
          </div>
          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.positionInQueueLabel} #{activeBooking?.queuePosition || 8}</span>
          </div>
        </div>

        {/* Card 4: Procurement Status */}
        <div 
          onClick={() => setActiveTab('procurement-status')}
          className="bg-white dark:bg-black p-4 rounded-xl border border-slate-200/90 dark:border-white/10 hover:border-indigo-400/80 dark:hover:border-indigo-600 shadow-2xs hover:shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.procStatus}</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-sm font-bold text-slate-900 dark:text-white mt-2 capitalize truncate">
            {stages[currentStageIndex]?.label || t.stageWaiting}
          </div>
          <div className="text-[11px] text-indigo-700 dark:text-indigo-300 font-bold mt-1">
            {t.stageActiveProgress.replace('{stage}', String(Math.max(1, currentStageIndex + 1)))}
          </div>
        </div>

        {/* Card 5: Expected Direct Benefit Payment */}
        <div 
          onClick={() => setActiveTab('payments')}
          className="bg-white dark:bg-black p-4 rounded-xl border border-slate-200/90 dark:border-white/10 hover:border-amber-400/80 dark:hover:border-amber-600 shadow-2xs hover:shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.expectedDbtLabel}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-xl font-black text-slate-900 dark:text-white mt-2">
            ₹1,50,800
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {t.expectedDbtSub}
          </div>
        </div>
      </div>

      {/* Upcoming Booking & Queue Spotlight Section */}
      <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {t.liveScheduleLabel}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {t.tokenIdLabel}: <strong className="font-mono text-slate-700 dark:text-slate-200">{activeBooking.tokenNumber}</strong>
              </span>
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white mt-1">
              {t.upcomingBooking}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => advanceQueueForCentre(activeBooking.centreId)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Simulate Queue Movement"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.simQueueAdvanceBtn}</span>
            </button>
            <button
              onClick={() => openDetailDrawer('booking', activeBooking)}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              {t.viewDetails} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Booking Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 py-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200/80 dark:border-white/10">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">{t.cropParamLabel}</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{localizeCrop(activeBooking.crop)}</span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">{t.gradeAQualityLabel}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200/80 dark:border-white/10">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">{t.declaredQtyLabel}</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{activeBooking.quantityQuintals} {tD('qtlUnit', 'Qtl')}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{t.approxBagsLabel}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200/80 dark:border-white/10 col-span-2">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">{t.mandiCentreLabel}</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 truncate block">{localizeMandi(activeBooking.centreName)}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{t.weighbridgeBayLabel}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200/80 dark:border-white/10">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">{t.slotTimeLabel}</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{activeBooking.slotTime}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{activeBooking.bookingDate || t.todayDateLabel}</span>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-emerald-800 dark:text-emerald-300 block text-[10px] uppercase font-bold tracking-wider">{t.queuePosition}</span>
            <span className="font-black text-emerald-900 dark:text-emerald-100 text-base mt-0.5 block">
              #{activeBooking.queuePosition || 8}
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">{t.liveCallingGateLabel}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200/80 dark:border-white/10">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">{t.estimatedWaitLabel}</span>
            <span className="font-bold text-slate-900 dark:text-white text-base mt-0.5 block">
              {activeBooking.estimatedWaitMinutes || 32} {tD('minutesUnit', 'mins')}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{t.approxVehiclesAheadLabel}</span>
          </div>
        </div>

        {/* Visual Timeline (10 Stages Progression) */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t.procurementTimeline}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {t.currentStageLabel}: <span className="uppercase">{stages[currentStageIndex]?.label || 'WAITING'}</span>
            </span>
          </div>

          <div className="relative">
            <div className="overflow-x-auto pb-3 scrollbar-thin">
              <div className="flex items-center min-w-[760px] justify-between relative px-2">
                {/* Connecting bar */}
                <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 dark:bg-neutral-800 z-0 rounded-full" />
                <div 
                  className="absolute top-4 left-6 h-1 bg-emerald-600 z-0 rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 95}%` }}
                />

                {stages.map((st, idx) => {
                  const isCompleted = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={st.key} className="flex flex-col items-center relative z-10 text-center px-1">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          isCompleted
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-200 dark:ring-emerald-900'
                            : isCurrent
                            ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 animate-pulse'
                            : 'bg-white dark:bg-neutral-900 border-2 border-slate-300 dark:border-white/20 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] mt-2 max-w-[74px] leading-tight ${
                        isCurrent 
                          ? 'font-bold text-emerald-900 dark:text-emerald-300' 
                          : isCompleted
                          ? 'font-semibold text-slate-700 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-500 font-medium'
                      }`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bento Grid */}
      <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              {t.quickActions}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.quickActionsSubtitle}</p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            {t.fastToolsBadge}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <button
            onClick={() => setActiveTab('book-slot')}
            className="p-4 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 text-left transition-all group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs text-slate-900 dark:text-white block">{t.bookSlotActionTitle}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{t.bookSlotActionDesc}</span>
          </button>

          <button
            onClick={() => openDetailDrawer('booking', activeBooking)}
            className="p-4 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-sky-500/50 hover:bg-sky-50/40 dark:hover:bg-sky-950/30 text-left transition-all group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-2xs">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs text-slate-900 dark:text-white block">{t.viewTokenActionTitle}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{t.viewTokenActionDesc}</span>
          </button>

          <button
            onClick={() => setActiveTab('live-queue')}
            className="p-4 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-amber-500/50 hover:bg-amber-50/40 dark:hover:bg-amber-950/30 text-left transition-all group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs text-slate-900 dark:text-white block">{t.trackQueueActionTitle}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{t.trackQueueActionDesc}</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className="p-4 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-indigo-500/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 text-left transition-all group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs text-slate-900 dark:text-white block">{t.dbtTrackerActionTitle}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{t.dbtTrackerActionDesc}</span>
          </button>

          <button
            onClick={() => setActiveTab('weigh-slip')}
            className="p-4 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-teal-500/50 hover:bg-teal-50/40 dark:hover:bg-teal-950/30 text-left transition-all group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-2xs">
              <Scale className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs text-slate-900 dark:text-white block">{t.weighSlipActionTitle}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{t.weighSlipActionDesc}</span>
          </button>

          <button
            onClick={() => setActiveTab('direct-marketplace')}
            className="p-4 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-purple-500/50 hover:bg-purple-50/40 dark:hover:bg-purple-950/30 text-left transition-all group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xs text-slate-900 dark:text-white block">{t.surplusTradeActionTitle}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{t.surplusTradeActionDesc}</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              {t.recentTransactions}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.recentTransactionsSub}</p>
          </div>
          <button
            onClick={() => setActiveTab('payments')}
            className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            {t.viewAllRecordsBtn}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 uppercase text-[10px] font-bold">
                <th className="pb-3 pr-4">{t.thTransactionToken}</th>
                <th className="pb-3 pr-4">{t.thCrop}</th>
                <th className="pb-3 pr-4">{t.thQuantity}</th>
                <th className="pb-3 pr-4">{t.thRateMsp}</th>
                <th className="pb-3 pr-4">{t.thTotalCredited}</th>
                <th className="pb-3 pr-4">{t.thBankUtr}</th>
                <th className="pb-3">{t.thStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              <tr 
                onClick={() => openDetailDrawer('payment', bookings[3]?.paymentDetails)}
                className="hover:bg-slate-50/80 dark:hover:bg-neutral-900/60 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                  {bookings[3]?.paymentDetails?.transactionId || 'TXN-DBT-2026-99201'}
                  <span className="block text-[10px] text-slate-400 font-sans font-normal">04 May 2026 &bull; Slot 11:00 AM</span>
                </td>
                <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                  {t.wheatGehunCrop}
                  <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-normal">{t.faqGradeAQuality}</span>
                </td>
                <td className="py-3.5 pr-4 font-medium text-slate-700 dark:text-slate-300">
                  109.78 {tD('quintalsUnit', 'Quintals')}
                </td>
                <td className="py-3.5 pr-4 font-semibold text-emerald-800 dark:text-emerald-400">
                  ₹2,275 / {tD('qtlUnit', 'Qtl')}
                </td>
                <td className="py-3.5 pr-4 font-heading font-black text-slate-900 dark:text-white text-sm">
                  ₹2,49,749.50
                </td>
                <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-slate-800 dark:text-slate-200">PNB ••• 4019</span>
                  <span className="block text-[10px] font-mono text-slate-400 dark:text-slate-500">PFMS Batch #998811</span>
                </td>
                <td className="py-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    {t.directDbtCreditedBadge}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
