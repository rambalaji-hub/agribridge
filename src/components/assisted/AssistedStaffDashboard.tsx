import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Printer, 
  CalendarClock, 
  PlusCircle, 
  Ticket, 
  TrendingUp, 
  CheckCircle2, 
  Building2, 
  Phone,
  QrCode as QrIcon,
  Scale,
  MapPin,
  FileText,
  Bell,
  User,
  ShieldCheck,
  CreditCard,
  Download,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_CROPS } from '../../data/mockData';
import { CropType } from '../../types';
import { findFarmer, hasApiSession, localDateString } from '../../lib/api';

export const AssistedStaffDashboard: React.FC = () => {
  const { currentUser, centres, createBooking, speakText, t, activeTab, bookings } = useApp();

  // Search Farmer State
  const [searchQuery, setSearchQuery] = useState('');
  const [foundFarmer, setFoundFarmer] = useState<any | null>(null);

  // Assisted Booking Form
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Paddy (Dhan)');
  const [quantity, setQuantity] = useState(50);
  const [selectedCentre, setSelectedCentre] = useState('centre-01');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM - 12:00 PM');
  const [tokenGenerated, setTokenGenerated] = useState<any | null>(null);
  const [bookingError, setBookingError] = useState('');

  // New Farmer Registration Form
  const [newFarmerName, setNewFarmerName] = useState('');
  const [newFarmerAadhaar, setNewFarmerAadhaar] = useState('');
  const [newFarmerPhone, setNewFarmerPhone] = useState('');
  const [newFarmerVillage, setNewFarmerVillage] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Track Lot Status Search
  const [trackQuery, setTrackQuery] = useState('');

  useEffect(() => {
    if (centres.length && !centres.some(centre => centre.id === selectedCentre)) {
      setSelectedCentre(centres[0].id);
    }
  }, [centres, selectedCentre]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    if (hasApiSession()) {
      try {
        const farmer = await findFarmer(searchQuery);
        setFoundFarmer({
          ...farmer,
          landArea: farmer.landAcres ? `${farmer.landAcres} Acres` : 'Not provided',
          bank: farmer.bankAccountLinked ? 'Bank account on file' : 'Bank account not provided',
        });
      } catch (error) {
        setFoundFarmer(null);
        setBookingError(error instanceof Error ? error.message : 'Could not find the farmer.');
      }
      return;
    }
    if (searchQuery.includes('9876') || searchQuery.toLowerCase().includes('ramesh')) {
      setFoundFarmer({
        name: 'Sardar Ramesh Kumar',
        mobile: '9876543210',
        id: 'PB-FARM-90214',
        location: 'Taraori Village, Karnal, Haryana',
        landArea: '6.5 Acres',
        bank: 'Punjab National Bank (Aadhaar Seeded)',
      });
    } else {
      setFoundFarmer({
        name: 'Balwinder Singh',
        mobile: searchQuery || '9812345678',
        id: 'PB-FARM-91102',
        location: 'Nilokheri, Karnal',
        landArea: '4.2 Acres',
        bank: 'State Bank of India (Aadhaar Seeded)',
      });
    }
  };

  const handleAssistedBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    const farmerName = foundFarmer?.name || 'Walk-In Farmer';
    const farmerMobile = foundFarmer?.mobile || '9876543210';

    try {
      const newBooking = await createBooking({
        farmerId: foundFarmer?.id,
        farmerName,
        farmerMobile,
        crop: selectedCrop,
        quantityQuintals: quantity,
        centreId: selectedCentre,
        slotTime: selectedSlot,
        bookingDate: localDateString()
      });
      setTokenGenerated(newBooking);
      speakText(`टोकन नंबर ${newBooking.tokenNumber} बन गया है। पर्ची प्रिंट करें।`);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Could not create the booking.');
    }
  };

  const handleRegisterNewFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasApiSession()) {
      setRegSuccess('Assisted e-KYC enrollment is not connected to a verified identity provider. Do not submit Aadhaar details here; use the Farmer Portal registration.');
      return;
    }
    setRegSuccess(`Farmer ${newFarmerName} successfully enrolled with Aadhaar e-KYC! Kiosk Registration ID: PB-FARM-${Date.now().toString().slice(-5)}`);
    setTimeout(() => {
      setRegSuccess('');
      setNewFarmerName('');
      setNewFarmerAadhaar('');
      setNewFarmerPhone('');
      setNewFarmerVillage('');
    }, 4000);
  };

  const renderContent = () => {
    switch (activeTab) {
      // 1. Farmer Registration
      case 'register-farmer':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                CSC Aadhaar e-KYC Enrolment
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Register New Walk-In Farmer
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Assist illiterate, elderly, or non-smartphone farmers with biometric enrollment</p>
            </div>

            {regSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{regSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRegisterNewFarmer} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Farmer Full Name (as per Aadhaar)</label>
                  <input
                    type="text"
                    value={newFarmerName}
                    onChange={(e) => setNewFarmerName(e.target.value)}
                    placeholder="e.g. Sardar Gurmeet Singh"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">12-Digit Aadhaar Number</label>
                  <input
                    type="text"
                    value={newFarmerAadhaar}
                    onChange={(e) => setNewFarmerAadhaar(e.target.value)}
                    placeholder="XXXX XXXX XXXX"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={newFarmerPhone}
                    onChange={(e) => setNewFarmerPhone(e.target.value)}
                    placeholder="10-digit mobile for SMS slip"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Village & Taluka</label>
                  <input
                    type="text"
                    value={newFarmerVillage}
                    onChange={(e) => setNewFarmerVillage(e.target.value)}
                    placeholder="e.g. Taraori, Karnal"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-2xs text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Biometric Verify & Register
                </button>
              </div>
            </form>
          </div>
        );

      // 2. Crop Sown & Land Record
      case 'crop-quantity':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Revenue Department Linkage
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Khasra & Girdawari Land Record Verification
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Verify agricultural landholding and permitted MSP procurement quota</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-xs space-y-3">
              <h3 className="font-heading font-bold text-slate-900">Standard Yield Limit Ceiling per Acre</h3>
              <p className="text-slate-500">Government statutory limits prevent commercial traders from proxy selling under farmer names:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Paddy (Common / Grade-A)</span>
                  <span className="text-emerald-800 font-black text-sm">Max 30 Quintals / Acre</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Wheat (Gehun)</span>
                  <span className="text-emerald-800 font-black text-sm">Max 25 Quintals / Acre</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Mustard (Sarson)</span>
                  <span className="text-emerald-800 font-black text-sm">Max 12 Quintals / Acre</span>
                </div>
              </div>
            </div>
          </div>
        );

      // 3. Procurement Centres
      case 'procurement-centres':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                Mandi Hub Directory
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Nearby Procurement Centres & Live Wait Times
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Advise farmers on the least congested mandi hubs to prevent tractor traffic jams</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {centres.map(c => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-400">{c.code}</span>
                      <h4 className="font-heading font-bold text-slate-900 text-sm">{c.name}</h4>
                      <p className="text-[11px] text-slate-500">{c.district}, {c.state}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {c.operatingStatus}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex justify-between">
                      <span>Queue:</span>
                      <strong className="text-slate-900">{c.currentQueueCount} Tractors</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Wait:</span>
                      <strong className="text-emerald-800">{c.averageWaitTimeMinutes} mins</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 4. Book Slot & Generate Token
      case 'book-slot':
      case 'generate-token':
      case 'print-token':
        return (
          <div className="space-y-6">
            {bookingError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">{bookingError}</div>}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Token Issuance Desk
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Generate Verified Gate Pass & Print Thermal Token
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select mandi slot and print official QR barcoded entry slip</p>
            </div>

            {tokenGenerated ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs max-w-md mx-auto space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900">Token Generated Successfully!</h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 font-mono text-xs text-left space-y-2">
                  <div className="text-center font-black text-2xl text-emerald-800 font-heading">
                    {tokenGenerated.tokenNumber}
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between">
                    <span>Farmer:</span> <strong>{tokenGenerated.farmerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Crop:</span> <strong>{tokenGenerated.crop}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span> <strong>{tokenGenerated.quantityQuintals} Qtl</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mandi:</span> <strong>{tokenGenerated.centreName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Slot:</span> <strong>{tokenGenerated.slotTime}</strong>
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print Thermal Slip
                  </button>
                  <button
                    onClick={() => setTokenGenerated(null)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    New Booking
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAssistedBooking} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 text-xs max-w-xl">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Farmer Full Name</label>
                  <input
                    type="text"
                    value={foundFarmer?.name || 'Sardar Ramesh Kumar'}
                    readOnly
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Commodity / Crop</label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      {OFFICIAL_CROPS.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Quantity (Quintals)</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      min={1}
                      max={200}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Procurement Centre</label>
                    <select
                      value={selectedCentre}
                      onChange={(e) => setSelectedCentre(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      {centres.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Arrival Time Window</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      <option>08:00 AM - 09:30 AM</option>
                      <option>09:30 AM - 11:00 AM</option>
                      <option>11:00 AM - 12:30 PM</option>
                      <option>02:00 PM - 03:30 PM</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-2xs text-xs flex items-center gap-1.5"
                  >
                    <Ticket className="w-4 h-4" /> Issue Gate Pass Token
                  </button>
                </div>
              </form>
            )}
          </div>
        );

      // 5. Track Lot Status
      case 'track-procurement':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Farmer Assistance Query Desk
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Track Mandi Weighment & Payment Status
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Lookup token number or mobile to explain current stage to visiting farmer</p>

              <div className="mt-4 flex gap-2 max-w-md">
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="Enter Token (e.g. TOK-PB-...) or Mobile..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="font-heading font-bold text-slate-900 text-sm">Recent Mandi Bookings in Kiosk Catchment</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {bookings.slice(0, 5).map(b => (
                  <div key={b.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-emerald-800">{b.tokenNumber}</span> &bull; <strong className="text-slate-900">{b.farmerName}</strong>
                      <div className="text-[11px] text-slate-500">{b.crop} &bull; {b.quantityQuintals} Quintals &bull; {b.centreName}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {b.status ? String(b.status).replace(/_/g, ' ') : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // 6. Govt MSP Calculator
      case 'price-msp':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Official Statutory Rates
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                MSP Price Schedule & Payout Estimator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Explain guaranteed minimum support price per quintal to visiting farmers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {OFFICIAL_CROPS.map(c => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400">{c.category}</span>
                  <h4 className="font-heading font-bold text-base text-slate-900">{c.name}</h4>
                  <div className="font-heading font-black text-2xl text-emerald-800">
                    ₹{c.mspPrice} <span className="text-xs font-semibold text-slate-400">/ Qtl</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    Moisture Tolerance: <strong>{c.maxMoistureAllowed}%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 7. Profile
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-heading font-black text-2xl border border-teal-200 shadow-2xs">
                MK
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  CSC Village Level Entrepreneur (VLE)
                </span>
                <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {currentUser?.name || 'Manish Kumar'}
                </h1>
                <p className="text-xs text-slate-500 font-mono">
                  Operator VLE ID: <strong>CSC-VLE-PB-8021</strong> &bull; Taraori Gram Panchayat Digital Kiosk
                </p>
              </div>
            </div>
          </div>
        );

      // Default: Dashboard Overview
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200">
                    CSC E-Gram Swaraj Kendra
                  </span>
                  <span className="text-xs text-slate-400">&bull; Operator ID: <strong className="font-mono text-slate-700">{currentUser?.identifier || 'CSC-VLE-PB-8021'}</strong></span>
                </div>
                <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                  Assisted Access & Village Kiosk Terminal
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assisting non-smartphone, illiterate, and elderly farmers with Aadhaar e-KYC, mandi slots, and printouts.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">Assisted Today</span>
                  <span className="font-heading text-xl font-black text-emerald-950">28 Farmers</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Farmer Lookup */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-700" />
                  <span>Farmer Lookup (Phone or Aadhaar)</span>
                </h3>

                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter 10-digit mobile or Aadhaar..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs"
                  >
                    Search
                  </button>
                </form>

                {foundFarmer && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-emerald-950">{foundFarmer.name}</div>
                    <div className="text-slate-600">ID: <span className="font-mono">{foundFarmer.id}</span></div>
                    <div className="text-slate-600">Village: {foundFarmer.location}</div>
                    <div className="text-slate-600">Land: {foundFarmer.landArea}</div>
                    <div className="text-emerald-800 font-bold">{foundFarmer.bank}</div>
                  </div>
                )}
              </div>

              {/* Quick Assisted Booking Form */}
              <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-emerald-700" />
                  <span>Instant Assisted Mandi Booking</span>
                </h3>

                <form onSubmit={handleAssistedBooking} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Select Crop</label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      {OFFICIAL_CROPS.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Quantity (Quintals)</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      min={1}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mandi Centre</label>
                    <select
                      value={selectedCentre}
                      onChange={(e) => setSelectedCentre(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      {centres.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Slot Time</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      <option>10:30 AM - 12:00 PM</option>
                      <option>01:00 PM - 02:30 PM</option>
                      <option>03:00 PM - 04:30 PM</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-2xs flex items-center gap-2"
                    >
                      <Ticket className="w-4 h-4" /> Issue Gate Pass & Audio Announce
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};
