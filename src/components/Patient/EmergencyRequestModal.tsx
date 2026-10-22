import React, { useState } from 'react';
import { useBloodConnect } from '../../context/BloodConnectContext';
import { BloodGroup, BloodComponent, UrgencyLevel } from '../../types';
import { AlertCircle, X, Send, ShieldAlert, Hospital as HospitalIcon } from 'lucide-react';

interface EmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBloodGroup?: BloodGroup;
  initialUnits?: number;
  initialHospitalId?: string;
  initialComponent?: BloodComponent;
}

export const EmergencyRequestModal: React.FC<EmergencyRequestModalProps> = ({
  isOpen,
  onClose,
  initialBloodGroup = 'O+',
  initialUnits = 2,
  initialHospitalId = 'hosp-1',
  initialComponent = 'Red Blood Cells',
}) => {
  const { hospitals, createEmergencyRequest, patientName, patientPhone } = useBloodConnect();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(initialBloodGroup);
  const [units, setUnits] = useState<number>(initialUnits);
  const [component, setComponent] = useState<BloodComponent>(initialComponent);
  const [hospitalId, setHospitalId] = useState<string>(initialHospitalId);
  const [requiredBy, setRequiredBy] = useState<UrgencyLevel>('ASAP');
  const [name, setName] = useState<string>(patientName || 'Priya Sharma');
  const [phone, setPhone] = useState<string>(patientPhone || '+91 98450 11223');
  const [notes, setNotes] = useState<string>('Urgent requirement for OT / Critical Care');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectedHospital = hospitals.find((h) => h.id === hospitalId) || hospitals[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      createEmergencyRequest({
        bloodGroup,
        units,
        component,
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        urgency: requiredBy,
        patientName: name,
        patientPhone: phone,
        requiredByTime: requiredBy === 'ASAP' ? 'Immediate (ASAP)' : requiredBy,
        location: selectedHospital.city || 'Puttur',
        notes,
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const components: BloodComponent[] = ['Red Blood Cells', 'Whole Blood', 'Platelets', 'Plasma'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        id="emergency-request-modal"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-red-600/30 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Urgent Header */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                Emergency Blood Request
              </h3>
              <p className="text-xs text-red-100">
                Alerts nearby verified donors & hospitals within 10 km
              </p>
            </div>
          </div>
          <button
            id="close-emergency-modal-btn"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Blood Group & Units */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Blood Group *
              </label>
              <select
                id="emergency-blood-group-select"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-red-500"
              >
                {bloodGroups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Units Needed *
              </label>
              <div className="flex items-center">
                <input
                  id="emergency-units-input"
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Component & Urgency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Component
              </label>
              <select
                id="emergency-component-select"
                value={component}
                onChange={(e) => setComponent(e.target.value as BloodComponent)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-red-500"
              >
                {components.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Required By *
              </label>
              <select
                id="emergency-urgency-select"
                value={requiredBy}
                onChange={(e) => setRequiredBy(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-2.5 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="ASAP">🚨 ASAP (Immediate)</option>
                <option value="Within 2 hours">Within 2 hours</option>
                <option value="Today">Today</option>
              </select>
            </div>
          </div>

          {/* Hospital Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Hospital / Delivery Location *
            </label>
            <div className="relative">
              <select
                id="emergency-hospital-select"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-red-500"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.address}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Patient/Attendant Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Patient / Attendant Name *
            </label>
            <input
              id="emergency-patient-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Contact Number *
            </label>
            <input
              id="emergency-patient-phone-input"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98450 11223"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-medium outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Medical Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Clinical Context / Room / OT Details
            </label>
            <input
              id="emergency-notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. ICU Bed 4, Dr. Nayak attending"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs outline-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              id="submit-emergency-request-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black rounded-2xl text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition"
            >
              {isSubmitting ? (
                <span>Broadcasting to network...</span>
              ) : (
                <>
                  <span className="text-base">🚨</span>
                  <span>SEND EMERGENCY REQUEST NOW</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Instantly notifies verified donors and duty blood bank officers within 10 km.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
