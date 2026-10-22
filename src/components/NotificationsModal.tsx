import React from 'react';
import { useBloodConnect } from '../context/BloodConnectContext';
import { Bell, X, CheckCheck, Clock } from 'lucide-react';
import { formatRelativeTime } from '../data/compatibility';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, currentRole } = useBloodConnect();

  if (!isOpen) return null;

  const roleNotifications = notifications.filter(
    (n) => n.targetRole === currentRole || n.targetRole === 'patient'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div
        id="notifications-modal-card"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Push Notifications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simulated Firebase Cloud Messaging (FCM) live stream
              </p>
            </div>
          </div>
          <button
            id="close-notifications-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isForActiveRole = notif.targetRole === currentRole;
              const isEmergency = notif.urgency === 'emergency';

              return (
                <div
                  key={notif.id}
                  id={`notification-item-${notif.id}`}
                  className={`pt-3 first:pt-0 p-3 rounded-xl transition-colors ${
                    isForActiveRole
                      ? isEmergency
                        ? 'bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50'
                        : 'bg-slate-50 dark:bg-slate-800/40'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          notif.targetRole === 'patient'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                            : notif.targetRole === 'donor'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                        }`}
                      >
                        {notif.targetRole}
                      </span>
                      {isEmergency && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded-full uppercase">
                          Urgent
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(notif.timestamp)}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                    {notif.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> Real-time instant synchronization
          </span>
          <button
            id="modal-dismiss-btn"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg shadow-2xs hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
