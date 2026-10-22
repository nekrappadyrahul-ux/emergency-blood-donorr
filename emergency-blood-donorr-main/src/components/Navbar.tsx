import React, { useState } from 'react';
import { useBloodConnect } from '../context/BloodConnectContext';
import { UserRole } from '../types';
import {
  Bell,
  RotateCcw,
  Smartphone,
  Monitor,
  HeartHandshake,
  Building2,
  User,
  Info,
  CheckCircle2,
  Sparkles,
  Download
} from 'lucide-react';

interface NavbarProps {
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMobileFrame,
  setIsMobileFrame,
  onOpenNotifications,
}) => {
  const {
    currentRole,
    setCurrentRole,
    currentDonor,
    currentHospital,
    notifications,
    resetAllData,
  } = useBloodConnect();

  const [showDemoGuide, setShowDemoGuide] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Promise */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/20">
              <span className="text-xl font-black">🩸</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  BloodConnect
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 uppercase tracking-wider">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-xs md:max-w-md">
                Find available blood nearby & quickly connect verified donors & hospitals
              </p>
            </div>
          </div>

          {/* User Role Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              id="nav-role-patient"
              onClick={() => setCurrentRole('patient')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'patient'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>

            <button
              id="nav-role-donor"
              onClick={() => setCurrentRole('donor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'donor'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Donor ({currentDonor.bloodGroup})</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  currentDonor.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
            </button>

            <button
              id="nav-role-hospital"
              onClick={() => setCurrentRole('hospital')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'hospital'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Hospital</span>
              <span className="md:hidden">Hospital</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Demo Guide Popover Toggle */}
            <button
              id="nav-demo-guide-btn"
              onClick={() => setShowDemoGuide(!showDemoGuide)}
              title="View MVP Flow Walkthrough"
              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* View Mode Toggle (Mobile Frame vs Expanded) */}
            <button
              id="nav-toggle-frame-btn"
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              title={isMobileFrame ? 'Switch to Full Screen View' : 'Switch to Mobile Frame Preview'}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex"
            >
              {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>

            {/* FCM Notifications Bell */}
            <button
              id="nav-notifications-bell-btn"
              onClick={onOpenNotifications}
              title="Push Notifications"
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-[10px] font-black text-white rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Download Project ZIP Button */}
            <a
              id="nav-download-zip-btn"
              href="/bloodconnect-project.zip"
              download="bloodconnect-project.zip"
              title="Download Entire Project Source Code (.ZIP)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download ZIP</span>
            </a>

            {/* Reset Demo Data */}
            <button
              id="nav-reset-data-btn"
              onClick={() => {
                if (confirm('Reset all demo requests, inventories, and states to defaults?')) {
                  resetAllData();
                }
              }}
              title="Reset Demo Data"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Demo Flow Guide Dropdown Modal */}
      {showDemoGuide && (
        <div className="absolute right-4 sm:right-16 top-18 z-50 w-80 sm:w-96 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> MVP Loop Walkthrough
            </span>
            <button
              onClick={() => setShowDemoGuide(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <p>
                <strong>Patient View</strong>: Search O+ blood or tap <strong>🚨 REQUEST BLOOD NOW</strong>. Submit emergency request #BC1024.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <p>
                <strong>Donor View (Rahul)</strong>: Switch tabs. See instant emergency request card for O+ blood 2 km away. Tap <strong>Accept Request</strong>.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <p>
                <strong>Hospital View</strong>: Tap <strong>O+ → 15 → Update</strong> to change inventory in real-time, or confirm incoming patient emergency requests.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <p>
                <strong>Live Request Tracking</strong>: Switch back to Patient view to see status update through 🟢 Created → 🟢 Donor Found → 🟡 Confirmed → ⚪ Fulfilled!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDemoGuide(false)}
            className="w-full mt-3 py-1.5 text-xs font-bold text-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-200"
          >
            Got it, let's try!
          </button>
        </div>
      )}
    </header>
  );
};
