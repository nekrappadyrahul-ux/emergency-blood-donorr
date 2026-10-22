import React, { useState } from 'react';
import { BloodConnectProvider, useBloodConnect } from './context/BloodConnectContext';
import { Navbar } from './components/Navbar';
import { NotificationToast } from './components/NotificationToast';
import { NotificationsModal } from './components/NotificationsModal';
import { PatientView } from './components/Patient/PatientView';
import { DonorView } from './components/Donor/DonorView';
import { HospitalView } from './components/Hospital/HospitalView';
import {
  HeartHandshake,
  Building2,
  User,
  Zap,
  CheckCircle,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

function AppContent() {
  const { currentRole, setCurrentRole } = useBloodConnect();
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-100/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar with Role Switcher & Real-time FCM Bell */}
      <Navbar
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
      />

      {/* Real-time Push Notification Alert (Toast) */}
      <NotificationToast />

      {/* FCM Push Notifications Feed Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />

      {/* Quick Ecosystem Role Quickbar (Always accessible for rapid testing) */}
      <div className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-xs py-2 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              Active Persona:
            </span>
            <span
              className={`font-black px-2 py-0.5 rounded-full text-[11px] ${
                currentRole === 'patient'
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  : currentRole === 'donor'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
              }`}
            >
              {currentRole === 'patient' && '👤 Patient (Priya)'}
              {currentRole === 'donor' && '🩸 Donor (Rahul • O+)'}
              {currentRole === 'hospital' && '🏥 Hospital (City Hospital)'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Switch:</span>
            <button
              onClick={() => setCurrentRole('patient')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                currentRole === 'patient'
                  ? 'bg-red-600 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setCurrentRole('donor')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                currentRole === 'donor'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Donor
            </button>
            <button
              onClick={() => setCurrentRole('hospital')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                currentRole === 'hospital'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Hospital
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 py-6 px-4 sm:px-6 flex justify-center items-start">
        {isMobileFrame ? (
          /* Mobile Frame Container (Simulating Flutter / Phone experience) */
          <div className="w-full max-w-[410px] bg-slate-900 p-3 rounded-[48px] shadow-2xl border-4 border-slate-700 relative">
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900" />
            </div>

            {/* Phone Screen */}
            <div className="bg-slate-50 dark:bg-slate-950 rounded-[38px] overflow-hidden min-h-[720px] flex flex-col">
              {/* Phone Status Bar */}
              <div className="pt-2 px-6 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Scrollable Phone Body */}
              <div className="flex-1 p-3 overflow-y-auto">
                {currentRole === 'patient' && <PatientView />}
                {currentRole === 'donor' && <DonorView />}
                {currentRole === 'hospital' && <HospitalView />}
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="py-2 flex justify-center">
                <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Standard Fluid View */
          <div className="w-full max-w-xl">
            {currentRole === 'patient' && <PatientView />}
            {currentRole === 'donor' && <DonorView />}
            {currentRole === 'hospital' && <HospitalView />}
          </div>
        )}
      </main>

      {/* Footer with MVP Promise Banner */}
      <footer className="py-4 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            🩸 BloodConnect MVP — "Find available blood nearby and quickly connect a patient with a verified hospital or donor."
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>⚡ Real-Time Matching</span>
            <span>•</span>
            <span>📍 5–10 km Radius</span>
            <span>•</span>
            <span>🔒 Donor Privacy Protected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BloodConnectProvider>
      <AppContent />
    </BloodConnectProvider>
  );
}
