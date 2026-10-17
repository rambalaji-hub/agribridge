import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  X, 
  Check, 
  Sparkles, 
  HelpCircle,
  Clock,
  Ticket,
  CreditCard,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';

const LANGUAGES: { code: LanguageCode; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export const VoiceAssistantModal: React.FC = () => {
  const { 
    isVoiceModalOpen, 
    closeVoiceModal, 
    language, 
    setLanguage, 
    speakText, 
    bookings, 
    currentUser,
    centres,
    t
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [voiceQueryText, setVoiceQueryText] = useState('');
  const [assistantReply, setAssistantReply] = useState('');

  if (!isVoiceModalOpen) return null;

  const farmerBooking = bookings.find(b => b.farmerId === currentUser?.id || b.tokenNumber === '#AG240024') || bookings[0];

  const getLocalizedQueries = (lang: LanguageCode) => {
    switch (lang) {
      case 'ta':
        return [
          { label: 'என் டோக்கன் & வரிசை நிலை', query: 'டோக்கன் வரிசை நிலை என்ன?' },
          { label: 'இன்றைய நெல் & சோளம் MSP விலை', query: 'நெல் மற்றும் மக்காச்சோளம் விலை என்ன?' },
          { label: 'வங்கி DBT பணம் வந்துவிட்டதா?', query: 'என் கொள்முதல் பணம் வங்கிக்கு வந்துவிட்டதா?' },
          { label: 'மண்டி நெரிசல் & தாமத விவரம்', query: 'மண்டியில் ஏதேனும் தாமதம் உள்ளதா?' },
        ];
      case 'hi':
        return [
          { label: 'मेरा टोकन और कतार की स्थिति', query: 'मेरी टोकन कतार स्थिति क्या है?' },
          { label: 'आज का धान और मक्का MSP भाव', query: 'धान और मक्का का समर्थन मूल्य क्या है?' },
          { label: 'डीबीटी बैंक खाते में भुगतान की स्थिति', query: 'क्या मेरा खरीद भुगतान आ गया है?' },
          { label: 'मंडी भीड़ और संचालन स्थिति', query: 'क्या खरीद केंद्र पर कोई देरी है?' },
        ];
      case 'te':
        return [
          { label: 'నా టోకెన్ & క్యూ స్థితి', query: 'నా టోకెన్ క్యూ స్థితి ఏమిటి?' },
          { label: 'ఈరోజు ధాన్యం MSP మద్దతు ధర', query: 'ధాన్యం మద్దతు ధర ఎంత?' },
          { label: 'బ్యాంక్ DBT చెల్లింపు స్థితి', query: 'నా ఖాతాలో డబ్బు జమ అయిందా?' },
          { label: 'కేంద్రం రద్దీ మరియు నిరీక్షణ', query: 'కేంద్రంలో ఏదైనా ఆలస్యం ఉందా?' },
        ];
      case 'kn':
        return [
          { label: 'ನನ್ನ ಟೋಕನ್ ಮತ್ತು ಸರದಿ ಸ್ಥಿತಿ', query: 'ನನ್ನ ಟೋಕನ್ ಕ್ಯೂ ಸ್ಥಿತಿ ಏನು?' },
          { label: 'ಇಂದಿನ ಭತ್ತದ MSP ಬೆಲೆ', query: 'ಭತ್ತದ ಬೆಂಬಲ ಬೆಲೆ ಎಷ್ಟು?' },
          { label: 'ಬ್ಯಾಂಕ್ DBT ಪಾವತಿ ಪರಿಶೀಲಿಸಿ', query: 'ನನ್ನ ಖರೀದಿ ಹಣ ಜಮೆಯಾಗಿದೆಯೇ?' },
          { label: 'ಮಂಡಿ ವಿಳಂಬ ಮತ್ತು ವಾಹನ ಸಾಲು', query: 'ಮಂಡಿಯಲ್ಲಿ ಯಾವುದೇ ವಿಳಂಬವಿದೆಯೇ?' },
        ];
      case 'ml':
        return [
          { label: 'എന്റെ ടോക്കണും ക്യൂ നിലയും', query: 'ടോക്കൺ ക്യൂ നില എന്താണ്?' },
          { label: 'ഇന്നത്തെ നെല്ല് സംഭരണ വില (MSP)', query: 'നെല്ലിന്റെ താങ്ങുവില എത്രയാണ്?' },
          { label: 'ബാങ്ക് DBT അക്കൗണ്ട് പേയ്‌മെന്റ്', query: 'സംഭരണ തുക അക്കൗണ്ടിൽ എത്തിയോ?' },
          { label: 'സംഭരണ കേന്ദ്രത്തിലെ തിരക്ക്', query: 'കേന്ദ്രത്തിൽ എന്തെങ്കിലും കാലതാമസമുണ്ടോ?' },
        ];
      case 'mr':
        return [
          { label: 'माझा टोकन आणि रांगेची स्थिती', query: 'माझ्या टोकनची रांग स्थिती काय आहे?' },
          { label: 'आजचा भात हमीभाव (MSP)', query: 'भात हमीभाव काय आहे?' },
          { label: 'बँक खात्यात थेट DBT रक्कम', query: 'माझे पैसे बँक खात्यात जमा झाले का?' },
          { label: 'खरेदी केंद्रातील गर्दी व विलंब', query: 'खरेदी केंद्रावर काही विलंब आहे का?' },
        ];
      default:
        return [
          { label: 'Check My Token & Queue', query: 'What is my token queue status?' },
          { label: "Today's Paddy & Maize MSP Rate", query: 'What is the MSP rate for paddy?' },
          { label: 'Check Direct Bank Payment Status', query: 'Has my procurement payment arrived?' },
          { label: 'Check Centre Traffic & Delays', query: 'Is there any delay at the procurement centre?' },
        ];
    }
  };

  const sampleQueries = getLocalizedQueries(language);

  const handleSimulateVoice = (query: string) => {
    setIsListening(true);
    setVoiceQueryText(query);
    const processingMsg = language === 'ta' 
      ? 'குரல் கட்டளையைக் கேட்கிறது...' 
      : language === 'hi' 
      ? 'आवाज सुन रहा है और विश्लेषण कर रहा है...' 
      : 'Listening & Processing voice query...';
    setAssistantReply(processingMsg);

    setTimeout(() => {
      setIsListening(false);
      let reply = '';

      if (query.includes('queue') || query.includes('token') || query.includes('வரிசை') || query.includes('டோக்கன்') || query.includes('कतार') || query.includes('कतार') || query.includes('టోకెన్') || query.includes('ಟೋಕನ್') || query.includes('ക്യൂ') || query.includes('रांग')) {
        if (language === 'ta') {
          reply = `உங்கள் டோக்கன் எண் ${farmerBooking.tokenNumber}. தற்போது ${farmerBooking.queuePosition || 8} விவசாயிகள் உங்களுக்கு முன் உள்ளனர். மதிப்பிடப்பட்ட காத்திருப்பு நேரம் ${farmerBooking.estimatedWaitMinutes || 32} நிமிடங்கள். கேட் எண் 2 இல் வாகனம் தயார் நிலையில் இருக்கவும்.`;
        } else if (language === 'hi') {
          reply = `आपका टोकन नंबर ${farmerBooking.tokenNumber} है। वर्तमान में आपके आगे ${farmerBooking.queuePosition || 8} किसान हैं। अनुमानित प्रतीक्षा समय ${farmerBooking.estimatedWaitMinutes || 32} मिनट है। कृपया गेट 2 पर तैयार रहें।`;
        } else if (language === 'te') {
          reply = `మీ టోకెన్ నంబర్ ${farmerBooking.tokenNumber}. ప్రస్తుతం మీ ముందు ${farmerBooking.queuePosition || 8} మంది రైతులు ఉన్నారు. అంచనా వేసిన నిరీక్షణ సమయం ${farmerBooking.estimatedWaitMinutes || 32} నిమిషాలు.`;
        } else if (language === 'kn') {
          reply = `ನಿಮ್ಮ ಟೋಕನ್ ಸಂಖ್ಯೆ ${farmerBooking.tokenNumber}. ಪ್ರಸ್ತುತ ನಿಮ್ಮ ಮುಂದೆ ${farmerBooking.queuePosition || 8} ರೈತರಿದ್ದಾರೆ. ಅಂದಾಜು ಕಾಯುವ ಸಮಯ ${farmerBooking.estimatedWaitMinutes || 32} ನಿಮಿಷಗಳು.`;
        } else if (language === 'ml') {
          reply = `നിങ്ങളുടെ ടോക്കൺ നമ്പർ ${farmerBooking.tokenNumber} ആണ്. ഇപ്പോൾ ${farmerBooking.queuePosition || 8} കർഷകർ നിങ്ങളുടെ മുന്നിലുണ്ട്. കാത്തിരിപ്പ് സമയം ${farmerBooking.estimatedWaitMinutes || 32} മിനിറ്റാണ്.`;
        } else if (language === 'mr') {
          reply = `तुमचा टोकन क्रमांक ${farmerBooking.tokenNumber} आहे. सध्या तुमच्या पुढे ${farmerBooking.queuePosition || 8} शेतकरी आहेत. अंदाजे प्रतीक्षा वेळ ${farmerBooking.estimatedWaitMinutes || 32} मिनिटे आहे.`;
        } else {
          reply = `Your token number is ${farmerBooking.tokenNumber}. There are currently ${farmerBooking.queuePosition || 8} farmers ahead of you. Estimated waiting time is ${farmerBooking.estimatedWaitMinutes || 32} minutes. Please be ready at Gate Bay 2.`;
        }
      } else if (query.includes('msp') || query.includes('price') || query.includes('rate') || query.includes('விலை') || query.includes('மதிப்பு') || query.includes('भाव') || query.includes('मूल्य') || query.includes('ధర') || query.includes('ಬೆಲೆ') || query.includes('വില') || query.includes('हमीभाव')) {
        if (language === 'ta') {
          reply = 'இன்றைய அதிகாரப்பூர்வ மத்திய அரசு குறைந்தபட்ச ஆதரவு விலை: கிரேடு ஏ நெல்லுக்கு குவிண்டாலுக்கு ரூ. 2,320, மக்காச்சோளம் ரூ. 2,225, பருத்தி ரூ. 7,121 ஆகும்.';
        } else if (language === 'hi') {
          reply = 'आज का आधिकारिक केंद्र सरकार न्यूनतम समर्थन मूल्य: ग्रेड ए धान 2,320 रुपये प्रति क्विंटल, मक्का 2,225 रुपये, और कपास 7,121 रुपये है।';
        } else if (language === 'te') {
          reply = 'ఈరోజు అధికారిక ప్రభుత్వ MSP ధర: గ్రేడ్-ఏ ధాన్యం క్వింటాలుకు రూ. 2,320, మొక్కజొన్న రూ. 2,225.';
        } else if (language === 'kn') {
          reply = 'ಇಂದಿನ ಅಧಿಕೃತ ಸರ್ಕಾರದ MSP ಬೆಂಬಲ ಬೆಲೆ: ಗ್ರೇಡ್-ಎ ಭತ್ತಕ್ಕೆ ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ರೂ. 2,320, ಮೆಕ್ಕೆಜೋಳ ರೂ. 2,225.';
        } else if (language === 'ml') {
          reply = 'ഇന്നത്തെ ഔദ്യോഗിക സർക്കാർ താങ്ങുവില: ഗ്രേഡ്-എ നെല്ലിന് ക്വിന്റലിന് 2,320 രൂപ, ചോളം 2,225 രൂപ.';
        } else if (language === 'mr') {
          reply = 'आजचा अधिकृत सरकारी हमीभाव: ग्रेड-ए भातासाठी 2,320 रुपये प्रति क्विंटल, मका 2,225 रुपये आहे.';
        } else {
          reply = "Today's official government MSP rates: Grade-A Paddy is ₹2,320 per quintal, Maize is ₹2,225 per quintal, and Cotton is ₹7,121 per quintal.";
        }
      } else if (query.includes('payment') || query.includes('dbt') || query.includes('பணம்') || query.includes('வரவு') || query.includes('भुगतान') || query.includes('पैसे') || query.includes('జమ') || query.includes('ಹಣ') || query.includes('തുക')) {
        if (language === 'ta') {
          reply = 'உங்கள் சமீபத்திய கோதுமை கொள்முதல் தொகை ரூ. 2,49,749 உங்கள் பஞ்சாப் நேஷனல் வங்கி கணக்கில் நேரடி DBT மூலம் வெற்றிகரமாக வரவு வைக்கப்பட்டுள்ளது. UTR எண்: PFMS998811.';
        } else if (language === 'hi') {
          reply = 'आपके हालिया गेहूं खरीद का 2,49,749 रुपये का भुगतान आपके पीएनबी बैंक खाते में प्रत्यक्ष डीबीटी द्वारा जमा कर दिया गया है। यूटीआर संख्या PFMS998811 है।';
        } else if (language === 'te') {
          reply = 'మీ గోధుమ కొనుగోలు మొత్తం రూ. 2,49,749 మీ బ్యాంక్ ఖాతాలో DBT ద్వారా విజయవంతంగా జమ చేయబడింది.';
        } else if (language === 'kn') {
          reply = 'ನಿಮ್ಮ ಇತ್ತೀಚಿನ ಗೋಧಿ ಖರೀದಿ ಮೊತ್ತ ರೂ. 2,49,749 ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ DBT ಮೂಲಕ ಯಶಸ್ವಿಯಾಗಿ ಜಮೆಯಾಗಿದೆ.';
        } else if (language === 'ml') {
          reply = 'നിങ്ങളുടെ സമീപകാല ഗോതമ്പ് സംഭരണ തുകയായ 2,49,749 രൂപ ബാങ്ക് അക്കൗണ്ടിൽ DBT വഴി വിജയകരമായി ക്രെഡിറ്റ് ചെയ്യപ്പെട്ടു.';
        } else if (language === 'mr') {
          reply = 'तुमच्या गहू खरेदीची 2,49,749 रुपयांची रक्कम थेट डीबीटीद्वारे तुमच्या बँक खात्यात यशस्वीरीत्या जमा झाली आहे.';
        } else {
          reply = 'Your recent procurement payment of ₹2,49,749.50 was successfully credited to your PNB bank account via direct PFMS DBT transfer. UTR Batch #998811.';
        }
      } else {
        const centre = centres[0];
        if (language === 'ta') {
          reply = `${centre.name} கொள்முதல் மையம் வழக்கம் போல் செயல்படுகிறது. இன்றைய இருப்பு ஸ்லாட்டுகள்: ${centre.availableSlotsToday}. எந்தவித தாமதமும் இல்லை.`;
        } else if (language === 'hi') {
          reply = `${centre.name} खरीद केंद्र सुचारू रूप से संचालित है। आज उपलब्ध स्लॉट: ${centre.availableSlotsToday}। कोई देरी नहीं है।`;
        } else {
          reply = `${centre.name} is operating with normal traffic. Available booking slots today: ${centre.availableSlotsToday}. Zero operational delay reported.`;
        }
      }

      setAssistantReply(reply);
      speakText(reply, language);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none animate-in fade-in">
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="p-4 bg-emerald-700 dark:bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-800 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-200 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm">
                {language === 'ta' ? 'பன்மொழி குரல் உதவி மையம்' : language === 'hi' ? 'बहुभाषी आवाज सहायता' : 'Multilingual Voice Assistance'}
              </h3>
              <p className="text-[11px] text-emerald-100">
                {language === 'ta' ? 'விவசாயிகளுக்கான நேரடி ஆடியோ குரல் சேவை' : language === 'hi' ? 'किसानों के लिए क्षेत्रीय ऑडियो सहायता इंजन' : 'Farmer-First Accessibility Audio Engine'}
              </p>
            </div>
          </div>
          <button
            onClick={closeVoiceModal}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-600 dark:hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Quick Language Switcher Inside Modal */}
          <div className="bg-slate-50 dark:bg-neutral-900 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>குரல் மொழி / Voice Language:</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-end">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                    language === l.code 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-white dark:bg-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>

          {/* Voice status visualization */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-dashed border-slate-300 dark:border-white/20 text-center">
            <button
              onClick={() => handleSimulateVoice(sampleQueries[0].query)}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all ${
                isListening 
                  ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-200' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105'
              }`}
              title="Click to speak"
            >
              <Mic className="w-7 h-7" />
            </button>
            <span className="text-xs font-bold text-slate-800 dark:text-white mt-3">
              {isListening ? (language === 'ta' ? 'குரல் கேட்கிறது...' : 'Listening...') : (language === 'ta' ? 'மைக் தட்டவும் அல்லது கீழே உள்ள கேள்வியைத் தேர்ந்தெடுக்கவும்' : 'Tap Microphone or select inquiry below')}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'ta' ? 'அனைத்து தகவல்களும் தமிழில் உடனடியாக பேசப்படும்' : 'Real-time Indian native regional speech synthesis'}
            </span>
          </div>

          {/* Active response box */}
          {assistantReply && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs animate-in fade-in">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 
                  {language === 'ta' ? 'குரல் பதில்' : 'Audio Response'}
                </span>
                <button
                  onClick={() => speakText(assistantReply, language)}
                  className="text-emerald-700 dark:text-emerald-300 hover:underline font-bold text-[11px] flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" /> {language === 'ta' ? 'மீண்டும் கேள்' : 'Replay Audio'}
                </button>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed mt-1">
                {assistantReply}
              </p>
            </div>
          )}

          {/* Quick Voice Inquiries */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
              {language === 'ta' ? 'அடிக்கடி கேட்கப்படும் விவசாயக் குரல் கேள்விகள்' : 'Common Farmer Audio Inquiries'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulateVoice(item.query)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-800 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between group shadow-2xs"
                >
                  <span className="truncate pr-2">{item.label}</span>
                  <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட மொழி: ' : 'Active Dialect: '}
            <strong className="text-slate-800 dark:text-white uppercase">{language} ({LANGUAGES.find(l => l.code === language)?.native})</strong>
          </span>
          <button
            onClick={closeVoiceModal}
            className="px-4 py-1.5 bg-white dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-white font-bold shadow-2xs transition-colors"
          >
            {t.confirm} / OK
          </button>
        </div>
      </div>
    </div>
  );
};
