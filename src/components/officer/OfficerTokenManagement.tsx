import React, { useState } from 'react';
import { 
  Ticket, 
  QrCode as QrIcon, 
  Printer, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Play, 
  Volume2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProcurementBooking, CropType } from '../../types';
import { localDateString } from '../../lib/api';

export const OfficerTokenManagement: React.FC = () => {
  const { currentUser, bookings, centres, createBooking, advanceQueueForCentre, speakText } = useApp();
  const currentCentre = centres.find(c => c.id === currentUser?.assignedCentreId) || centres[0];
  const centreBookings = bookings.filter(b => b.centreId === currentCentre.id);

  // Walk-in farmer token issuance form
  const [farmerName, setFarmerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [crop, setCrop] = useState<CropType>('Paddy (Dhan)');
  const [qty, setQty] = useState(65);
  const [issuedToken, setIssuedToken] = useState<ProcurementBooking | null>(null);
  const [isIssuingToken, setIsIssuingToken] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // QR scanner simulation
  const [scanInput, setScanInput] = useState('');
  const [scannedResult, setScannedResult] = useState<ProcurementBooking | null>(null);
  const [scanMessage, setScanMessage] = useState('');

  const handleIssueWalkInToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !mobile) return;

    setBookingError('');
    setIsIssuingToken(true);
    try {
      const newBooking = await createBooking({
        farmerName,
        farmerMobile: mobile,
        crop,
        quantityQuintals: qty,
        centreId: currentCentre.id,
        centreName: currentCentre.name,
        bookingDate: localDateString(),
        slotTime: 'Immediate Gate Entry',
        status: 'waiting',
        queuePosition: centreBookings.length + 1,
      });
      setIssuedToken(newBooking);
      speakText(`Walk in token ${newBooking.tokenNumber} issued to farmer ${farmerName}`);
      setFarmerName('');
      setMobile('');
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Could not issue the token.');
    } finally {
      setIsIssuingToken(false);
    }
  };

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    const found = centreBookings.find(b => 
      b.tokenNumber.toLowerCase() === scanInput.trim().toLowerCase() ||
      b.farmerMobile === scanInput.trim()
    );

    if (found) {
      setScannedResult(found);
      setScanMessage(`Verified: Gate Pass for ${found.farmerName} is VALID.`);
    } else {
      setScannedResult(null);
      setScanMessage('Invalid Token or Pass not booked for this APMC Mandi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Mandi Gate Pass & Token Desk
            </span>
            <span className="text-xs text-slate-400">&bull; Mandi Gate: <strong>Gate 1 Main Inflow</strong></span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Token Registration & Gate Scanner
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Scan scheduled farmer entry QR passes or issue immediate walk-in tokens with physical thermal printouts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => advanceQueueForCentre(currentCentre.id)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs flex items-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Call Next in Line</span>
          </button>
        </div>
      </div>

      {/* Two Columns: Scanner & Walk-in Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optical QR Scanner Terminal */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <QrIcon className="w-5 h-5 text-emerald-700" />
              <span>Gate Optical Pass & QR Barcode Scanner</span>
            </h3>
            <p className="text-xs text-slate-500">Scan mobile QR or enter token number from paper pass</p>
          </div>

          <form onSubmit={handleSimulateScan} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Scan QR or enter token (e.g. #AG240024 or 9876543210)..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Verify Gate Pass</span>
              </button>
              <button
                type="button"
                onClick={() => { setScanInput('#AG240024'); }}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Sample Pass
              </button>
            </div>
          </form>

          {scanMessage && (
            <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${scannedResult ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              {scannedResult ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-rose-700" />}
              <span>{scanMessage}</span>
            </div>
          )}

          {scannedResult && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-heading font-black text-sm text-slate-900">{scannedResult.farmerName}</span>
                <span className="font-mono font-bold text-emerald-800">{scannedResult.tokenNumber}</span>
              </div>
              <div className="text-slate-600 grid grid-cols-2 gap-2 text-[11px]">
                <div>Crop: <strong>{scannedResult.crop}</strong></div>
                <div>Qty: <strong>{scannedResult.quantityQuintals} Qtl</strong></div>
                <div>Slot: <strong>{scannedResult.slotTime}</strong></div>
                <div>Status: <strong className="uppercase">{scannedResult.status}</strong></div>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => alert(`Gate barrier opened for Tractor of ${scannedResult.farmerName}`)}
                  className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-lg text-xs hover:bg-emerald-800 shadow-2xs"
                >
                  Open Gate Barrier
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Walk-in Farmer Token Issuance */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-700" />
              <span>Issue Immediate Walk-in Gate Token</span>
            </h3>
            <p className="text-xs text-slate-500">For farmers arriving directly without prior online booking</p>
          </div>

          <form onSubmit={handleIssueWalkInToken} className="space-y-3 text-xs">
            {bookingError && <p role="alert" className="rounded-lg bg-rose-50 p-2 text-rose-800">{bookingError}</p>}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Farmer Full Name</label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder="e.g. Jaswant Singh Dhillon"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Number (for SMS & DBT)</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile (e.g. 9811223344)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop Commodity</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value as CropType)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                >
                  <option value="Paddy (Dhan)">Paddy (Dhan)</option>
                  <option value="Wheat (Gehun)">Wheat (Gehun)</option>
                  <option value="Maize (Makka)">Maize (Makka)</option>
                  <option value="Groundnut (Mungfali)">Groundnut</option>
                  <option value="Mustard">Mustard</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Declared Quintals</label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isIssuingToken}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Ticket className="w-4 h-4" />
              <span>{isIssuingToken ? 'Issuing…' : 'Issue Gate Token & Add to Live Queue'}</span>
            </button>
          </form>

          {issuedToken && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">Token Generated Successfully!</span>
                <button
                  onClick={() => alert(`Thermal ticket sent to POS printer: ${issuedToken.tokenNumber}`)}
                  className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-1 hover:bg-emerald-100"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Thermal Slip
                </button>
              </div>
              <div className="font-mono text-2xl font-black text-emerald-950">
                {issuedToken.tokenNumber}
              </div>
              <p className="text-xs text-emerald-800">
                Farmer: <strong>{issuedToken.farmerName}</strong> &bull; Queue Position: <strong>#{issuedToken.queuePosition}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
