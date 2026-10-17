import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  CreditCard, 
  AlertTriangle, 
  CalendarClock, 
  FileText, 
  SlidersHorizontal,
  Lock,
  Download,
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  Printer,
  ShoppingBag,
  Ticket,
  Clock,
  MapPin,
  Scale
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_CROPS } from '../../data/mockData';

const COMMODITY_DATA = [
  { name: 'Paddy (Dhan)', target: 1200, achieved: 980 },
  { name: 'Wheat (Gehun)', target: 1400, achieved: 1350 },
  { name: 'Maize (Makka)', target: 450, achieved: 380 },
  { name: 'Groundnut', target: 300, achieved: 210 },
  { name: 'Mustard', target: 500, achieved: 490 },
];

const CENTRE_STATUS_DATA = [
  { name: 'Optimal (< 10 queue)', value: 184, color: '#059669' },
  { name: 'Moderate (10-25 queue)', value: 112, color: '#0284c7' },
  { name: 'High Traffic (> 25 queue)', value: 46, color: '#d97706' },
];

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    centres, 
    bookings, 
    complaints, 
    auditLogs, 
    resolveComplaint,
    marketplaceListings,
    marketplaceOrders 
  } = useApp();

  const [searchUser, setSearchUser] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Sample Multi-Role Users Directory for Admin Management
  const [userList, setUserList] = useState([
    { id: 'USR-F-101', name: 'Sardar Gurdeep Singh', role: 'farmer', location: 'Ludhiana, Punjab', aadhaar: 'Verified', status: 'Active', phone: '9876543210' },
    { id: 'USR-F-102', name: 'Ramesh Patel', role: 'farmer', location: 'Mehsana, Gujarat', aadhaar: 'Verified', status: 'Active', phone: '9822334455' },
    { id: 'USR-O-201', name: 'Rajesh Verma (Class-I)', role: 'officer', location: 'APMC Hub Khanna', aadhaar: 'Verified (DSC Active)', status: 'On Duty', phone: '9811223344' },
    { id: 'USR-O-202', name: 'Dr. Anita Joshi (QA)', role: 'officer', location: 'APMC Karnal', aadhaar: 'Verified', status: 'On Duty', phone: '9844556677' },
    { id: 'USR-B-301', name: 'Priya Sharma (Agra Agro)', role: 'buyer', location: 'Sonipat, Haryana', aadhaar: 'GST Verified', status: 'Active', phone: '9899001122' },
    { id: 'USR-B-302', name: 'Reliance Retail Agri Sourcing', role: 'buyer', location: 'Chandigarh Hub', aadhaar: 'GST Verified', status: 'Active', phone: '9800112233' },
    { id: 'USR-A-401', name: 'Manish Kumar (VLE)', role: 'assisted', location: 'CSC Kiosk Taraori', aadhaar: 'Verified', status: 'Active', phone: '9877112233' },
  ]);

  const handleToggleUserStatus = (userId: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id !== userId) return u;
      return {
        ...u,
        status: u.status === 'Active' || u.status === 'On Duty' ? 'Suspended' : 'Active'
      };
    }));
  };

  const handleResolve = (ticketId: string) => {
    if (!resolutionNote.trim()) return;
    resolveComplaint(ticketId, resolutionNote);
    setSelectedComplaintId(null);
    setResolutionNote('');
  };

  const renderContent = () => {
    switch (activeTab) {
      // 1. User Directories
      case 'users':
      case 'farmers':
      case 'procurement-officers':
      case 'buyers':
      case 'assisted-access-staff': {
        const filterRole = 
          activeTab === 'farmers' ? 'farmer' :
          activeTab === 'procurement-officers' ? 'officer' :
          activeTab === 'buyers' ? 'buyer' :
          activeTab === 'assisted-access-staff' ? 'assisted' : 'all';

        const filteredUsers = userList.filter(u => {
          const matchRole = filterRole === 'all' || u.role === filterRole;
          const matchSearch = u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                              u.location.toLowerCase().includes(searchUser.toLowerCase()) ||
                              u.phone.includes(searchUser);
          return matchRole && matchSearch;
        });

        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Identity & Access Governance
                </span>
                <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                  Central User Directory & Role Registry
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage Aadhaar-verified farmers, gazetted mandi officers, institutional buyers, and CSC kiosk operators
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Search user by name, phone, or location..."
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-3 pr-4">User ID</th>
                    <th className="pb-3 pr-4">Full Name</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3 pr-4">Location</th>
                    <th className="pb-3 pr-4">KYC Status</th>
                    <th className="pb-3 pr-4">Account Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-slate-800">{u.id}</td>
                      <td className="py-3.5 pr-4 font-bold text-slate-900">{u.name}</td>
                      <td className="py-3.5 pr-4 uppercase text-[10px] font-bold tracking-wider text-slate-600">
                        {u.role}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600">{u.location}</td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> {u.aadhaar}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.status === 'Active' || u.status === 'On Duty'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors ${
                            u.status === 'Active' || u.status === 'On Duty'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {u.status === 'Active' || u.status === 'On Duty' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      // 2. Mandi Centres & Slot Capacity
      case 'procurement-centres':
      case 'slot-capacity':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Infrastructure Telemetry
                </span>
                <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                  National APMC Procurement Hubs & Dynamic Capacity
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Live monitoring of 342 state mandi yards and weighbridge quotas</p>
              </div>

              <button
                onClick={() => alert('New APMC Centre node provisioning wizard launched.')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Provision APMC Centre
              </button>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-3 pr-4">Code</th>
                    <th className="pb-3 pr-4">Mandi Hub & District</th>
                    <th className="pb-3 pr-4">Daily Quota</th>
                    <th className="pb-3 pr-4">Utilization</th>
                    <th className="pb-3 pr-4">Current Queue</th>
                    <th className="pb-3 pr-4">Avg Wait</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {centres.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-slate-900">{c.code}</td>
                      <td className="py-3.5 pr-4">
                        <span className="font-bold text-slate-900">{c.name}</span>
                        <span className="text-[10px] text-slate-400 block">{c.district}, {c.state}</span>
                      </td>
                      <td className="py-3.5 pr-4 font-semibold text-slate-900">{c.dailyCapacityQuintals} Qtl</td>
                      <td className="py-3.5 pr-4">
                        <span className="font-bold">{Math.round((c.currentBookedQuintals / c.dailyCapacityQuintals) * 100)}%</span>
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="bg-emerald-600 h-full rounded-full" 
                            style={{ width: `${Math.min(100, (c.currentBookedQuintals / c.dailyCapacityQuintals) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-slate-900">{c.currentQueueCount} Tractors</td>
                      <td className="py-3.5 pr-4 text-slate-600">{c.averageWaitTimeMinutes} mins</td>
                      <td className="py-3.5 pr-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {c.operatingStatus}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <button
                          onClick={() => alert(`Slot capacity increased by 50 slots for ${c.name}`)}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-[11px]"
                        >
                          +50 Slots
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 3. Central Bookings Oversight
      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                National Arrival Ledger
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Central Mandi Bookings & Token Oversight ({bookings.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time arrival scheduling and gate surge telemetry across all states</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-3 pr-4">Token</th>
                    <th className="pb-3 pr-4">Farmer Name</th>
                    <th className="pb-3 pr-4">Commodity</th>
                    <th className="pb-3 pr-4">Quantity</th>
                    <th className="pb-3 pr-4">Mandi Hub</th>
                    <th className="pb-3 pr-4">Slot</th>
                    <th className="pb-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-emerald-800">{b.tokenNumber}</td>
                      <td className="py-3.5 pr-4 font-bold text-slate-900">{b.farmerName}</td>
                      <td className="py-3.5 pr-4 font-medium text-slate-800">{b.crop}</td>
                      <td className="py-3.5 pr-4 font-semibold text-slate-900">{b.quantityQuintals} Qtl</td>
                      <td className="py-3.5 pr-4 text-slate-600">{b.centreName}</td>
                      <td className="py-3.5 pr-4 text-slate-600">{b.slotTime}</td>
                      <td className="py-3.5 pr-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {b.status ? String(b.status).replace(/_/g, ' ') : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 4. Marketplace Oversight
      case 'marketplace':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Direct Farm Trade Oversight
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Surplus Marketplace & Institutional Buyer Trade Health
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Escrow balance verification, wholesale contracts, and fair trade compliance</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Farmer Listings</span>
                <div className="font-heading text-2xl font-black text-slate-900 mt-1">{marketplaceListings.length} Lots</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total B2B Contract Orders</span>
                <div className="font-heading text-2xl font-black text-slate-900 mt-1">{marketplaceOrders.length} Executed</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Trade Escrow Health</span>
                <div className="font-heading text-2xl font-black text-emerald-800 mt-1">100% Secured</div>
              </div>
            </div>
          </div>
        );

      // 5. DBT Disbursals
      case 'payments':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  PFMS & National Treasury
                </span>
                <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                  Direct Benefit Transfer (DBT) National Disbursals
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Central PFMS gateway telemetry and Aadhaar Payment Bridge (APB) reconciliation</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-xl text-right">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Season Disbursal Total</span>
                <div className="font-heading text-2xl font-black text-emerald-800">₹4,120.4 Cr</div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 text-xs">
              <h3 className="font-heading font-bold text-slate-900 text-sm">PFMS 2.0 Gateway Latency & Throughput</h3>
              <p className="text-slate-500">Average Aadhaar payment turnaround: <strong>14.2 Hours</strong> (Mandate requires &lt; 48 Hours).</p>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 font-bold border border-emerald-200">
                All 28 State Treasury Nodal Accounts reporting Zero pending payment arrears.
              </div>
            </div>
          </div>
        );

      // 6. Complaints & Grievance
      case 'complaints':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                Farmer Grievance Redressal
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Central Grievance Ticketing & Resolution Portal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Track, investigate, and resolve farmer complaints regarding moisture deductions or payment delays</p>
            </div>

            <div className="space-y-4">
              {complaints.map(t => (
                <div key={t.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-400">{t.id}</span>
                      <h4 className="font-heading font-bold text-slate-900 text-base">{t.category}</h4>
                      <p className="text-xs text-slate-500">Filed by <strong>{t.farmerName}</strong> &bull; {t.dateSubmitted}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {t.description}
                  </p>

                  {t.resolutionNote && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                      <strong>Resolution:</strong> {t.resolutionNote}
                    </div>
                  )}

                  {t.status !== 'Resolved' && (
                    <div className="pt-2 flex items-center gap-2">
                      {selectedComplaintId === t.id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={resolutionNote}
                            onChange={(e) => setResolutionNote(e.target.value)}
                            placeholder="Enter official resolution notes..."
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                          />
                          <button
                            onClick={() => handleResolve(t.id)}
                            className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedComplaintId(t.id)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
                        >
                          Resolve Grievance
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      // 7. Security & Audit Trail
      case 'security-monitoring':
      case 'audit-trail':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Cryptographic Audit Trail
                </span>
                <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                  Tamper-Evident National Security Logs
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Immutable blockchain ledger recording all weighbridge slips, price adjustments, and DSC approvals</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                100% Cryptographically Intact
              </span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs divide-y divide-slate-100 text-xs font-mono">
              {auditLogs.map(log => (
                <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-slate-500 text-[11px] block font-sans mt-0.5">{log.newValue || log.action}</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 font-sans">
                    <span>By: <strong className="text-slate-700">{log.userName}</strong> &bull; {log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 8. System Settings
      case 'system-settings':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                Governance Configuration
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                APMC System Settings & Minimum Support Price Master
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Configure official statutory MSP rates and electronic legal metrology parameters</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-heading font-bold text-slate-900 text-base">Current Kharif & Rabi MSP Price Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-3 pr-4">Commodity</th>
                      <th className="pb-3 pr-4">Category</th>
                      <th className="pb-3 pr-4">Official MSP (₹ / Qtl)</th>
                      <th className="pb-3 pr-4">Max Moisture Allowed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {OFFICIAL_CROPS.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/80">
                        <td className="py-3 pr-4 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3 pr-4 text-slate-600">{c.category}</td>
                        <td className="py-3 pr-4 font-heading font-black text-emerald-800 text-sm">₹{c.mspPrice}</td>
                        <td className="py-3 pr-4 font-semibold text-slate-700">{c.maxMoistureAllowed}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // 9. Admin Profile
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-heading font-black text-2xl border border-indigo-200 shadow-2xs">
                VK
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
                  Joint Secretary & Nodal Administrator (IAS)
                </span>
                <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Vikramaditya Kulkarni, IAS
                </h1>
                <p className="text-xs text-slate-500 font-mono">
                  Govt Service ID: <strong>ADM-CENTRAL-001</strong> &bull; Ministry of Agriculture & Farmers Welfare
                </p>
              </div>
            </div>
          </div>
        );

      // Default: Overview Dashboard
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Top Admin Bar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
                    Department of Food & Public Distribution
                  </span>
                  <span className="text-xs text-slate-400">&bull; Central Oversight Telemetry</span>
                </div>
                <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                  National Agricultural Procurement Command Center
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time telemetry across 342 automated APMC hubs, electronic weighbridges, and PFMS payment gateways.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center gap-2 transition-colors shadow-2xs"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Export National Report</span>
                </button>
              </div>
            </div>

            {/* 5 Macro Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Registered Farmers</span>
                <div className="font-heading text-2xl font-black text-slate-900 mt-2">
                  1,48,290
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">+1,240 enrolled today</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Mandi Nodes</span>
                <div className="font-heading text-2xl font-black text-slate-900 mt-2">
                  342 <span className="text-xs font-semibold text-slate-400">Centres</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">100% telemetry online</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target vs Achieved</span>
                <div className="font-heading text-2xl font-black text-slate-900 mt-2">
                  1.82M <span className="text-xs font-semibold text-slate-400">/ 2.50M MT</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">72.8% achieved</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">DBT Disbursed</span>
                <div className="font-heading text-2xl font-black text-emerald-800 mt-2">
                  ₹4,120.4 <span className="text-xs font-semibold">Cr</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Direct bank transfers</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Grievance SLA</span>
                <div className="font-heading text-2xl font-black text-slate-900 mt-2">
                  98.4%
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">14 open resolution tickets</span>
              </div>
            </div>

            {/* Analytics Visualizer with Recharts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Commodity Procurement Chart */}
              <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-base font-bold text-slate-900">
                      Commodity Procurement Progress (Thousand MT)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Target allocation vs live procurement weighbridge intake</p>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={COMMODITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                      <Bar dataKey="target" name="State Target (k MT)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="achieved" name="Procured to Date (k MT)" fill="#047857" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Centre Operating Congestion Chart */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Centres Operating Congestion
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time gate queue load monitoring</p>
                </div>

                <div className="h-52 w-full my-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CENTRE_STATUS_DATA}
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {CENTRE_STATUS_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
                  {CENTRE_STATUS_DATA.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-bold text-slate-900">{item.value} Centres</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Procurement Centres Management & Capacity Controls */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Authorized APMC Procurement Hubs & Live Telemetry
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">State-wide quota management and queue throughput control</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-3 pr-4">Centre Code</th>
                      <th className="pb-3 pr-4">Centre Name & District</th>
                      <th className="pb-3 pr-4">Supported Crops</th>
                      <th className="pb-3 pr-4">Capacity Utilization</th>
                      <th className="pb-3 pr-4">Current Queue</th>
                      <th className="pb-3 pr-4">Avg Wait</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {centres.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 pr-4 font-mono font-bold text-slate-900">{c.code}</td>
                        <td className="py-3.5 pr-4 font-bold text-slate-900">
                          {c.name}
                          <span className="text-[10px] text-slate-400 block font-normal">{c.district}, {c.state}</span>
                        </td>
                        <td className="py-3.5 pr-4 text-slate-600">{c.supportedCrops.join(', ')}</td>
                        <td className="py-3.5 pr-4">
                          <span className="font-bold text-slate-900">{c.currentBookedQuintals.toLocaleString()} / {c.dailyCapacityQuintals.toLocaleString()} Qtl</span>
                          <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div 
                              className="bg-emerald-600 h-full rounded-full" 
                              style={{ width: `${Math.min(100, (c.currentBookedQuintals / c.dailyCapacityQuintals) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 font-bold text-slate-900">
                          {c.currentQueueCount} Farmers
                        </td>
                        <td className="py-3.5 pr-4 text-slate-600">{c.averageWaitTimeMinutes} mins</td>
                        <td className="py-3.5 pr-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {c.operatingStatus}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <button 
                            onClick={() => alert(`Centres slot quota increased by 50 slots for ${c.name}`)}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold text-[11px] transition-colors"
                          >
                            Adjust Quota
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Audit Trail Log */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-700" />
                    <span>Immutable Security Audit Log (Blockchain & PFMS Linked)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Automated tamper-evident cryptographic trail</p>
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Cryptographically Sealed
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs font-mono">
                {auditLogs.map(log => (
                  <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-slate-500 text-[11px] block font-sans mt-0.5">{log.newValue || log.action}</span>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 font-sans">
                      <span>By: <strong className="text-slate-700">{log.userName}</strong> &bull; {log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};
