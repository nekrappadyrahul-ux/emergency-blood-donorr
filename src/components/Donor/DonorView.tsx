import React, { useState } from 'react';
import { useBloodConnect } from '../../context/BloodConnectContext';
import { BloodRequest } from '../../types';
import { isDonorCompatible } from '../../data/compatibility';
import {
  Heart,
  Power,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { formatRelativeTime } from '../../data/compatibility';
import { DonorRequestDetailModal } from './DonorRequestDetailModal';

export const DonorView: React.FC = () => {
  const { currentDonor, toggleDonorAvailability, requests } = useBloodConnect();
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  // Filter emergency requests matching donor's blood group compatibility
  const compatibleEmergencyRequests = requests.filter((req) => {
    const isCompat = isDonorCompatible(currentDonor.bloodGroup, req.bloodGroup);
    return isCompat && req.status !== 'fulfilled' && req.status !== 'cancelled';
  });

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Donor Home Card (Section 3 Mockup) */}
      <div
        id="donor-home-card"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-6"
      >
        {/* Welcome Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Welcome, {currentDonor.name} 👋
              </h2>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-sm">
                Verified Donor
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentDonor.location} • {currentDonor.totalDonations} lifesaving donations
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* Blood Group & Availability Switcher */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Blood Group Tile */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Blood Group
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-red-600 font-mono">
                  {currentDonor.bloodGroup}
                </span>
                <span className="text-[10px] text-slate-500">Universal Donor</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center font-bold text-xs">
              🩸
            </div>
          </div>

          {/* Availability Tile (Section 3 Mockup) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Availability
              </span>
              <span className="flex items-center gap-1.5 text-xs font-black">
                {currentDonor.available ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    🟢 AVAILABLE
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    OFFLINE
                  </span>
                )}
              </span>
            </div>

            <div className="mt-3">
              <button
                id="donor-toggle-availability-btn"
                onClick={() => toggleDonorAvailability(!currentDonor.available)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs ${
                  currentDonor.available
                    ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>
                  {currentDonor.available ? '[ Turn OFF ]' : '[ Turn ON (Available) ]'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Donation Eligibility Stats */}
        <div className="mt-4 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Last Donation: <strong>{currentDonor.lastDonationDate}</strong>
          </span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Eligible to Donate
          </span>
        </div>

        {/* Mockup Divider */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>🚨 Emergency Requests</span>
              {compatibleEmergencyRequests.length > 0 && (
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  {compatibleEmergencyRequests.length}
                </span>
              )}
            </h3>
            <span className="text-xs text-slate-400">Within 10 km</span>
          </div>

          {!currentDonor.available ? (
            <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <Power className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                You are currently marked as Offline.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Turn your availability ON to receive live notifications for nearby emergency blood requests.
              </p>
              <button
                onClick={() => toggleDonorAvailability(true)}
                className="mt-3 px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg"
              >
                Go Available Now
              </button>
            </div>
          ) : compatibleEmergencyRequests.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-70" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No active emergency requests right now.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                You will receive a push notification instantly when someone nearby requires {currentDonor.bloodGroup} blood.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {compatibleEmergencyRequests.map((req) => {
                const isAccepted = req.matchedDonorId === currentDonor.userId;

                return (
                  <div
                    key={req.id}
                    id={`donor-req-item-${req.id}`}
                    className={`p-4 rounded-2xl border transition-all ${
                      isAccepted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-900/60 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {req.distanceKm || '2.0'} km away
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400">
                            {formatRelativeTime(req.createdAt)}
                          </span>
                        </div>

                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-lg font-black text-red-600 font-mono">
                            {req.bloodGroup} needed
                          </span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            • {req.units} {req.units === 1 ? 'unit' : 'units'}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                          {req.hospitalName} • Required: {req.urgency}
                        </p>
                      </div>

                      <div>
                        {isAccepted ? (
                          <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                            ACCEPTED ✅
                          </span>
                        ) : (
                          <button
                            id={`donor-view-req-btn-${req.id}`}
                            onClick={() => setSelectedRequest(req)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-red-600/20 flex items-center gap-1 transition"
                          >
                            <span>[ VIEW REQUEST ]</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isAccepted && (
                      <div className="mt-3 pt-2 border-t border-emerald-200 dark:border-emerald-900 flex justify-end">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                        >
                          View Hospital Directions & Contact →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal (Accept / Decline / Directions) */}
      <DonorRequestDetailModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
