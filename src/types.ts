export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type BloodComponent = 'Red Blood Cells' | 'Whole Blood' | 'Platelets' | 'Plasma';

export type UserRole = 'patient' | 'donor' | 'hospital';

export type RequestStatus = 
  | 'created'                // Request Created
  | 'donor_hospital_found'   // Donor/Hospital Found
  | 'confirmation_pending'   // Confirmation Pending
  | 'fulfilled'              // Fulfilled
  | 'cancelled';             // Cancelled

export type UrgencyLevel = 'ASAP' | 'Within 2 hours' | 'Today';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  avatarUrl?: string;
}

export interface DonorProfile {
  userId: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  available: boolean;
  location: string;
  distanceKm: number;
  lastDonationDate: string; // YYYY-MM-DD
  totalDonations: number;
  verified: boolean;
}

export interface InventoryItem {
  id: string;
  hospitalId: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  units: number;
  updatedAt: string; // ISO string
}

export interface Hospital {
  id: string;
  userId: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  distanceKm?: number; // relative to searched location
}

export interface BloodRequest {
  id: string;
  requestIdDisplay: string; // e.g., "BC1024"
  patientId: string;
  patientName: string;
  patientPhone: string;
  hospitalId: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  units: number;
  urgency: UrgencyLevel;
  status: RequestStatus;
  location: string;
  distanceKm: number;
  requiredByTime: string;
  createdAt: string; // ISO string
  updatedAt: string;
  matchedDonorId?: string;
  matchedDonorName?: string;
  donorAcceptedAt?: string;
  hospitalConfirmedAt?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole;
  targetUserId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  requestId?: string;
  urgency?: 'normal' | 'emergency';
}
