import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BloodGroup,
  BloodComponent,
  UserRole,
  Hospital,
  InventoryItem,
  DonorProfile,
  BloodRequest,
  NotificationItem,
  UrgencyLevel
} from '../types';
import {
  INITIAL_HOSPITALS,
  INITIAL_INVENTORIES,
  INITIAL_DONORS,
  INITIAL_REQUESTS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import { isDonorCompatible, isDonorEligible } from '../data/compatibility';

interface BloodConnectContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Auth states
  patientPhone: string | null;
  patientName: string;
  isPatientLoggedIn: boolean;
  loginPatient: (phone: string, name: string) => void;
  logoutPatient: () => void;

  currentDonor: DonorProfile;
  isDonorLoggedIn: boolean;
  loginDonor: (phone: string, name: string, bloodGroup: BloodGroup) => void;
  toggleDonorAvailability: (available: boolean) => void;
  logoutDonor: () => void;

  currentHospital: Hospital;
  isHospitalLoggedIn: boolean;
  loginHospital: (hospitalId: string) => void;
  logoutHospital: () => void;

  // Real-time collections
  hospitals: Hospital[];
  inventories: InventoryItem[];
  donors: DonorProfile[];
  requests: BloodRequest[];
  notifications: NotificationItem[];
  
  // Active transient notification toast
  activeToast: NotificationItem | null;
  dismissToast: () => void;

  // Actions
  updateHospitalInventory: (hospitalId: string, bloodGroup: BloodGroup, units: number, component?: BloodComponent) => void;
  createEmergencyRequest: (params: {
    bloodGroup: BloodGroup;
    units: number;
    hospitalId: string;
    hospitalName: string;
    urgency: UrgencyLevel;
    patientName: string;
    patientPhone: string;
    requiredByTime: string;
    location: string;
    component: BloodComponent;
    notes?: string;
  }) => BloodRequest;
  
  acceptRequestAsDonor: (requestId: string) => void;
  declineRequestAsDonor: (requestId: string) => void;
  confirmRequestAsHospital: (requestId: string) => void;
  fulfillRequest: (requestId: string) => void;
  cancelRequest: (requestId: string) => void;
  resetAllData: () => void;

  // Helpers
  activeTrackingRequestId: string | null;
  setActiveTrackingRequestId: (id: string | null) => void;
}

const BloodConnectContext = createContext<BloodConnectContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INVENTORIES: 'bloodconnect_inventories_v1',
  DONORS: 'bloodconnect_donors_v1',
  REQUESTS: 'bloodconnect_requests_v1',
  NOTIFICATIONS: 'bloodconnect_notifications_v1',
  ACTIVE_REQUEST_ID: 'bloodconnect_active_req_id_v1',
  ROLE: 'bloodconnect_role_v1',
  PATIENT_AUTH: 'bloodconnect_patient_auth_v1',
};

export const BloodConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'patient';
  });

  const [patientPhone, setPatientPhone] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENT_AUTH);
    return saved ? JSON.parse(saved).phone : '+91 98450 11223';
  });
  const [patientName, setPatientName] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENT_AUTH);
    return saved ? JSON.parse(saved).name : 'Priya Sharma';
  });
  const [isPatientLoggedIn, setIsPatientLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENT_AUTH);
    return saved ? true : true; // Default pre-logged for instant demo, with full login UI accessible
  });

  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [currentHospitalId, setCurrentHospitalId] = useState<string>('hosp-1');

  const [inventories, setInventories] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORIES);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORIES;
  });

  const [donors, setDonors] = useState<DonorProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DONORS);
    return saved ? JSON.parse(saved) : INITIAL_DONORS;
  });

  const [requests, setRequests] = useState<BloodRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeTrackingRequestId, setActiveTrackingRequestId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_REQUEST_ID);
    return saved || 'req-bc1024';
  });

  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORIES, JSON.stringify(inventories));
  }, [inventories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (activeTrackingRequestId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_REQUEST_ID, activeTrackingRequestId);
    }
  }, [activeTrackingRequestId]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
  };

  const loginPatient = (phone: string, name: string) => {
    setPatientPhone(phone);
    setPatientName(name);
    setIsPatientLoggedIn(true);
    localStorage.setItem(STORAGE_KEYS.PATIENT_AUTH, JSON.stringify({ phone, name }));
  };

  const logoutPatient = () => {
    setPatientPhone(null);
    setPatientName('');
    setIsPatientLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.PATIENT_AUTH);
  };

  const currentDonor = donors.find((d) => d.name.toLowerCase().includes('rahul')) || donors[0];

  const loginDonor = (phone: string, name: string, bloodGroup: BloodGroup) => {
    setDonors((prev) => {
      const idx = prev.findIndex((d) => d.phone === phone || d.name === name);
      if (idx >= 0) {
        return prev.map((d, i) => (i === idx ? { ...d, bloodGroup, available: true } : d));
      }
      return [
        ...prev,
        {
          userId: `user-donor-${Date.now()}`,
          name,
          phone,
          bloodGroup,
          available: true,
          location: 'Puttur',
          distanceKm: 2.0,
          lastDonationDate: '2026-05-01',
          totalDonations: 1,
          verified: true,
        },
      ];
    });
  };

  const toggleDonorAvailability = (available: boolean) => {
    setDonors((prev) =>
      prev.map((d) => (d.userId === currentDonor.userId ? { ...d, available } : d))
    );
  };

  const logoutDonor = () => {
    // Demo can reset donor availability to off if logged out
    toggleDonorAvailability(false);
  };

  const currentHospital = hospitals.find((h) => h.id === currentHospitalId) || hospitals[0];

  const loginHospital = (hospitalId: string) => {
    setCurrentHospitalId(hospitalId);
  };

  const logoutHospital = () => {
    // Keep City Hospital as active
  };

  const triggerNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const fullNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [fullNotif, ...prev]);
    setActiveToast(fullNotif);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  /**
   * Hospital updates inventory:
   * e.g. O+ = 5 -> 3
   * Database updates immediately.
   */
  const updateHospitalInventory = (
    hospitalId: string,
    bloodGroup: BloodGroup,
    newUnits: number,
    component: BloodComponent = 'Red Blood Cells'
  ) => {
    const nowIso = new Date().toISOString();
    setInventories((prev) => {
      const existing = prev.find(
        (item) => item.hospitalId === hospitalId && item.bloodGroup === bloodGroup && item.component === component
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, units: Math.max(0, newUnits), updatedAt: nowIso }
            : item
        );
      } else {
        const newItem: InventoryItem = {
          id: `inv-${Date.now()}`,
          hospitalId,
          bloodGroup,
          component,
          units: Math.max(0, newUnits),
          updatedAt: nowIso,
        };
        return [...prev, newItem];
      }
    });

    // Notify patient searching/subscribed
    triggerNotification({
      targetRole: 'patient',
      title: 'Inventory Updated in Real-Time',
      message: `🟢 ${currentHospital.name} updated ${bloodGroup} (${component}): ${newUnits} units available now.`,
      urgency: 'normal',
    });
  };

  /**
   * Create emergency blood request & execute matching logic
   */
  const createEmergencyRequest = (params: {
    bloodGroup: BloodGroup;
    units: number;
    hospitalId: string;
    hospitalName: string;
    urgency: UrgencyLevel;
    patientName: string;
    patientPhone: string;
    requiredByTime: string;
    location: string;
    component: BloodComponent;
    notes?: string;
  }): BloodRequest => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `req-bc${randomNum}`;
    const displayId = `BC${randomNum}`;
    const nowIso = new Date().toISOString();

    const newRequest: BloodRequest = {
      id: newId,
      requestIdDisplay: displayId,
      patientId: 'patient-current',
      patientName: params.patientName,
      patientPhone: params.patientPhone,
      hospitalId: params.hospitalId,
      hospitalName: params.hospitalName,
      bloodGroup: params.bloodGroup,
      component: params.component,
      units: params.units,
      urgency: params.urgency,
      status: 'created',
      location: params.location,
      distanceKm: 2.1,
      requiredByTime: params.requiredByTime,
      createdAt: nowIso,
      updatedAt: nowIso,
      notes: params.notes,
    };

    setRequests((prev) => [newRequest, ...prev]);
    setActiveTrackingRequestId(newId);

    // MATCHING LOGIC (Section 6)
    // 1. Blood group compatible
    // 2. Donor available
    // 3. Within 10 km
    // 4. Eligible (last donation > 90 days)
    const matchedDonors = donors.filter((donor) => {
      const compatible = isDonorCompatible(donor.bloodGroup, params.bloodGroup);
      const isEligible = isDonorEligible(donor.lastDonationDate);
      const inRadius = donor.distanceKm <= 10;
      return donor.available && compatible && isEligible && inRadius;
    });

    // Push notification to Hospital staff
    triggerNotification({
      targetRole: 'hospital',
      requestId: newId,
      title: 'New Emergency Blood Request',
      message: `🚨 New ${params.bloodGroup} emergency request — ${params.units} units required by ${params.patientName}.`,
      urgency: 'emergency',
    });

    // Push notification to eligible nearby donors
    if (matchedDonors.length > 0) {
      matchedDonors.forEach((donor) => {
        triggerNotification({
          targetRole: 'donor',
          targetUserId: donor.userId,
          requestId: newId,
          title: 'Emergency Blood Request Nearby',
          message: `🚨 An ${params.bloodGroup} emergency request is ${donor.distanceKm} km from you at ${params.hospitalName}.`,
          urgency: 'emergency',
        });
      });
    }

    return newRequest;
  };

  /**
   * Donor accepts urgent request
   */
  const acceptRequestAsDonor = (requestId: string) => {
    const nowIso = new Date().toISOString();
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'donor_hospital_found',
            matchedDonorId: currentDonor.userId,
            matchedDonorName: `${currentDonor.name} (Verified Donor)`,
            donorAcceptedAt: nowIso,
            updatedAt: nowIso,
          };
        }
        return req;
      })
    );

    const targetReq = requests.find((r) => r.id === requestId);
    const reqGroup = targetReq?.bloodGroup || 'Blood';

    // Notify patient
    triggerNotification({
      targetRole: 'patient',
      requestId,
      title: 'Donor Found & Accepted',
      message: `🩸 Your ${reqGroup} request has been accepted by verified donor ${currentDonor.name}.`,
      urgency: 'normal',
    });

    // Notify hospital
    triggerNotification({
      targetRole: 'hospital',
      requestId,
      title: 'Donor Confirmed for Request',
      message: `✅ Donor ${currentDonor.name} (${currentDonor.bloodGroup}) accepted request #${targetReq?.requestIdDisplay || requestId}.`,
      urgency: 'normal',
    });
  };

  const declineRequestAsDonor = (requestId: string) => {
    // In MVP, declining simply removes or dismisses from current donor's immediate view
  };

  /**
   * Hospital confirms request / supplies blood
   */
  const confirmRequestAsHospital = (requestId: string) => {
    const nowIso = new Date().toISOString();
    let targetReq: BloodRequest | undefined;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          targetReq = req;
          return {
            ...req,
            status: 'confirmation_pending',
            hospitalConfirmedAt: nowIso,
            updatedAt: nowIso,
          };
        }
        return req;
      })
    );

    // Deduct units from hospital inventory
    if (targetReq) {
      setInventories((prev) =>
        prev.map((inv) => {
          if (
            inv.hospitalId === currentHospital.id &&
            inv.bloodGroup === targetReq?.bloodGroup &&
            inv.component === targetReq?.component
          ) {
            return {
              ...inv,
              units: Math.max(0, inv.units - (targetReq?.units || 1)),
              updatedAt: nowIso,
            };
          }
          return inv;
        })
      );
    }

    // Notify patient
    triggerNotification({
      targetRole: 'patient',
      requestId,
      title: 'Request Confirmed by Hospital',
      message: `🩸 Your ${targetReq?.bloodGroup || 'O+'} request has been accepted by ${currentHospital.name}. Verification in progress.`,
      urgency: 'normal',
    });
  };

  /**
   * Mark as fulfilled
   */
  const fulfillRequest = (requestId: string) => {
    const nowIso = new Date().toISOString();
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: 'fulfilled', updatedAt: nowIso }
          : req
      )
    );

    const targetReq = requests.find((r) => r.id === requestId);

    triggerNotification({
      targetRole: 'patient',
      requestId,
      title: 'Blood Transfusion Fulfilled',
      message: `✅ Blood request #${targetReq?.requestIdDisplay || requestId} is successfully fulfilled!`,
      urgency: 'normal',
    });
  };

  const cancelRequest = (requestId: string) => {
    const nowIso = new Date().toISOString();
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: 'cancelled', updatedAt: nowIso }
          : req
      )
    );
  };

  const resetAllData = () => {
    setInventories(INITIAL_INVENTORIES);
    setDonors(INITIAL_DONORS);
    setRequests(INITIAL_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTrackingRequestId('req-bc1024');
    localStorage.removeItem(STORAGE_KEYS.INVENTORIES);
    localStorage.removeItem(STORAGE_KEYS.DONORS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_REQUEST_ID);
  };

  return (
    <BloodConnectContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        patientPhone,
        patientName,
        isPatientLoggedIn,
        loginPatient,
        logoutPatient,
        currentDonor,
        isDonorLoggedIn: true,
        loginDonor,
        toggleDonorAvailability,
        logoutDonor,
        currentHospital,
        isHospitalLoggedIn: true,
        loginHospital,
        logoutHospital,
        hospitals,
        inventories,
        donors,
        requests,
        notifications,
        activeToast,
        dismissToast,
        updateHospitalInventory,
        createEmergencyRequest,
        acceptRequestAsDonor,
        declineRequestAsDonor,
        confirmRequestAsHospital,
        fulfillRequest,
        cancelRequest,
        resetAllData,
        activeTrackingRequestId,
        setActiveTrackingRequestId,
      }}
    >
      {children}
    </BloodConnectContext.Provider>
  );
};

export function useBloodConnect(): BloodConnectContextType {
  const context = useContext(BloodConnectContext);
  if (!context) {
    throw new Error('useBloodConnect must be used within a BloodConnectProvider');
  }
  return context;
}
