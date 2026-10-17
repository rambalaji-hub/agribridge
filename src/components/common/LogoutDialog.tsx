import React from 'react';
import { LogOut, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LogoutDialog: React.FC = () => {
  const { isLogoutDialogOpen, setIsLogoutDialogOpen, logout, t } = useApp();

  if (!isLogoutDialogOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4 border border-rose-200 dark:border-rose-900/60">
          <LogOut className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Are you sure you want to logout?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Your current session and security token will be ended. Unsaved form entries may need to be re-entered.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            id="cancel-logout-btn"
            onClick={() => setIsLogoutDialogOpen(false)}
            className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-white/10 font-semibold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            id="confirm-logout-btn"
            onClick={logout}
            className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 font-semibold text-xs text-white shadow-xs transition-colors"
          >
            {t.navLogout}
          </button>
        </div>
      </div>
    </div>
  );
};
