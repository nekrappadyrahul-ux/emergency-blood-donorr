import React, { useEffect } from 'react';
import { useBloodConnect } from '../context/BloodConnectContext';
import { Bell, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { activeToast, dismissToast } = useBloodConnect();

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeToast, dismissToast]);

  if (!activeToast) return null;

  const isEmergency = activeToast.urgency === 'emergency';

  return (
    <div
      id="notification-toast-container"
      className="fixed top-20 right-4 z-50 max-w-md w-full sm:w-96 shadow-2xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className={`p-4 flex items-start gap-3 ${isEmergency ? 'bg-red-50 dark:bg-red-950/40 border-l-4 border-l-red-600' : 'bg-slate-50 dark:bg-slate-800/60 border-l-4 border-l-emerald-600'}`}>
        <div className="shrink-0 mt-0.5">
          {isEmergency ? (
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/60 flex items-center justify-center text-red-600 dark:text-red-400 animate-pulse">
              <AlertCircle className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-red-600" />
              {activeToast.targetRole.toUpperCase()} ALERT (FCM)
            </span>
            <button
              id="close-toast-btn"
              onClick={dismissToast}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {activeToast.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
            {activeToast.message}
          </p>
        </div>
      </div>
    </div>
  );
};
