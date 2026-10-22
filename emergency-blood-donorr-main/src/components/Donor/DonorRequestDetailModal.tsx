import React, { useState } from 'react';
import { useBloodConnect } from '../../context/BloodConnectContext';
import { BloodRequest } from '../../types';
import {
  AlertCircle,
  X,
  CheckCircle2,
  Phone,
  Navigation,
  Clock,
  ShieldCheck,
  Building2,
  Lock
} from 'lucide-react';
import { formatRelativeTime } from '../../data/compatibility';

interface DonorRequestDetailModalProps {
  request: BloodRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DonorRequestDetailModal: React.FC<DonorRequestDetailModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const {
    currentDonor,
    acceptRequestAsDonor,
    declineRequestAsDonor,
    hospitals,
  } = useBloodConnect();

  const [hasJustAccepted, setHasJustAccepted] = useState<boolean>(false);

  if (!isOpen || !request) return null;

  const hospital =
    hospitals.find((h) => h.id === request.hospitalId) || hospitals[0];

  const isAcceptedByCurrentDonor =
    request.matchedDonorId === currentDonor.userId || hasJustAccepted;

  const handleAccept = () => {
    acceptRequestAsDonor(request.id);
    setHasJustAccepted(true);
  };

  const handleDecline = () => {
    declineRequestAsDonor(request.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        id="donor-request-modal"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div
          className={`p-6 ${
            isAcceptedByCurrentDonor
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          } flex items-center justify-between`}
        >
          <div className="flex items-center gap-2.5">
            {isAcceptedByCurrentDonor ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6 animate-pulse" />
            )}
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {isAcceptedByCurrentDonor
                  ? 'Request Accepted'
                  : '🚨 Urgent Blood Request'}
              </h3>
              <p className="text-xs opacity-90">
                Request #{request.requestIdDisplay} • {request.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Main Specs */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Required Group
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-3xl font-black text-red-600">
                    {request.bloodGroup}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    needed
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Units
                </span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {request.units} {request.units === 1 ? 'Unit' : 'Units'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Hospital</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {request.hospitalName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Distance</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {request.distanceKm || 2.0} km away
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-400">Required:</span>
              <span className="font-black text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-sm">
                {request.urgency}
              </span>
            </div>

            {request.notes && (
              <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                "{request.notes}"
              </p>
            )}
          </div>

          {/* Post Acceptance Screen (Section 3) */}
          {isAcceptedByCurrentDonor ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✅ You accepted this request.</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  The hospital blood bank and patient attendant have been notified. Please report to the transfusion counter.
                </p>
              </div>

              {/* Hospital Contact Info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Hospital
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {hospital.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{hospital.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`tel:${hospital.phone}`}
                    id="donor-call-hospital-btn"
                    className="py-3 px-3 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-600 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Phone className="w-4 h-4 text-red-600" />
                    <span>[ 📞 CALL ]</span>
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${hospital.latitude},${hospital.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    id="donor-get-directions-btn"
                    className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>[ 🗺️ DIRECTIONS ]</span>
                  </a>
                </div>
              </div>

              {/* Privacy protection notice */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>
                  <strong>Privacy Protected:</strong> Your personal phone number remains private and is never shown publicly.
                </span>
              </div>
            </div>
          ) : (
            /* Action Buttons: Accept / Decline */
            <div className="space-y-2.5">
              <button
                id="donor-accept-request-btn"
                onClick={handleAccept}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>[ ACCEPT REQUEST ]</span>
              </button>

              <button
                id="donor-decline-request-btn"
                onClick={handleDecline}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl text-xs transition"
              >
                [ DECLINE ]
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
