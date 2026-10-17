import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  CheckCircle2, 
  Package, 
  Clock, 
  CreditCard, 
  Filter, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Bell,
  User,
  ShieldCheck,
  Send,
  Download,
  Building2,
  DollarSign,
  QrCode,
  Landmark,
  Wallet,
  Check,
  AlertCircle,
  Printer,
  FileText,
  ArrowLeft,
  Copy,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MarketplaceListing, MarketplaceOrder } from '../../types';
import { OrderTransactionReceiptModal } from './OrderTransactionReceiptModal';

export const BuyerDashboard: React.FC = () => {
  const { 
    currentUser, 
    activeTab,
    marketplaceListings, 
    buyerOrders, 
    openDetailDrawer, 
    createMarketplaceOrder,
    setActiveTab 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(7000);

  // Order & Payment Flow State
  const [selectedCropModal, setSelectedCropModal] = useState<MarketplaceListing | null>(null);
  const [orderStep, setOrderStep] = useState<'form' | 'payment' | 'receipt'>('form');
  const [orderQty, setOrderQty] = useState(50);
  const [pickupDate, setPickupDate] = useState('2026-09-22');
  
  // Payment methods state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'netbanking' | 'card' | 'wallet'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiVpa, setUpiVpa] = useState('buyer.ananya@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (Corporate RTGS)');
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 9921',
    expiry: '08/29',
    cvv: '•••',
    name: 'ANANYA AGRO TRADERS'
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<MarketplaceOrder | null>(null);
  const [copiedVpa, setCopiedVpa] = useState(false);

  // Transaction Receipt Modal for any order
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<MarketplaceOrder | null>(null);

  // Messenger State
  const [activeChatFarmer, setActiveChatFarmer] = useState('Sardar Harbhajan Singh');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Sardar Harbhajan Singh', text: 'Namaste Ji, we have 180 Quintals of Sharbati Grade-A Wheat harvested yesterday in Khanna mandi yard.', time: '10:15 AM' },
    { id: 2, sender: 'You', text: 'What is the moisture percentage and do you have legal metrology weight slip?', time: '10:22 AM' },
    { id: 3, sender: 'Sardar Harbhajan Singh', text: 'Moisture is 12.4%, tested on digital sensor. Slip is verified by APMC Khanna. We can load 2 trucks tomorrow.', time: '10:28 AM' },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'You',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatInput('');
  };

  const openOrderModal = (listing: MarketplaceListing) => {
    setSelectedCropModal(listing);
    setOrderQty(Math.min(listing.quantityQuintals, 50));
    setOrderStep('form');
    setLastConfirmedOrder(null);
  };

  const closeOrderModal = () => {
    setSelectedCropModal(null);
    setOrderStep('form');
    setIsProcessingPayment(false);
    setLastConfirmedOrder(null);
  };

  // Step 1: Buyer confirms order configuration & proceeds to payment methods
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCropModal) return;
    setOrderStep('payment');
  };

  // Step 2: Buyer selects payment method and authorizes the money transaction
  const handleAuthorizePayment = () => {
    if (!selectedCropModal) return;
    setIsProcessingPayment(true);

    const baseAmount = orderQty * selectedCropModal.pricePerQuintal;
    const mandiCess = Number((baseAmount * 0.015).toFixed(2));
    const escrowFee = 250;
    const transportCost = 3500;
    const totalTransacted = baseAmount + mandiCess + escrowFee + transportCost;

    let methodName = 'UPI / Dynamic QR Code (Google Pay)';
    let gatewayName = 'NPCI Bharat e-Market Escrow (SBI Nodal Account)';

    if (selectedPaymentMethod === 'upi') {
      const appMap = { gpay: 'Google Pay', phonepe: 'PhonePe', paytm: 'Paytm', bhim: 'BHIM UPI' };
      methodName = `UPI / Dynamic QR Code (${appMap[selectedUpiApp]})`;
      gatewayName = 'NPCI Bharat e-Market Escrow (SBI Nodal Account)';
    } else if (selectedPaymentMethod === 'netbanking') {
      methodName = `Net Banking / RTGS (${selectedBank})`;
      gatewayName = 'Reserve Bank of India (RBI e-Kuber APMC Settlement)';
    } else if (selectedPaymentMethod === 'card') {
      methodName = 'Corporate Agri-Card (RuPay Commercial)';
      gatewayName = 'SBI Global Payments Merchant Escrow';
    } else if (selectedPaymentMethod === 'wallet') {
      methodName = 'APMC Mandi e-Wallet / e-NAM Trader Balance';
      gatewayName = 'National Agriculture Market (e-NAM Virtual Balance)';
    }

    const txId = `TXN-AGRI-${Math.floor(100000 + Math.random() * 900000)}`;
    const utrNo = `UTR-SBIN-2026-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const paidAt = new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTimeout(() => {
      const created = createMarketplaceOrder(
        selectedCropModal.id,
        orderQty,
        selectedCropModal.pricePerQuintal,
        pickupDate,
        methodName,
        {
          transactionId: txId,
          utrNumber: utrNo,
          paymentMethod: methodName,
          paymentGateway: gatewayName,
          paidAt,
          baseAmount,
          mandiCess,
          escrowFee,
          transportCost,
          totalTransacted,
          escrowStatus: 'Escrow Secured',
          farmerBeneficiary: {
            name: selectedCropModal.farmerName,
            bankName: 'Punjab National Bank, Agri Mandi Branch',
            accountMasked: '•••• •••• •••• 4019',
            ifsc: 'PUNB0024900'
          }
        }
      );

      setLastConfirmedOrder(created);
      setIsProcessingPayment(false);
      setOrderStep('receipt');
    }, 700);
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(upiVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const filteredListings = marketplaceListings.filter(l => {
    const matchesSearch = l.crop.toLowerCase().includes(search.toLowerCase()) ||
                          l.location.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = l.pricePerQuintal <= priceRange;
    const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
    return matchesSearch && matchesPrice && matchesCategory;
  });

  // Calculate pricing values for selected modal
  const baseOrderAmount = selectedCropModal ? orderQty * selectedCropModal.pricePerQuintal : 0;
  const calculatedMandiCess = Number((baseOrderAmount * 0.015).toFixed(2));
  const calculatedEscrowFee = 250;
  const calculatedFreight = 3500;
  const totalContractPayable = baseOrderAmount + calculatedMandiCess + calculatedEscrowFee + calculatedFreight;

  // Render Distinct Page Based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'browse-crops':
      case 'crop-details':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  National Surplus Exchange
                </span>
                <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1.5">
                  Direct Farm Sourced Commodity Listings
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Procure certified grain, pulses, and oilseeds directly from verified FPOs and farmers with secured trade escrow
                </p>
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                Active Listings: <strong className="text-slate-900 dark:text-slate-100">{filteredListings.length} Lots</strong>
              </div>
            </div>

            {/* Grid of Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredListings.map(listing => (
                <div key={listing.id} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-slate-400">{listing.id}</span>
                        <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">{listing.crop}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{listing.location}</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {listing.category}
                      </span>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Available Quantity:</span>
                        <strong className="text-slate-900 dark:text-slate-100 font-bold">{listing.quantityQuintals} Quintals</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Offered Price:</span>
                        <strong className="text-emerald-800 dark:text-emerald-400 font-heading font-black text-sm">₹{listing.pricePerQuintal} / Qtl</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Farmer / FPO:</span>
                        <strong className="text-slate-900 dark:text-slate-100">{listing.farmerName}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => openOrderModal(listing)}
                      className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Instant Purchase</span>
                    </button>
                    <button
                      onClick={() => openDetailDrawer('crop', listing)}
                      className="px-3 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'search-filter':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
              <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Advanced Sourcing Filter & Parametric Search
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Filter wholesale produce by price cap, distance, and quality certification</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Search Keywords</label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Crop name, mandi, or state..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Maximum Price (₹ / Qtl)</label>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">₹{priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min={1500}
                    max={8000}
                    step={100}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-emerald-700 mt-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Commodity Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="All">All Categories</option>
                    <option value="Direct Farm Fresh">Direct Farm Fresh</option>
                    <option value="Organic Certified">Organic Certified</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                Matching Lots ({filteredListings.length})
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredListings.map(l => (
                  <div key={l.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{l.crop}</span> &bull; <span className="text-slate-500 dark:text-slate-400">{l.location}</span>
                      <div className="text-[11px] text-slate-400">Offered by {l.farmerName} &bull; Qty: {l.quantityQuintals} Qtl</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-heading font-black text-sm text-emerald-800 dark:text-emerald-400">₹{l.pricePerQuintal}/Qtl</span>
                      <button
                        onClick={() => openOrderModal(l)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs"
                      >
                        Order & Pay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'my-orders':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Procurement Contracts & Escrow Settlements
                </span>
                <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1.5">
                  My Wholesale Procurement Orders ({buyerOrders.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Historical ledger of farm contracts, payment methods, transaction receipts, and escrow disbursements
                </p>
              </div>
              <button
                onClick={() => setActiveTab('browse-crops')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start md:self-auto"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Sourcing Catalogue
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-3 pr-3">Order ID</th>
                    <th className="pb-3 pr-3">Commodity</th>
                    <th className="pb-3 pr-3">Farmer</th>
                    <th className="pb-3 pr-3">Quantity</th>
                    <th className="pb-3 pr-3">Transacted Amount</th>
                    <th className="pb-3 pr-3">Payment Method</th>
                    <th className="pb-3 pr-3">Escrow Status</th>
                    <th className="pb-3 text-right">Money Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {buyerOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-3.5 pr-3 font-mono font-bold text-slate-800 dark:text-slate-200">{order.id}</td>
                      <td className="py-3.5 pr-3 font-bold text-slate-900 dark:text-slate-100">{order.crop}</td>
                      <td className="py-3.5 pr-3 text-slate-600 dark:text-slate-300">{order.farmerName}</td>
                      <td className="py-3.5 pr-3 font-semibold text-slate-900 dark:text-slate-100">{order.quantityQuintals} Qtl</td>
                      <td className="py-3.5 pr-3 font-heading font-black text-slate-900 dark:text-slate-100 text-sm">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <CreditCard className="w-3 h-3 text-emerald-600" />
                          <span className="truncate max-w-[140px]">{order.paymentMethod || 'UPI (Google Pay)'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {order.paymentStatus || 'Escrow Held'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => setViewingReceiptOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Receipt & UTR</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'order-tracking':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Logistics Telemetry & Escrow Protection
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1.5">
                Real-Time Fleet Dispatch & Consignment Tracking
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live GPS tracking of transport trucks moving harvested produce from farm gate to buyer warehouse</p>
            </div>

            <div className="space-y-4">
              {buyerOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">{order.id}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                          {order.paymentMethod || 'UPI (Google Pay)'} &bull; Escrow Secured
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100 mt-1">
                        {order.crop} &bull; {order.quantityQuintals} Quintals
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Origin: <strong>{order.farmerName}'s Farm</strong> &bull; Vehicle: <strong>{order.vehicleNumber || 'HR-05-D-7821'}</strong></p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => setViewingReceiptOrder(order)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Transaction Details</span>
                      </button>
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        ETA: Today, 06:30 PM (On Schedule)
                      </span>
                    </div>
                  </div>

                  {/* 4-point milestone line */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2">
                    <div className="space-y-1">
                      <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center mx-auto text-xs">
                        ✓
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block text-[11px]">Farm Gate Intake</span>
                      <span className="text-[10px] text-slate-400">Completed 08:30 AM</span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center mx-auto text-xs">
                        ✓
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block text-[11px]">Mandi Quality Check</span>
                      <span className="text-[10px] text-slate-400">Assayed Grade-A</span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center mx-auto text-xs animate-pulse">
                        🚛
                      </div>
                      <span className="font-bold text-sky-800 dark:text-sky-300 block text-[11px]">In Highway Transit</span>
                      <span className="text-[10px] text-slate-400">GT Road Tollway</span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold flex items-center justify-center mx-auto text-xs">
                        4
                      </div>
                      <span className="font-bold text-slate-400 block text-[11px]">Warehouse Intake</span>
                      <span className="text-[10px] text-slate-400">Pending Arrival</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Escrow & Trade Settlements
                </span>
                <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1.5">
                  Buyer Escrow Account & Money Transaction Clearing
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Funds held in Reserve Bank of India e-Kuber / APMC trade escrow until physical warehouse delivery verification
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3 rounded-xl text-right">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Available Trade Escrow Balance</span>
                <div className="font-heading text-2xl font-black text-emerald-800 dark:text-emerald-400">
                  ₹12,45,000
                </div>
              </div>
            </div>

            {/* Top Cards: Add funds & GST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Dedicated Escrow Clearing Virtual Account</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Instant direct corporate treasury top-up via RTGS/NEFT</p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div>Virtual Acc: <strong className="text-slate-900 dark:text-slate-100">AGRIESCROW882190</strong></div>
                  <div>IFSC Code: <strong className="text-slate-900 dark:text-slate-100">HDFC0000128</strong></div>
                  <div>Beneficiary: <strong className="text-slate-900 dark:text-slate-100">AgriBridge Direct Escrow Clearing (RBI e-Kuber)</strong></div>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  <span>Active Payment Methods on File</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configured authorized institutional payment channels</p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">UPI / Dynamic QR Code</span>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">Auto-Linked</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">State Bank of India (Corporate RTGS)</span>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">Verified Direct Mandi Debit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Money Transactions & Payment Receipts Ledger */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    <span>Escrow Money Transactions & Payment Receipts</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Official financial transaction log with bank UTR numbers and download receipts
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[740px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-3 pr-3">Txn ID / UTR</th>
                      <th className="pb-3 pr-3">Payment Method</th>
                      <th className="pb-3 pr-3">Order / Commodity</th>
                      <th className="pb-3 pr-3">Farmer Beneficiary</th>
                      <th className="pb-3 pr-3">Transacted Total</th>
                      <th className="pb-3 pr-3">Status</th>
                      <th className="pb-3 text-right">Settlement Slip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {buyerOrders.map(order => {
                      const txn = order.transactionDetails;
                      const txId = txn?.transactionId || `TXN-AGRI-${order.id.replace('ord-', '88')}`;
                      const utrNo = txn?.utrNumber || `UTR-SBIN-2026-${order.id.replace('ord-', '942')}`;
                      const baseAmt = txn?.baseAmount || order.totalAmount;
                      const cess = txn?.mandiCess ?? Number((baseAmt * 0.015).toFixed(2));
                      const trans = txn?.totalTransacted ?? (baseAmt + cess + 250 + 3500);

                      return (
                        <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="py-3.5 pr-3">
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">{txId}</span>
                            <span className="font-mono text-[10px] text-slate-400">{utrNo}</span>
                          </td>
                          <td className="py-3.5 pr-3">
                            <span className="font-medium text-slate-800 dark:text-slate-200 block">
                              {order.paymentMethod || txn?.paymentMethod || 'UPI / Dynamic QR Code (Google Pay)'}
                            </span>
                            <span className="text-[10px] text-slate-400">{txn?.paidAt || order.orderDate}</span>
                          </td>
                          <td className="py-3.5 pr-3">
                            <strong className="text-slate-900 dark:text-slate-100">{order.crop}</strong>
                            <div className="text-[11px] text-slate-400">{order.quantityQuintals} Quintals &bull; {order.id}</div>
                          </td>
                          <td className="py-3.5 pr-3 text-slate-700 dark:text-slate-300">
                            {order.farmerName}
                          </td>
                          <td className="py-3.5 pr-3 font-heading font-black text-slate-900 dark:text-slate-100 text-sm">
                            ₹{trans.toLocaleString()}
                          </td>
                          <td className="py-3.5 pr-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {txn?.escrowStatus || 'Escrow Secured'}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => setViewingReceiptOrder(order)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Printer className="w-3 h-3" /> Receipt
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Direct Farm Trade Desk
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1.5">
                Negotiation Messenger & Producer Chat
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Communicate directly with registered FPO presidents and lead farmers</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[480px]">
              {/* Chat Sidebar */}
              <div className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-slate-50/60 dark:bg-slate-800/40">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Conversations</span>
                <div 
                  onClick={() => setActiveChatFarmer('Sardar Harbhajan Singh')}
                  className={`p-3 rounded-xl cursor-pointer text-xs transition-colors ${activeChatFarmer === 'Sardar Harbhajan Singh' ? 'bg-white dark:bg-slate-800 shadow-2xs border border-emerald-200 dark:border-emerald-700 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'}`}
                >
                  <div className="text-slate-900 dark:text-slate-100">Sardar Harbhajan Singh</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal truncate">Sharbati Wheat Khanna lot</div>
                </div>
                <div 
                  onClick={() => setActiveChatFarmer('Kisan Vikas FPO Sirsa')}
                  className={`p-3 rounded-xl cursor-pointer text-xs transition-colors ${activeChatFarmer === 'Kisan Vikas FPO Sirsa' ? 'bg-white dark:bg-slate-800 shadow-2xs border border-emerald-200 dark:border-emerald-700 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'}`}
                >
                  <div className="text-slate-900 dark:text-slate-100">Kisan Vikas FPO Sirsa</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal truncate">Cotton 40 bales agreement</div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 flex flex-col justify-between p-4 bg-white dark:bg-slate-900">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{activeChatFarmer}</div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Verified Seller
                  </span>
                </div>

                <div className="space-y-3 py-4 flex-1 overflow-y-auto max-h-[320px]">
                  {messages.map(m => (
                    <div key={m.id} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-sm text-xs ${m.sender === 'You' ? 'bg-emerald-700 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type counter offer or dispatch instruction..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
              <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Wholesale Procurement & Escrow Alerts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Commodity price movements, auction notices, and transaction settlements</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Paddy Harvest Peak Arrival in Punjab APMC Mandis</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Bulk listings increased by 40% in Khanna and Jalandhar yards. Competitive rates available.</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">1 hour ago</span>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Consignment #ORD-8812 Dispatched from Karnal</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Driver Jagtar Singh has departed farm yard with 25 Quintals. Escrow locked securely.</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 flex items-center justify-center font-heading font-black text-2xl border border-amber-200 dark:border-amber-800 shadow-2xs">
                PS
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Institutional Agro Buyer
                </span>
                <h1 className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                  {currentUser?.name || 'Priya Sharma'}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Buyer Reg: <strong>{currentUser?.identifier || 'BYR-DL-8821'}</strong> &bull; Ananya Agro Traders Wholesale Ltd.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                <h3 className="font-heading font-bold text-slate-900 dark:text-slate-100">Commercial Registration</h3>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div>GSTIN: <strong className="font-mono text-slate-900 dark:text-slate-100">07AAACR4910K1ZP</strong></div>
                  <div>FSSAI Central License: <strong className="font-mono text-slate-900 dark:text-slate-100">10019011004821</strong></div>
                  <div>PAN: <strong className="font-mono text-slate-900 dark:text-slate-100">AAACR4910K</strong></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                <h3 className="font-heading font-bold text-slate-900 dark:text-slate-100">Unloading Warehouse Hub</h3>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div>Facility: <strong>Northern Hub Silos & Cold Storage</strong></div>
                  <div>Address: <strong>Sector 18, Phase-IV, Kundli Industrial Area, Sonipat</strong></div>
                  <div>Gate Unloading Time: <strong>24 Hours Operative</strong></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Top Banner */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Institutional Buyer Terminal
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">&bull; Buyer Registration: <strong className="font-mono text-slate-700 dark:text-slate-300">{currentUser?.identifier || 'BYR-DL-8821'}</strong></span>
                </div>
                <h1 className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1.5">
                  Welcome, {currentUser?.name || 'Priya Sharma'}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verified Agro Aggregator & Food Processing Wholesale Terminal &bull; National Direct Farm Procurement Channel
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Active Fleet Orders</span>
                  <div className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100">
                    {buyerOrders.length} In Transit
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer Quick Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => setActiveTab('browse-crops')}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Available Farm Lots</span>
                <div className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
                  {marketplaceListings.length} <span className="text-xs font-semibold text-slate-400">Lots</span>
                </div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 block">Direct from FPOs & Certified Farmers</span>
              </div>

              <div 
                onClick={() => setActiveTab('my-orders')}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-slate-400 transition-colors cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Total Procured Produce</span>
                <div className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
                  {buyerOrders.reduce((acc, o) => acc + o.quantityQuintals, 0)} <span className="text-xs font-semibold text-slate-400">Quintals</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Current monthly aggregation</span>
              </div>

              <div 
                onClick={() => setActiveTab('order-tracking')}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-sky-400 transition-colors cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Logistics Dispatches</span>
                <div className="font-heading text-2xl font-black text-sky-700 dark:text-sky-400 mt-2">
                  {buyerOrders.length} Vehicles
                </div>
                <span className="text-[10px] text-sky-700 dark:text-sky-400 font-semibold mt-1 block">Real-time GPS Tracking Active</span>
              </div>

              <div 
                onClick={() => setActiveTab('payments')}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Escrow Cleared</span>
                <div className="font-heading text-2xl font-black text-emerald-800 dark:text-emerald-400 mt-2">
                  ₹{buyerOrders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 block">Settled to verified farmers</span>
              </div>
            </div>

            {/* Active Buyer Orders & Logistics Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    <span>Active Procurement Orders & Real-Time Logistics Tracking</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live fleet geolocation, e-way bill dispatches, and milestone tracking</p>
                </div>
                <button
                  onClick={() => setActiveTab('my-orders')}
                  className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {buyerOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {order.id}
                        </span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">
                          &bull; {order.crop} ({order.quantityQuintals} Quintals)
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
                          {order.paymentMethod || 'UPI (Google Pay)'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-300 mt-1">
                        <span>Farmer: <strong className="text-slate-900 dark:text-slate-100">{order.farmerName}</strong></span>
                        <span>&bull;</span>
                        <span>Amount: <strong className="text-slate-900 dark:text-slate-100 font-heading">₹{order.totalAmount.toLocaleString()}</strong></span>
                        <span>&bull;</span>
                        <span>Logistics: <strong className="text-slate-900 dark:text-slate-100">{order.vehicleNumber || 'HR-05-D-7821'}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setViewingReceiptOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-600 text-[11px] flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Transaction Slip</span>
                      </button>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Status & Schedule</span>
                        <span className="inline-flex items-center gap-1 font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                          <Clock className="w-3.5 h-3.5 text-sky-600" /> {order.transportStatus.toUpperCase()} &bull; {order.pickupDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderContent()}

      {/* Multi-Step Order Confirmation, Payment Methods & Money Transaction Modal */}
      {selectedCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="bg-emerald-800 dark:bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 dark:bg-emerald-800 flex items-center justify-center border border-emerald-600">
                  {orderStep === 'receipt' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-100" />
                  ) : orderStep === 'payment' ? (
                    <CreditCard className="w-6 h-6 text-emerald-100" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-emerald-100" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200">
                      Step {orderStep === 'form' ? '1 of 3: Specifications' : orderStep === 'payment' ? '2 of 3: Payment & Escrow' : '3 of 3: Settlement Receipt'}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-lg text-white mt-0.5">
                    {orderStep === 'form' && 'Direct Farm Procurement Order'}
                    {orderStep === 'payment' && 'Select Payment Method & Authorize Escrow'}
                    {orderStep === 'receipt' && 'Payment Successful & Escrow Secured'}
                  </h3>
                </div>
              </div>

              <button
                onClick={closeOrderModal}
                className="w-8 h-8 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 flex items-center justify-center font-bold text-lg transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-xs text-slate-700 dark:text-slate-300">

              {/* STEP 1: ORDER CONFIGURATION FORM */}
              {orderStep === 'form' && (
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  {/* Commodity Overview Card */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Commodity Produce:</span>
                      <strong className="text-slate-900 dark:text-slate-100 text-sm font-bold">{selectedCropModal.crop}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Producer Farmer / FPO:</span>
                      <strong className="text-slate-900 dark:text-slate-100">{selectedCropModal.farmerName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Farm Gate Location:</span>
                      <span className="text-slate-700 dark:text-slate-300">{selectedCropModal.location}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400">Agreed Lot Price:</span>
                      <strong className="text-emerald-800 dark:text-emerald-400 font-heading font-black text-sm">
                        ₹{selectedCropModal.pricePerQuintal.toLocaleString()} / Quintal
                      </strong>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-800 dark:text-slate-200 font-bold">
                        Procurement Quantity (Quintals)
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Available: <strong>{selectedCropModal.quantityQuintals} Qtl</strong>
                      </span>
                    </div>
                    <input
                      type="number"
                      value={orderQty}
                      onChange={(e) => setOrderQty(Math.max(1, Math.min(selectedCropModal.quantityQuintals, Number(e.target.value))))}
                      min={1}
                      max={selectedCropModal.quantityQuintals}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-sm"
                      required
                    />
                  </div>

                  {/* Pickup Date Input */}
                  <div>
                    <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                      Requested Farm Gate Pickup / Loading Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-xs"
                      required
                    />
                  </div>

                  {/* Pricing Breakdown Card */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Produce Base Value ({orderQty} Qtl @ ₹{selectedCropModal.pricePerQuintal}):</span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200">₹{baseOrderAmount.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">APMC Mandi Cess & Statutory Levy (1.5%):</span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200">₹{calculatedMandiCess.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Escrow Security & Assaying Guarantee:</span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200">₹{calculatedEscrowFee}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Dedicated Farm Logistics & Transit:</span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200">₹{calculatedFreight.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-950 dark:text-emerald-300">
                      <span>Total Net Escrow Contract:</span>
                      <span className="font-heading font-black text-base">₹{totalContractPayable.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={closeOrderModal}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-2 transition-colors"
                    >
                      <span>Confirm Order & Select Payment Method</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: PAYMENT METHODS & MONEY TRANSACTION DETAILS */}
              {orderStep === 'payment' && (
                <div className="space-y-4">
                  {/* Order Confirmed & Money Transaction Details Card */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        Confirmed Procurement Contract
                      </span>
                      <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                        {orderQty} Quintals &bull; {selectedCropModal.crop}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Farmer Beneficiary</span>
                        <strong className="text-slate-900 dark:text-slate-100">{selectedCropModal.farmerName}</strong>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">Aadhaar DBT Verified (PNB)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Total Escrow Amount</span>
                        <strong className="font-heading font-black text-emerald-950 dark:text-emerald-200 text-base">
                          ₹{totalContractPayable.toLocaleString()}
                        </strong>
                        <span className="text-[10px] text-slate-500 block">Includes Mandi cess & freight</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Selection Header */}
                  <div>
                    <label className="block text-slate-900 dark:text-slate-100 font-bold mb-2">
                      Select Payment Method to Fund Escrow
                    </label>

                    {/* Method Selector Tiles */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('upi')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedPaymentMethod === 'upi'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-700 dark:text-emerald-400" />
                        <span className="text-xs block">UPI / QR</span>
                        <span className="text-[10px] text-slate-400 block">Instant Lock</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('netbanking')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedPaymentMethod === 'netbanking'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Landmark className="w-5 h-5 mx-auto mb-1 text-sky-600" />
                        <span className="text-xs block">RTGS / NEFT</span>
                        <span className="text-[10px] text-slate-400 block">Corporate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('card')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedPaymentMethod === 'card'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                        <span className="text-xs block">Commercial Card</span>
                        <span className="text-[10px] text-slate-400 block">RuPay / Visa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('wallet')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedPaymentMethod === 'wallet'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Wallet className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                        <span className="text-xs block">e-NAM Wallet</span>
                        <span className="text-[10px] text-slate-400 block">₹12.45 Lakh</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Details Panel */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                    
                    {/* Method 1: UPI / Dynamic QR Code */}
                    {selectedPaymentMethod === 'upi' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-slate-100">Scan Dynamic Mandi UPI QR</span>
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> 0% Gateway Levy
                          </span>
                        </div>

                        {/* UPI App Selection */}
                        <div className="grid grid-cols-4 gap-2">
                          {(['gpay', 'phonepe', 'paytm', 'bhim'] as const).map(app => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => setSelectedUpiApp(app)}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold border capitalize transition-colors ${
                                selectedUpiApp === app
                                  ? 'bg-white dark:bg-slate-700 border-emerald-600 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white'
                              }`}
                            >
                              {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : app === 'paytm' ? 'Paytm' : 'BHIM'}
                            </button>
                          ))}
                        </div>

                        {/* QR Code & VPA preview */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700">
                          <div className="w-24 h-24 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center p-1 shrink-0">
                            <QrCode className="w-14 h-14 text-slate-800 dark:text-slate-200" />
                            <span className="text-[9px] font-mono text-slate-500 mt-0.5">UPI ESCROW</span>
                          </div>

                          <div className="flex-1 space-y-1.5 text-xs w-full">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                              Or authorize via linked Institutional VPA ID:
                            </span>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={upiVpa}
                                onChange={(e) => setUpiVpa(e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
                              />
                              <button
                                type="button"
                                onClick={handleCopyVpa}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold"
                              >
                                {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Linked Bank: HDFC Bank Wholesale Mandi Hub (•••• 8821)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Method 2: Net Banking RTGS / NEFT */}
                    {selectedPaymentMethod === 'netbanking' && (
                      <div className="space-y-3">
                        <label className="block text-slate-800 dark:text-slate-200 font-bold">
                          Select Corporate Treasury Bank for RTGS Escrow Clearing
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
                        >
                          <option value="State Bank of India (Corporate RTGS)">State Bank of India (Corporate RTGS - Nodal)</option>
                          <option value="HDFC Bank (Agri Institutional Banking)">HDFC Bank (Agri Institutional Banking)</option>
                          <option value="ICICI Bank (Direct APMC Gateway)">ICICI Bank (Direct APMC Gateway)</option>
                          <option value="Punjab National Bank (Farmer Clearing)">Punjab National Bank (Farmer Clearing)</option>
                          <option value="Axis Bank Corporate Wholesale">Axis Bank Corporate Wholesale</option>
                        </select>

                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                          <div>Virtual APMC Escrow A/C: <strong className="text-slate-900 dark:text-slate-100">AGRIESCROW-8812409</strong></div>
                          <div>IFSC Code: <strong className="text-slate-900 dark:text-slate-100">SBIN0001420</strong></div>
                          <div>Settlement Route: <strong className="text-emerald-700 dark:text-emerald-400">RBI e-Kuber Inter-Bank Clearing</strong></div>
                        </div>
                      </div>
                    )}

                    {/* Method 3: Commercial Card */}
                    {selectedPaymentMethod === 'card' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Corporate Card Number</label>
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Valid Thru</label>
                            <input
                              type="text"
                              value={cardData.expiry}
                              onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">CVV / CVC</label>
                            <input
                              type="text"
                              value={cardData.cvv}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Method 4: e-NAM Wallet */}
                    {selectedPaymentMethod === 'wallet' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">Pre-Funded Trade Balance</span>
                            <span className="font-heading font-black text-lg text-emerald-800 dark:text-emerald-400">
                              ₹12,45,000
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800">
                            Sufficient Balance
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          1-Click seamless deduction from your national unified market trade balance. No gateway delay.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Escrow Guarantee Disclaimer */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Escrow Safeguard:</strong> Funds will be securely locked in State Bank of India Nodal Escrow. Payout will only be released to farmer Sardar Ramesh Kumar's DBT bank account after physical digital weighbridge validation and quality verification at your Sonipat warehouse.
                    </span>
                  </div>

                  {/* Payment Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setOrderStep('form')}
                      disabled={isProcessingPayment}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <button
                      type="button"
                      onClick={handleAuthorizePayment}
                      disabled={isProcessingPayment}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Securing Escrow & Authorizing...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Authorize Payment of ₹{totalContractPayable.toLocaleString()}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: TRANSACTION DETAILS & SETTLEMENT RECEIPT */}
              {orderStep === 'receipt' && lastConfirmedOrder && (
                <div className="space-y-4">
                  {/* Success Banner */}
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="font-heading font-black text-lg text-emerald-950 dark:text-emerald-100">
                      Payment Authorized & Escrow Secured!
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      Contract #{lastConfirmedOrder.id} has been digitally signed and registered under APMC guidelines.
                    </p>
                  </div>

                  {/* Money Transaction Details Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-[11px]">
                    <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>Transaction Reference Record</span>
                      <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">STATUS: ESCROW HELD</span>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Transaction ID:</span>
                        <strong className="font-mono text-slate-900 dark:text-slate-100">
                          {lastConfirmedOrder.transactionDetails?.transactionId || 'TXN-AGRI-881290'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Bank UTR Reference:</span>
                        <strong className="font-mono text-slate-900 dark:text-slate-100">
                          {lastConfirmedOrder.transactionDetails?.utrNumber || 'UTR-SBIN-2026-9921401'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Payment Method:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {lastConfirmedOrder.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Clearing Gateway:</span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {lastConfirmedOrder.transactionDetails?.paymentGateway}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Farmer DBT Beneficiary:</span>
                        <span className="text-slate-900 dark:text-slate-100 font-bold">
                          {lastConfirmedOrder.farmerName} (Aadhaar Verified)
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
                        <span className="text-slate-900 dark:text-slate-100">Total Net Amount Transacted:</span>
                        <span className="font-heading font-black text-emerald-900 dark:text-emerald-300 text-sm">
                          ₹{lastConfirmedOrder.transactionDetails?.totalTransacted.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const orderToView = lastConfirmedOrder;
                        closeOrderModal();
                        setViewingReceiptOrder(orderToView);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-4 h-4 text-emerald-700" />
                      <span>Print Official Voucher</span>
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          closeOrderModal();
                          setActiveTab('order-tracking');
                        }}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Truck className="w-3.5 h-3.5" /> Track Logistics
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          closeOrderModal();
                          setActiveTab('my-orders');
                        }}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-2xs"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Standalone Full Transaction Details & Printable Voucher Modal */}
      {viewingReceiptOrder && (
        <OrderTransactionReceiptModal
          order={viewingReceiptOrder}
          onClose={() => setViewingReceiptOrder(null)}
        />
      )}
    </>
  );
};
