import React, { useState } from 'react';
import { useBloodConnect } from '../../context/BloodConnectContext';
import { BloodGroup, BloodComponent } from '../../types';
import {
  Search,
  MapPin,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Droplet,
  ChevronRight,
  ArrowRight,
  LogOut,
  Hospital as HospitalIcon,
  Activity
} from 'lucide-react';
import { formatRelativeTime } from '../../data/compatibility';
import { PatientLogin } from './PatientLogin';
import { EmergencyRequestModal } from './EmergencyRequestModal';
import { RequestTracker } from './RequestTracker';

export const PatientView: React.FC = () => {
  const {
    isPatientLoggedIn,
    patientName,
    patientPhone,
    logoutPatient,
    hospitals,
    inventories,
    createEmergencyRequest,
    activeTrackingRequestId,
  } = useBloodConnect();

  // Search parameters (defaults to Section 2 Mockup 02)
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('O+');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('Red Blood Cells');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [location, setLocation] = useState<string>('Puttur');
  const [hasSearched, setHasSearched] = useState<boolean>(true); // Default true to show Screen 03 right away as in mockup

  // Sub-navigation
  const [activeTab, setActiveTab] = useState<'search' | 'tracking'>('search');

  // Modal for Emergency Request
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [targetHospitalForEmergency, setTargetHospitalForEmergency] = useState<string | undefined>(undefined);

  if (!isPatientLoggedIn) {
    return <PatientLogin onSuccess={() => setActiveTab('search')} />;
  }

  // Get matching inventory items based on searched blood group and component
  const availableHospitals = hospitals
    .map((hospital) => {
      const inv = inventories.find(
        (i) =>
          i.hospitalId === hospital.id &&
          i.bloodGroup === selectedBloodGroup &&
          i.component === selectedComponent
      );
      const units = inv ? inv.units : 0;
      const updatedAt = inv ? inv.updatedAt : new Date().toISOString();
      return {
        hospital,
        units,
        updatedAt,
      };
    })
    .sort((a, b) => (a.hospital.distanceKm || 0) - (b.hospital.distanceKm || 0));

  const handleQuickRequestFromHospital = (hospId: string, hospName: string) => {
    // Directly creates the blood request with the hospital and navigates to tracker
    createEmergencyRequest({
      bloodGroup: selectedBloodGroup,
      units: unitsNeeded,
      component: selectedComponent,
      hospitalId: hospId,
      hospitalName: hospName,
      urgency: 'ASAP',
      patientName: patientName || 'Priya Sharma',
      patientPhone: patientPhone || '+91 98450 11223',
      requiredByTime: 'Immediate (ASAP)',
      location,
      notes: `Requested directly from available inventory search at ${hospName}.`,
    });
    setActiveTab('tracking');
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Top Patient Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold flex items-center justify-center text-sm">
            {patientName ? patientName[0] : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {patientName || 'Priya Sharma'}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-sm">
                Verified
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {patientPhone || '+91 98450 11223'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
            <button
              id="patient-tab-search"
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'search'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Find Blood
            </button>
            <button
              id="patient-tab-tracking"
              onClick={() => setActiveTab('tracking')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'tracking'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Track</span>
              {activeTrackingRequestId && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>

          <button
            onClick={logoutPatient}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === 'tracking' ? (
        <RequestTracker onNewSearch={() => setActiveTab('search')} />
      ) : (
        <div className="space-y-6">
          {/* Screen 02: Home Search Card */}
          <div
            id="patient-search-card"
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Find Blood
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time live inventory from verified hospital blood banks
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center">
                <Droplet className="w-4 h-4 fill-current" />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {/* Blood Group Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Blood Group
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map((group) => (
                    <button
                      key={group}
                      id={`blood-group-btn-${group.replace('+', 'pos').replace('-', 'neg')}`}
                      type="button"
                      onClick={() => setSelectedBloodGroup(group)}
                      className={`py-2.5 rounded-xl font-black text-sm transition-all flex items-center justify-center ${
                        selectedBloodGroup === group
                          ? 'bg-red-600 text-white shadow-md shadow-red-500/25 ring-2 ring-red-600 ring-offset-2 dark:ring-offset-slate-900'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              {/* Component & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Component
                  </label>
                  <select
                    id="patient-component-select"
                    value={selectedComponent}
                    onChange={(e) => setSelectedComponent(e.target.value as BloodComponent)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Red Blood Cells">Red Blood Cells</option>
                    <option value="Whole Blood">Whole Blood</option>
                    <option value="Platelets">Platelets</option>
                    <option value="Plasma">Plasma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Units Needed
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setUnitsNeeded(Math.max(1, unitsNeeded - 1))}
                      className="w-10 h-10 rounded-l-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 flex items-center justify-center border border-slate-300 dark:border-slate-700"
                    >
                      -
                    </button>
                    <div className="flex-1 h-10 bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-900 dark:text-white border-y border-slate-300 dark:border-slate-700 text-sm">
                      {unitsNeeded} {unitsNeeded === 1 ? 'Unit' : 'Units'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setUnitsNeeded(Math.min(10, unitsNeeded + 1))}
                      className="w-10 h-10 rounded-r-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 flex items-center justify-center border border-slate-300 dark:border-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Location
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-red-600">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input
                    id="patient-location-input"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Puttur, Karnataka"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Find Blood Action Button */}
              <button
                id="patient-find-blood-btn"
                type="button"
                onClick={() => setHasSearched(true)}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-black rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition"
              >
                <Search className="w-4 h-4" />
                <span>FIND BLOOD NEARBY</span>
              </button>
            </div>

            {/* Mockup Divider & Emergency Callout */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-red-500/30">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-red-700 dark:text-red-300 uppercase tracking-wide flex items-center gap-1">
                      🚨 Critical Emergency?
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Cannot find stock? Alert all compatible donors within 10 km immediately.
                    </p>
                  </div>
                </div>

                <button
                  id="patient-emergency-request-btn"
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-md shadow-red-500/30 shrink-0 transition"
                >
                  REQUEST BLOOD NOW
                </button>
              </div>
            </div>
          </div>

          {/* Screen 03: Available Blood Results */}
          {hasSearched && (
            <div id="available-blood-results" className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-red-600 font-mono text-lg">{selectedBloodGroup}</span>
                  <span>Blood Available</span>
                </h3>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  Live Sync
                </span>
              </div>

              {availableHospitals.map(({ hospital, units, updatedAt }) => {
                const isAvailable = units > 0;
                const isPlentiful = units >= 5;

                return (
                  <div
                    key={hospital.id}
                    id={`hospital-card-${hospital.id}`}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {isPlentiful ? (
                          <span className="text-base" title="Plentiful stock">🟢</span>
                        ) : isAvailable ? (
                          <span className="text-base" title="Limited stock">🟡</span>
                        ) : (
                          <span className="text-base" title="Out of stock">🔴</span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {hospital.name}
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-sm border border-emerald-200 dark:border-emerald-900">
                            Verified
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {units} {units === 1 ? 'unit' : 'units'} available
                          </span>
                          <span>•</span>
                          <span>{hospital.distanceKm} km away</span>
                          <span>•</span>
                          <span className="text-slate-400">
                            {formatRelativeTime(updatedAt)}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1">
                          {hospital.address}
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex items-center gap-2">
                      <button
                        id={`request-hospital-btn-${hospital.id}`}
                        onClick={() =>
                          handleQuickRequestFromHospital(hospital.id, hospital.name)
                        }
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isAvailable
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs shadow-red-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        <span>REQUEST</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Emergency Request Modal (Screen 04) */}
      <EmergencyRequestModal
        isOpen={isEmergencyModalOpen}
        onClose={() => {
          setIsEmergencyModalOpen(false);
          setActiveTab('tracking');
        }}
        initialBloodGroup={selectedBloodGroup}
        initialUnits={unitsNeeded}
        initialComponent={selectedComponent}
        initialHospitalId={targetHospitalForEmergency}
      />
    </div>
  );
};
