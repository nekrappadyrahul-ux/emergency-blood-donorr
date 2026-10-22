import React from 'react';
import { useBloodConnect } from '../../context/BloodConnectContext';
import { RequestStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  Building2,
  Phone,
  Navigation,
  AlertCircle,
  Share2,
  UserCheck,
  CheckCheck
} from 'lucide-react';
import { formatRelativeTime } from '../../data/compatibility';

interface RequestTrackerProps {
  onNewSearch: () => void;
}

export const RequestTracker: React.FC<RequestTrackerProps> = ({ onNewSearch }) => {
  const {
    requests,
    activeTrackingRequestId,
    setActiveTrackingRequestId,
    hospitals,
    donors
  } = useBloodConnect();

  const activeRequest =
    requests.find((r) => r.id === activeTrackingRequestId) || requests[0];

  if (!activeRequest) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">
          No Active Blood Requests
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Start a search or create an emergency request to track live updates.
        </p>
        <button
          onClick={onNewSearch}
          className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs"
        >
          Find Blood Now
        </button>
      </div>
    );
  }

  const hospital =
    hospitals.find((h) => h.id === activeRequest.hospitalId) || hospitals[0];

  const matchedDonor = donors.find((d) => d.userId === activeRequest.matchedDonorId);

  // 4 Stepper stages exactly as defined in the mockup:
  // 1. Request Created
  // 2. Donor/Hospital Found
  // 3. Confirmation Pending
  // 4. Fulfilled
  const steps: { key: RequestStatus; label: string; desc: string }[] = [
    {
      key: 'created',
      label: 'Request Created',
      desc: 'Broadcasted to nearby verified donors & hospitals',
    },
    {
      key: 'donor_hospital_found',
      label: 'Donor/Hospital Found',
      desc: activeRequest.matchedDonorName
        ? `Matched with ${activeRequest.matchedDonorName}`
        : 'Nearby response received',
    },
    {
      key: 'confirmation_pending',
      label: 'Confirmation Pending',
      desc: 'Hospital verifying blood reserve & scheduling dispensation',
    },
    {
      key: 'fulfilled',
      label: 'Fulfilled',
      desc: 'Blood units dispatched and ready for patient transfusion',
    },
  ];

  const getStepStatus = (stepKey: RequestStatus) => {
    const order: RequestStatus[] = [
      'created',
      'donor_hospital_found',
      'confirmation_pending',
      'fulfilled',
    ];

    const currentIndex = order.indexOf(activeRequest.status);
    const stepIndex = order.indexOf(stepKey);

    if (activeRequest.status === 'cancelled') {
      return 'cancelled';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Switcher if user has multiple requests */}
      {requests.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 shrink-0">
            Your Requests:
          </span>
          {requests.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveTrackingRequestId(r.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 ${
                r.id === activeRequest.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              #{r.requestIdDisplay} ({r.bloodGroup})
            </button>
          ))}
        </div>
      )}

      {/* Main Request Tracking Card */}
      <div
        id="patient-request-tracking-card"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
      >
        {/* Card Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                Request #{activeRequest.requestIdDisplay}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatRelativeTime(activeRequest.createdAt)}
              </span>
            </div>

            <span
              className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                activeRequest.status === 'fulfilled'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : activeRequest.status === 'donor_hospital_found'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : activeRequest.status === 'confirmation_pending'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              }`}
            >
              {activeRequest.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-red-600">
                  {activeRequest.bloodGroup}
                </span>
                <span className="text-slate-400 text-xl">•</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeRequest.units} {activeRequest.units === 1 ? 'Unit' : 'Units'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeRequest.component} • Urgency: {activeRequest.urgency}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Hospital
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {activeRequest.hospitalName}
              </span>
            </div>
          </div>
        </div>

        {/* Mockup 05 Stepper */}
        <div className="p-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Live Fulfillment Pipeline
          </h4>

          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {steps.map((step, idx) => {
              const state = getStepStatus(step.key);

              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {/* Indicator Icon */}
                  <div className="relative z-10 shrink-0">
                    {state === 'completed' && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <CheckCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {state === 'current' && (
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs ring-4 ring-amber-100 dark:ring-amber-950/60 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {state === 'upcoming' && (
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Label & Details */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-bold ${
                          state === 'completed'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : state === 'current'
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {state === 'completed' && '🟢 '}
                        {state === 'current' && '🟡 '}
                        {state === 'upcoming' && '⚪ '}
                        {step.label}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matched Donor Details Badge if found */}
          {activeRequest.matchedDonorName && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {activeRequest.matchedDonorName}
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-sm">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    En route to {activeRequest.hospitalName} • ETA ~15 mins
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hospital Coordination Card */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Designated Blood Center
                </span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                  {hospital.name}
                </h5>
                <p className="text-xs text-slate-500 mt-0.5">{hospital.address}</p>
              </div>
              <span className="text-xs font-mono text-slate-400 shrink-0">
                {hospital.distanceKm} km away
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href={`tel:${hospital.phone}`}
                id="call-hospital-btn"
                className="flex-1 py-2.5 px-3 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-600 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>Call Center</span>
              </a>
              <a
                href={`https://maps.google.com/?q=${hospital.latitude},${hospital.longitude}`}
                target="_blank"
                rel="noreferrer"
                id="directions-hospital-btn"
                className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs shadow-red-500/20"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onNewSearch}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600"
          >
            ← Search Another Blood Group
          </button>
          <span className="text-[11px] text-slate-400">
            Auto-refreshed via WebSocket
          </span>
        </div>
      </div>
    </div>
  );
};
