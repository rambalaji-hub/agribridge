import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Sprout, 
  Building2, 
  CalendarClock, 
  Ticket, 
  Users, 
  Activity, 
  Scale, 
  CreditCard, 
  Receipt, 
  ShoppingBag, 
  Bell, 
  HelpCircle, 
  LogOut, 
  Search, 
  Package, 
  Truck, 
  MessageSquare, 
  ShieldCheck, 
  SlidersHorizontal, 
  FileText, 
  AlertTriangle, 
  Lock, 
  Printer, 
  Clock, 
  TrendingUp,
  X,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItemConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
}) => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    setIsLogoutDialogOpen, 
    t,
    tD,
    bookings,
    notifications 
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeTokensCount = bookings.filter(b => b.status === 'waiting' || b.status === 'called').length;

  const getNavItems = (role: UserRole): NavItemConfig[] => {
    switch (role) {
      case 'farmer':
        return [
          { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
          { id: 'profile', label: t.navMyProfile, icon: User },
          { id: 'crop-details', label: t.navCropDetails, icon: Sprout },
          { id: 'procurement-centres', label: t.navProcurementCentres, icon: Building2 },
          { id: 'book-slot', label: t.navBookSlot, icon: CalendarClock, highlight: true },
          { id: 'my-tokens', label: t.navMyTokens, icon: Ticket, badge: activeTokensCount > 0 ? activeTokensCount : undefined },
          { id: 'live-queue', label: t.navLiveQueue, icon: Users },
          { id: 'procurement-status', label: t.navProcurementStatus, icon: Activity },
          { id: 'weigh-slip', label: t.navWeighSlip, icon: Scale },
          { id: 'payments', label: t.navPayments, icon: CreditCard },
          { id: 'digital-receipts', label: t.navDigitalReceipts, icon: Receipt },
          { id: 'direct-marketplace', label: t.navDirectMarketplace, icon: ShoppingBag },
          { id: 'notifications', label: t.navNotifications, icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
          { id: 'help-support', label: t.navHelpSupport, icon: HelpCircle },
        ];

      case 'officer':
        return [
          { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
          { id: 'centre-overview', label: t.navProcurementCentres, icon: Building2 },
          { id: 'slot-management', label: t.navSlotManagement, icon: CalendarClock },
          { id: 'farmer-bookings', label: t.navFarmerBookings, icon: Users, badge: bookings.length },
          { id: 'token-management', label: t.navTokenManagement, icon: Ticket },
          { id: 'live-queue', label: t.navLiveQueue, icon: Activity },
          { id: 'weighing-quality', label: t.navWeighingQuality, icon: Scale, highlight: true },
          { id: 'procurement-status', label: t.navProcurementStatus, icon: ShieldCheck },
          { id: 'payments', label: t.navPayments, icon: CreditCard },
          { id: 'reports', label: t.navReports, icon: TrendingUp },
          { id: 'notifications', label: t.navNotifications, icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
          { id: 'profile', label: t.navMyProfile, icon: User },
        ];

      case 'buyer':
        return [
          { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
          { id: 'browse-crops', label: t.navBrowseCrops, icon: ShoppingBag, highlight: true },
          { id: 'search-filter', label: t.navSearchFilter, icon: Search },
          { id: 'crop-details', label: t.navCropDetails, icon: Sprout },
          { id: 'my-orders', label: t.navMyOrders, icon: Package },
          { id: 'order-tracking', label: t.navOrderTracking, icon: Truck },
          { id: 'payments', label: t.navPayments, icon: CreditCard },
          { id: 'messages', label: t.navMessages, icon: MessageSquare },
          { id: 'notifications', label: t.navNotifications, icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
          { id: 'profile', label: t.navMyProfile, icon: User },
        ];

      case 'admin':
        return [
          { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
          { id: 'users', label: t.navUsers, icon: Users },
          { id: 'farmers', label: t.navFarmers, icon: Sprout },
          { id: 'procurement-officers', label: t.navOfficers, icon: ShieldCheck },
          { id: 'buyers', label: t.navBuyers, icon: ShoppingBag },
          { id: 'assisted-access-staff', label: t.navAssistedStaff, icon: User },
          { id: 'procurement-centres', label: t.navProcurementCentres, icon: Building2 },
          { id: 'slot-capacity', label: t.navSlotManagement, icon: CalendarClock },
          { id: 'bookings', label: t.navFarmerBookings, icon: Ticket },
          { id: 'marketplace', label: t.navDirectMarketplace, icon: ShoppingBag },
          { id: 'payments', label: t.navPayments, icon: CreditCard },
          { id: 'reports-analytics', label: t.navReports, icon: TrendingUp },
          { id: 'complaints', label: t.navComplaints, icon: AlertTriangle },
          { id: 'notifications', label: t.navNotifications, icon: Bell },
          { id: 'security-monitoring', label: t.navSecurity, icon: Lock },
          { id: 'audit-trail', label: t.navAuditTrail, icon: FileText },
          { id: 'system-settings', label: t.navSettings, icon: SlidersHorizontal },
          { id: 'profile', label: t.navMyProfile, icon: User },
        ];

      case 'assisted':
        return [
          { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
          { id: 'register-farmer', label: t.navRegisterFarmer, icon: User, highlight: true },
          { id: 'crop-quantity', label: t.navCropQuantity, icon: Sprout },
          { id: 'procurement-centres', label: t.navProcurementCentres, icon: Building2 },
          { id: 'book-slot', label: t.navBookSlot, icon: CalendarClock },
          { id: 'generate-token', label: t.navGenerateToken, icon: Ticket },
          { id: 'print-token', label: t.navPrintToken, icon: Printer },
          { id: 'track-procurement', label: t.navProcurementStatus, icon: Activity },
          { id: 'price-msp', label: t.navMspInfo, icon: TrendingUp },
          { id: 'print-documents', label: t.navPrintDocs, icon: FileText },
          { id: 'alerts', label: t.navNotifications, icon: Bell },
          { id: 'service-history', label: t.navServiceHistory, icon: Clock },
          { id: 'profile', label: t.navMyProfile, icon: User },
        ];

      default:
        return [
          { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
        ];
    }
  };

  const navItems = currentUser ? getNavItems(currentUser.role) : [];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-black border-r border-slate-200 dark:border-white/10 select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-tight">
              AgriBridge
            </div>
            <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              {currentUser?.role ? `${t[`${currentUser.role}Role` as keyof typeof t] || currentUser.role} ${tD('portalTag', 'PORTAL')}` : t.officialTag}
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-900"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Notice Pill */}
      {currentUser && (
        <div className="px-3 pt-3 pb-1">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-white/10 text-[11px] flex items-center justify-between">
            <div className="truncate">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                {tD('authorizedNode')}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {currentUser.identifier}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950" />
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1">
          {tD('menuNavigation')}
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 text-left ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold border-l-4 border-emerald-600 shadow-2xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* User Profile & Logout Bottom Bar */}
      <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-black">
        {currentUser && (
          <div className="mb-2 p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0"
              />
              <div className="truncate">
                <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.location}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          id="sidebar-logout-btn"
          onClick={() => setIsLogoutDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.navLogout}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside 
        className={`hidden lg:block fixed left-0 top-0 bottom-0 z-40 transition-all duration-200 ${
          isCollapsed ? 'w-20' : 'w-[250px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
