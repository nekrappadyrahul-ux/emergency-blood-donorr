import { Hospital, InventoryItem, DonorProfile, BloodRequest, NotificationItem } from '../types';

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    userId: 'user-hosp-1',
    name: 'City Hospital',
    address: 'Court Hill Road, Near Gandhi Park, Puttur',
    city: 'Puttur',
    phone: '+91 8251 230455',
    latitude: 12.7661,
    longitude: 75.2033,
    verified: true,
    distanceKm: 2.1,
  },
  {
    id: 'hosp-2',
    userId: 'user-hosp-2',
    name: 'LifeCare Blood Bank',
    address: 'Main Commercial Complex, APMC Bypass, Puttur',
    city: 'Puttur',
    phone: '+91 8251 234890',
    latitude: 12.7580,
    longitude: 75.2150,
    verified: true,
    distanceKm: 4.8,
  },
  {
    id: 'hosp-3',
    userId: 'user-hosp-3',
    name: 'Pragathi Specialty Hospital',
    address: 'Vivekananda College Junction, Puttur',
    city: 'Puttur',
    phone: '+91 8251 238712',
    latitude: 12.7720,
    longitude: 75.1950,
    verified: true,
    distanceKm: 6.4,
  },
];

// Helper to calculate recent timestamp (e.g. 5 min ago)
const getPastIso = (minsAgo: number) => {
  return new Date(Date.now() - minsAgo * 60 * 1000).toISOString();
};

export const INITIAL_INVENTORIES: InventoryItem[] = [
  // City Hospital Inventory (matching Section 4 specification)
  { id: 'inv-1', hospitalId: 'hosp-1', bloodGroup: 'A+', component: 'Red Blood Cells', units: 12, updatedAt: getPastIso(18) },
  { id: 'inv-2', hospitalId: 'hosp-1', bloodGroup: 'A-', component: 'Red Blood Cells', units: 2, updatedAt: getPastIso(42) },
  { id: 'inv-3', hospitalId: 'hosp-1', bloodGroup: 'B+', component: 'Red Blood Cells', units: 8, updatedAt: getPastIso(10) },
  { id: 'inv-4', hospitalId: 'hosp-1', bloodGroup: 'B-', component: 'Red Blood Cells', units: 0, updatedAt: getPastIso(95) },
  { id: 'inv-5', hospitalId: 'hosp-1', bloodGroup: 'O+', component: 'Red Blood Cells', units: 15, updatedAt: getPastIso(5) }, // updated 5 min ago
  { id: 'inv-6', hospitalId: 'hosp-1', bloodGroup: 'O-', component: 'Red Blood Cells', units: 1, updatedAt: getPastIso(30) },
  { id: 'inv-7', hospitalId: 'hosp-1', bloodGroup: 'AB+', component: 'Red Blood Cells', units: 5, updatedAt: getPastIso(25) },
  { id: 'inv-8', hospitalId: 'hosp-1', bloodGroup: 'AB-', component: 'Red Blood Cells', units: 0, updatedAt: getPastIso(120) },

  // LifeCare Blood Bank Inventory
  { id: 'inv-9', hospitalId: 'hosp-2', bloodGroup: 'O+', component: 'Red Blood Cells', units: 1, updatedAt: getPastIso(12) }, // updated 12 min ago
  { id: 'inv-10', hospitalId: 'hosp-2', bloodGroup: 'A+', component: 'Red Blood Cells', units: 4, updatedAt: getPastIso(35) },
  { id: 'inv-11', hospitalId: 'hosp-2', bloodGroup: 'B+', component: 'Red Blood Cells', units: 3, updatedAt: getPastIso(55) },
  { id: 'inv-12', hospitalId: 'hosp-2', bloodGroup: 'O-', component: 'Red Blood Cells', units: 0, updatedAt: getPastIso(200) },
  { id: 'inv-13', hospitalId: 'hosp-2', bloodGroup: 'AB+', component: 'Red Blood Cells', units: 2, updatedAt: getPastIso(80) },

  // Pragathi Hospital Inventory
  { id: 'inv-14', hospitalId: 'hosp-3', bloodGroup: 'O+', component: 'Red Blood Cells', units: 4, updatedAt: getPastIso(15) },
  { id: 'inv-15', hospitalId: 'hosp-3', bloodGroup: 'B+', component: 'Red Blood Cells', units: 6, updatedAt: getPastIso(40) },
];

export const INITIAL_DONORS: DonorProfile[] = [
  {
    userId: 'user-donor-rahul',
    name: 'Rahul',
    phone: '+91 98451 88231',
    bloodGroup: 'O+',
    available: true,
    location: 'Puttur Town Center',
    distanceKm: 2.0,
    lastDonationDate: '2026-05-10', // > 90 days
    totalDonations: 4,
    verified: true,
  },
  {
    userId: 'user-donor-sneha',
    name: 'Sneha Rao',
    phone: '+91 98452 33412',
    bloodGroup: 'O+',
    available: true,
    location: 'Darbe, Puttur',
    distanceKm: 3.2,
    lastDonationDate: '2026-04-18',
    totalDonations: 3,
    verified: true,
  },
  {
    userId: 'user-donor-vikram',
    name: 'Vikram Hegde',
    phone: '+91 97410 99881',
    bloodGroup: 'B+',
    available: true,
    location: 'Bolwar, Puttur',
    distanceKm: 1.8,
    lastDonationDate: '2026-06-01',
    totalDonations: 6,
    verified: true,
  },
  {
    userId: 'user-donor-ananya',
    name: 'Ananya Shetty',
    phone: '+91 99001 55677',
    bloodGroup: 'O-',
    available: true,
    location: 'Parlakka, Puttur',
    distanceKm: 4.5,
    lastDonationDate: '2026-03-22',
    totalDonations: 5,
    verified: true,
  },
];

export const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'req-bc1024',
    requestIdDisplay: 'BC1024',
    patientId: 'patient-1',
    patientName: 'Priya Sharma',
    patientPhone: '+91 98450 11223',
    hospitalId: 'hosp-1',
    hospitalName: 'City Hospital',
    bloodGroup: 'O+',
    component: 'Red Blood Cells',
    units: 2,
    urgency: 'ASAP',
    status: 'donor_hospital_found',
    location: 'Puttur',
    distanceKm: 2.1,
    requiredByTime: 'Immediate (ASAP)',
    createdAt: getPastIso(22),
    updatedAt: getPastIso(4),
    matchedDonorId: 'user-donor-rahul',
    matchedDonorName: 'Rahul (Verified Donor)',
    donorAcceptedAt: getPastIso(4),
    notes: 'Emergency cesarean section requirement at City Hospital OT 2.',
  },
  {
    id: 'req-bc1025',
    requestIdDisplay: 'BC1025',
    patientId: 'patient-2',
    patientName: 'Karthik Bhat',
    patientPhone: '+91 94480 33445',
    hospitalId: 'hosp-1',
    hospitalName: 'City Hospital',
    bloodGroup: 'B+',
    component: 'Red Blood Cells',
    units: 1,
    urgency: 'Within 2 hours',
    status: 'created',
    location: 'Puttur',
    distanceKm: 2.1,
    requiredByTime: 'Within 2 hours',
    createdAt: getPastIso(8),
    updatedAt: getPastIso(8),
    notes: 'Dialysis patient planned transfusion.',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    targetRole: 'donor',
    title: 'Emergency Request Nearby',
    message: '🚨 An O+ emergency request is 2.1 km from you at City Hospital.',
    timestamp: getPastIso(22),
    read: false,
    requestId: 'req-bc1024',
    urgency: 'emergency',
  },
  {
    id: 'notif-2',
    targetRole: 'patient',
    title: 'Donor Found',
    message: '🩸 Rahul (O+ Donor) accepted your emergency request.',
    timestamp: getPastIso(4),
    read: false,
    requestId: 'req-bc1024',
    urgency: 'normal',
  },
  {
    id: 'notif-3',
    targetRole: 'hospital',
    title: 'New Emergency Blood Request',
    message: '🚨 New O+ emergency request — 2 units required by Priya Sharma.',
    timestamp: getPastIso(22),
    read: false,
    requestId: 'req-bc1024',
    urgency: 'emergency',
  },
];
