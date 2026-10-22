import React, { useState } from 'react';
import { useBloodConnect } from '../../context/BloodConnectContext';
import { BloodGroup, BloodComponent } from '../../types';
import { X, Check, Droplet, Plus, Minus } from 'lucide-react';

interface InventoryUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBloodGroup?: BloodGroup;
  initialUnits?: number;
}

export const InventoryUpdateModal: React.FC<InventoryUpdateModalProps> = ({
  isOpen,
  onClose,
  initialBloodGroup = 'O+',
  initialUnits = 15,
}) => {
  const { currentHospital, updateHospitalInventory, inventories } = useBloodConnect();

  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>(initialBloodGroup);
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('Red Blood Cells');
  
  // Find current units in inventory for this group
  const existingItem = inventories.find(
    (i) =>
      i.hospitalId === currentHospital.id &&
      i.bloodGroup === selectedGroup &&
      i.component === selectedComponent
  );

  const [units, setUnits] = useState<number>(existingItem ? existingItem.units : initialUnits);

  // Sync when selected group changes
  const handleGroupSelect = (group: BloodGroup) => {
    setSelectedGroup(group);
    const item = inventories.find(
      (i) =>
        i.hospitalId === currentHospital.id &&
        i.bloodGroup === group &&
        i.component === selectedComponent
    );
    setUnits(item ? item.units : 0);
  };

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalInventory(currentHospital.id, selectedGroup, units, selectedComponent);
    onClose();
  };

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        id="inventory-update-modal"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="bg-purple-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 fill-current" />
            <div>
              <h3 className="text-base font-bold">Update Blood Inventory</h3>
              <p className="text-xs text-purple-200">{currentHospital.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Step 1: Select Blood Group (O+ -> 15 -> Update -> Save) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. Tap Blood Group
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((g) => {
                const item = inventories.find(
                  (i) =>
                    i.hospitalId === currentHospital.id &&
                    i.bloodGroup === g &&
                    i.component === selectedComponent
                );
                const currentCount = item ? item.units : 0;

                return (
                  <button
                    key={g}
                    id={`inv-modal-group-btn-${g.replace('+', 'pos').replace('-', 'neg')}`}
                    type="button"
                    onClick={() => handleGroupSelect(g)}
                    className={`py-2 px-1 rounded-xl text-center font-bold text-xs transition border flex flex-col items-center gap-0.5 ${
                      selectedGroup === g
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-slate-900'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono text-sm">{g}</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        selectedGroup === g ? 'text-purple-200' : 'text-slate-400'
                      }`}
                    >
                      {currentCount} units
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Set Units Count */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              2. Available Units for {selectedGroup}
            </label>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setUnits(Math.max(0, units - 1))}
                className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center font-bold text-xl transition"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="w-28 h-16 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border-2 border-purple-600/40 flex items-center justify-center">
                <input
                  id="inv-modal-units-input"
                  type="number"
                  min={0}
                  max={100}
                  value={units}
                  onChange={(e) => setUnits(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-center text-3xl font-black font-mono bg-transparent text-slate-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setUnits(units + 1)}
                className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center font-bold text-xl transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex justify-center gap-2 mt-3">
              {[0, 1, 5, 10, 15, 20].map((quickVal) => (
                <button
                  key={quickVal}
                  type="button"
                  onClick={() => setUnits(quickVal)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    units === quickVal
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {quickVal}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Every inventory update is timestamped and updates public search results in real-time.
          </p>

          <div className="pt-2">
            <button
              id="save-inventory-btn"
              type="submit"
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>[ SAVE INVENTORY ]</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
