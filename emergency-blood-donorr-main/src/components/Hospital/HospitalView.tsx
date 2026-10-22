import React, { useState } from 'react';
import { useBloodConnect } from '../../context/BloodConnectContext';
import { BloodGroup } from '../../types';
import {
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Phone,
  CheckCheck,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { formatRelativeTime } from '../../data/compatibility';
import { InventoryUpdateModal } from './InventoryUpdateModal';

export const HospitalView: React.FC = () => {
  const {
    currentHospital,
    hospitals,
    loginHospital,
    inventories,
    requests,
    confirmRequestAsHospital,
    fulfillRequest,
  } = useBloodConnect();

  // State for inventory update modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [selectedGroupForUpdate, setSelectedGroupForUpdate] = useState<BloodGroup>('O+');

  // Blood groups order matching mockup 4:
  // A+, A-, B+, B-, O+, O-, AB+, AB-
  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Current hospital's inventory
  const hospitalInventoryMap: Record<BloodGroup, { units: number; updatedAt: string }> = {} as any;

  bloodGroups.forEach((g) => {
    const item = inventories.find(
      (i) => i.hospitalId === currentHospital.id && i.bloodGroup === g
    );
    hospitalInventoryMap[g] = {
      units: item ? item.units : 0,
      updatedAt: item ? item.updatedAt : new Date().toISOString(),
    };
  });

  // Active Emergency Requests for this hospital or nearby
  const activeRequests = requests.filter(
    (r) =>
      (r.hospitalId === currentHospital.id || r.location === currentHospital.city) &&
      r.status !== 'cancelled'
  );

  const openUpdateForGroup = (g: BloodGroup) => {
    setSelectedGroupForUpdate(g);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Hospital Switcher & Status Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Verified Blood Center
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded-sm font-bold">
                Online
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tight mt-0.5">
              {currentHospital.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentHospital.address} • Hotline: {currentHospital.phone}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Change Hospital Dropdown (if multiple verified institutions in region) */}
        {hospitals.length > 1 && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Switch Institution:</span>
            <select
              value={currentHospital.id}
              onChange={(e) => loginHospital(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 font-semibold outline-none"
            >
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Section 4 Mockup: Blood Inventory Matrix */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Blood Inventory (Tap any group to quick-update)
            </h3>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Real-time timestamped
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {bloodGroups.map((group) => {
              const data = hospitalInventoryMap[group];
              const units = data.units;
              const isPlentiful = units >= 5;
              const isAvailable = units > 0;

              return (
                <button
                  key={group}
                  id={`hospital-inv-tile-${group.replace('+', 'pos').replace('-', 'neg')}`}
                  type="button"
                  onClick={() => openUpdateForGroup(group)}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-slate-100 transition text-left flex flex-col justify-between h-24 group relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                      {group}
                    </span>
                    <span className="text-sm">
                      {isPlentiful ? '🟢' : isAvailable ? '🟡' : '🔴'}
                    </span>
                  </div>

                  <div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      {units} <span className="text-xs font-normal text-slate-500">units</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {formatRelativeTime(data.updatedAt)}
                    </div>
                  </div>

                  {/* Tap hint on hover */}
                  <span className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-purple-600 font-bold transition">
                    Tap →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section 4: [ UPDATE INVENTORY ] Button */}
          <div className="mt-4">
            <button
              id="hospital-open-update-inventory-btn"
              onClick={() => setIsUpdateModalOpen(true)}
              className="w-full py-3 px-4 bg-purple-700 hover:bg-purple-800 active:scale-[0.99] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md shadow-purple-700/20 flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>[ UPDATE INVENTORY ]</span>
            </button>
          </div>
        </div>

        {/* Mockup Divider */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span>Emergency Requests</span>
                <span className="text-xs bg-red-600 text-white font-mono font-bold px-2 py-0.5 rounded-full">
                  {activeRequests.length} Active
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage incoming transfusion requests from doctors & attendants
              </p>
            </div>
          </div>

          {activeRequests.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No active emergency requests pending.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRequests.map((req) => {
                const isFulfilled = req.status === 'fulfilled';
                const isConfirmed = req.status === 'confirmation_pending';
                const isDonorMatched = req.status === 'donor_hospital_found';

                return (
                  <div
                    key={req.id}
                    id={`hospital-request-item-${req.id}`}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                            #{req.requestIdDisplay}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatRelativeTime(req.createdAt)}
                          </span>
                          <span className="text-[10px] uppercase font-black bg-red-600 text-white px-1.5 py-0.2 rounded-sm">
                            {req.urgency}
                          </span>
                        </div>

                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-xl font-black text-red-600 font-mono">
                            {req.bloodGroup}
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {req.units} {req.units === 1 ? 'Unit' : 'Units'} ({req.component})
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          Patient: <strong>{req.patientName}</strong> ({req.patientPhone})
                        </p>
                        {req.notes && (
                          <p className="text-[11px] text-slate-400 italic mt-0.5">
                            "{req.notes}"
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider block ${
                            isFulfilled
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : isConfirmed
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              : isDonorMatched
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Matched Donor status notice */}
                    {req.matchedDonorName && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs flex items-center justify-between">
                        <span className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 font-bold">
                          <UserCheck className="w-3.5 h-3.5" />
                          Donor Responded: {req.matchedDonorName}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-mono">
                          Verified O+ Donor
                        </span>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                      <a
                        href={`tel:${req.patientPhone}`}
                        className="text-xs text-slate-600 dark:text-slate-300 font-bold hover:text-red-600 flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Patient
                      </a>

                      <div className="flex items-center gap-2">
                        {!isFulfilled && !isConfirmed && (
                          <button
                            id={`hospital-confirm-btn-${req.id}`}
                            onClick={() => confirmRequestAsHospital(req.id)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-2xs transition"
                          >
                            Confirm Reserve
                          </button>
                        )}

                        {!isFulfilled && (
                          <button
                            id={`hospital-fulfill-btn-${req.id}`}
                            onClick={() => fulfillRequest(req.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Dispense & Fulfill</span>
                          </button>
                        )}

                        {isFulfilled && (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Fulfilled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Tap Inventory Update Modal */}
      <InventoryUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        initialBloodGroup={selectedGroupForUpdate}
      />
    </div>
  );
};
