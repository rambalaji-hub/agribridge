import React, { useState } from 'react';
import { 
  AlertCircle, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Clock, 
  Phone, 
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ComplaintTicket } from '../../types';

export const FarmerHelpSupportView: React.FC = () => {
  const { complaints, submitComplaint, openDetailDrawer, currentUser, openAiAssistant } = useApp();

  const [category, setCategory] = useState<ComplaintTicket['category']>('Weighment Dispute');
  const [description, setDescription] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitComplaint({
      farmerId: currentUser?.id || 'farmer-01',
      farmerName: currentUser?.name || 'Sardar Ramesh Kumar',
      category,
      description,
    });

    setDescription('');
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Kisan Samadhan Grievance Redressal Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Helpdesk, Appeals & Grievance Lodgement
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Every grievance filed is assigned a dedicated nodal grievance officer with strict 48-hour resolution mandate under the Farmer Citizen Charter.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Kisan Toll-Free Helpline</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-200">1800-180-1551 (24x7)</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Quick Solution Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">Ask AgriBridge AI Assistant 24/7</h2>
              <span className="text-[9px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full">Instant</span>
            </div>
            <p className="text-xs text-emerald-100 mt-1 max-w-xl">
              Get immediate answers to questions about official MSP rates, queue waiting times, digital weigh slips, and PFMS Aadhaar DBT credits without waiting for phone support.
            </p>
          </div>
        </div>
        <button
          onClick={openAiAssistant}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-all shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Bot className="w-4 h-4 text-emerald-700" />
          <span>Launch AI Assistant</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
        </button>
      </div>

      {/* Lodge a Grievance Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-emerald-600" />
          <span>Lodge a Formal Complaint or Quality Appeal</span>
        </h3>

        {submittedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Grievance ticket registered successfully! An SMS acknowledgment with tracking number was dispatched.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Grievance Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
            >
              <option value="Weighment Dispute">Weighment Dispute / Tare Recalibration</option>
              <option value="Quality Grading Appeal">Quality Grading / Moisture Assessment Appeal</option>
              <option value="Payment Delay">DBT Bank Payment Disbursal Delay</option>
              <option value="Slot Reschedule">Slot Rescheduling Emergency</option>
              <option value="Centre Staff Misconduct">Centre Staff Assistance Misconduct</option>
              <option value="Technical Glitch">Technical Applet / Portal Glitch</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Detailed Description of Issue
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact token number, vehicle registration, centre bay number or transaction reference..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Formal Grievance</span>
            </button>
          </div>
        </form>
      </div>

      {/* Grievance Tracking History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Active & Resolved Grievance History
        </h3>

        <div className="space-y-3">
          {complaints.map(c => (
            <div
              key={c.id}
              onClick={() => openDetailDrawer('complaint', c)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {c.ticketNo}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    &bull; {c.category}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  c.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {c.status}
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
                {c.description}
              </p>

              {c.resolutionNote && (
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-[11px] border border-emerald-200">
                  <strong>Resolution:</strong> {c.resolutionNote}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Submitted: {c.dateSubmitted}</span>
                <span>Nodal Officer: {c.officerAssigned || 'Assigned Nodal Officer'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
