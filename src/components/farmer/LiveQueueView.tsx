import React from 'react';
import { 
  Users, 
  Clock, 
  Volume2, 
  Ticket, 
  Activity, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  AlertCircle,
  Truck,
  Scale,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LiveQueueView: React.FC = () => {
  const { 
    bookings, 
    currentUser, 
    advanceQueueForCentre, 
    speakText, 
    centres, 
    openDetailDrawer,
    openPrintModal,
    language,
    t,
    tD,
    localizeCrop,
    localizeMandi
  } = useApp();

  const myBooking = bookings.find(b => b.farmerId === currentUser?.id || b.tokenNumber === '#AG240024') || bookings[0];
  const centre = centres.find(c => c.id === myBooking?.centreId) || centres[0];

  const handleAnnounceQueue = () => {
    let text = '';
    const ahead = myBooking.queuePosition ? myBooking.queuePosition - 1 : 7;
    const wait = myBooking.estimatedWaitMinutes || 32;

    if (language === 'ta') {
      text = `கொள்முதல் மையத்தின் தற்போதைய டோக்கன் எண் ஏ.ஜி. 240016. உங்கள் டோக்கன் எண் ${myBooking.tokenNumber}. உங்களுக்கு முன் ${ahead} விவசாயிகள் உள்ளனர். தோராயமான காத்திருப்பு நேரம் ${wait} நிமிடங்கள்.`;
    } else if (language === 'hi') {
      text = `वर्तमान में बुलाया गया टोकन नंबर ए.जी. 240016 है। आपका टोकन नंबर ${myBooking.tokenNumber} है। आपके आगे ${ahead} किसान हैं। अनुमानित प्रतीक्षा समय ${wait} मिनट है।`;
    } else if (language === 'te') {
      text = `ప్రస్తుతం వేబ్రిడ్జ్ వద్ద పిలవబడిన టోకెన్ నంబర్ ఏ.జీ. 240016. మీ టోకెన్ నంబర్ ${myBooking.tokenNumber}. మీ ముందు ${ahead} మంది రైతులు ఉన్నారు. నిరీక్షణ సమయం ${wait} నిమిషాలు.`;
    } else if (language === 'kn') {
      text = `ಪ್ರಸ್ತುತ ಕರೆಯಲಾದ ಟೋಕನ್ ಸಂಖ್ಯೆ ಎ.ಜಿ. 240016. ನಿಮ್ಮ ಟೋಕನ್ ಸಂಖ್ಯೆ ${myBooking.tokenNumber}. ನಿಮ್ಮ ಮುಂದೆ ${ahead} ರೈತರಿದ್ದಾರೆ. ಅಂದಾಜು ಕಾಯುವ ಸಮಯ ${wait} ನಿಮಿಷಗಳು.`;
    } else if (language === 'ml') {
      text = `ഇപ്പോൾ വിളിച്ച ടോക്കൺ നമ്പർ എ.ജി. 240016 ആണ്. നിങ്ങളുടെ ടോക്കൺ നമ്പർ ${myBooking.tokenNumber}. നിങ്ങളുടെ മുന്നിൽ ${ahead} കർഷകരുണ്ട്. കാത്തിരിപ്പ് സമയം ${wait} മിനിറ്റാണ്.`;
    } else if (language === 'mr') {
      text = `सध्या वजन काट्यावर बोलावलेला टोकन क्रमांक ए.जी. 240016 आहे. तुमचा टोकन क्रमांक ${myBooking.tokenNumber} आहे. तुमच्या पुढे ${ahead} शेतकरी आहेत. अंदाजे प्रतीक्षा वेळ ${wait} मिनिटे आहे.`;
    } else {
      text = `Current token called at weighbridge is AG 240016. Your token is ${myBooking.tokenNumber}. You have ${ahead} farmers ahead. Estimated wait time is ${wait} minutes.`;
    }
    speakText(text, language);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner with Audio and Simulation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {tD('liveQueueTelemetry')}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {tD('realTimeQueueTokenTracker')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {tD('centreLabel')}: <strong>{localizeMandi(centre.name)}</strong> &bull; {tD('operatingStatusLabel')}: <strong>{centre.operatingStatus === 'Operational' ? tD('operatingNormal', 'Operational') : centre.operatingStatus}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openPrintModal('token', myBooking, true)}
            id="print-queue-token-btn"
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
            title="Print Official Government Gate Token"
          >
            <Printer className="w-4 h-4" />
            <span>{tD('printTokenSlip')}</span>
          </button>

          <button
            onClick={handleAnnounceQueue}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">{tD('listenAnnouncement')}</span>
          </button>

          <button
            onClick={() => advanceQueueForCentre(centre.id)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
            title="Simulate queue advance"
          >
            <Play className="w-3.5 h-3.5 fill-current text-slate-500" />
            <span>{tD('advanceTest')}</span>
          </button>
        </div>
      </div>

      {/* Main 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Token # */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                {tD('yourTokenNumber')}
              </span>
              <button
                onClick={() => openPrintModal('token', myBooking, true)}
                className="p-1 rounded-lg hover:bg-emerald-200/50 text-emerald-800 dark:text-emerald-300 transition-colors"
                title="Print this token"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-3xl font-black font-mono text-emerald-900 dark:text-emerald-200 mt-2">
              {myBooking.tokenNumber}
            </div>
          </div>
          <span className="text-[10px] text-emerald-800 dark:text-emerald-300 mt-2 block">
            {tD('cropParamLabel')}: {localizeCrop(myBooking.crop)} ({myBooking.quantityQuintals} {tD('qtlUnit')})
          </span>
        </div>

        {/* Current Position */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {tD('queuePosition')}
          </span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            #{myBooking.queuePosition || 8}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {myBooking.queuePosition ? myBooking.queuePosition - 1 : 7} {tD('farmersAheadOfYou')}
          </span>
        </div>

        {/* Estimated Wait */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {tD('estimatedWaitingTime')}
          </span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {myBooking.estimatedWaitMinutes || 32} <span className="text-sm font-semibold text-slate-400">{tD('minutesUnit')}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {tD('averageServiceRate')}
          </span>
        </div>

        {/* Currently Serving */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
            {tD('currentlyAtWeighbridge')}
          </span>
          <div className="text-3xl font-black font-mono text-white mt-2">
            #AG240016
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {tD('weighbridgeBayTesting')}
          </span>
        </div>
      </div>

      {/* Visual Queue Stage Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>{tD('centreQueueLineSim')}</span>
        </h3>

        {/* Flow Representation */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">{tD('gateInflow')}</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm block mt-1">#AG240028</span>
            <span className="text-[10px] text-slate-400">{tD('securityScanned')}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">{tD('yardStaging')}</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm block mt-1">#AG240026</span>
            <span className="text-[10px] text-slate-400">{tD('moistureSampling')}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-600 text-center ring-2 ring-emerald-600/30">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block uppercase">{tD('yourPositionStage')}</span>
            <span className="font-mono font-black text-emerald-900 dark:text-emerald-200 text-sm block mt-1">{myBooking.tokenNumber}</span>
            <span className="text-[10px] font-bold text-emerald-700">{tD('inCallingLine')}</span>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950 border border-sky-200 text-center">
            <span className="text-[10px] font-bold text-sky-700 block uppercase">{tD('bay1GrossWeight')}</span>
            <span className="font-mono font-bold text-sky-900 dark:text-sky-200 text-sm block mt-1">#AG240020</span>
            <span className="text-[10px] text-sky-600">{tD('tareCalculation')}</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 text-center">
            <span className="text-[10px] font-bold text-indigo-700 block uppercase">{tD('bay2Unloading')}</span>
            <span className="font-mono font-bold text-indigo-900 dark:text-indigo-200 text-sm block mt-1">#AG240016</span>
            <span className="text-[10px] text-indigo-600">{tD('siloDischarge')}</span>
          </div>
        </div>
      </div>

      {/* Active Queue Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {tD('currentTokensSequence')}
          </h3>
          <span className="text-xs text-slate-400">{tD('updatedRecently')}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3 pr-4">{tD('thSeq')}</th>
                <th className="pb-3 pr-4">{tD('tokenCol')}</th>
                <th className="pb-3 pr-4">{tD('farmerNameLabel')}</th>
                <th className="pb-3 pr-4">{tD('cropParamLabel')}</th>
                <th className="pb-3 pr-4">{tD('netQuantityCol')}</th>
                <th className="pb-3 pr-4">{tD('vehicleTrailerLabel')}</th>
                <th className="pb-3 pr-4">{tD('bayCol')}</th>
                <th className="pb-3">{tD('stageCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.slice(0, 6).map((b, idx) => (
                <tr 
                  key={b.id} 
                  onClick={() => openDetailDrawer('booking', b)}
                  className={`cursor-pointer transition-colors ${
                    b.tokenNumber === myBooking.tokenNumber
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <td className="py-3 pr-4 font-mono">{idx + 1}</td>
                  <td className="py-3 pr-4 font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    {b.tokenNumber}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-slate-200">
                    {b.farmerName}
                  </td>
                  <td className="py-3 pr-4">{localizeCrop(b.crop)}</td>
                  <td className="py-3 pr-4">{b.quantityQuintals} {tD('qtlUnit')}</td>
                  <td className="py-3 pr-4 font-mono text-slate-500">PB-08-AG-{3000 + idx}</td>
                  <td className="py-3 pr-4 text-slate-500">Bay #{((idx % 3) + 1)}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                      {b.status ? String(b.status).replace(/_/g, ' ') : 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
