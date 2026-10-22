import { BloodGroup } from '../types';

/**
 * Red blood cell compatibility matrix
 * Key: Patient's blood group (recipient)
 * Value: Compatible donor blood groups
 */
export const RECIPIENT_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
};

/**
 * Check if donor can donate to recipient
 */
export function isDonorCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const allowed = RECIPIENT_COMPATIBILITY[recipientGroup];
  return allowed ? allowed.includes(donorGroup) : false;
}

/**
 * Check donor eligibility (minimum 90 days between blood donations)
 */
export function isDonorEligible(lastDonationDate: string): boolean {
  if (!lastDonationDate) return true;
  const last = new Date(lastDonationDate).getTime();
  const now = new Date().getTime();
  const diffDays = (now - last) / (1000 * 60 * 60 * 24);
  return diffDays >= 90;
}

/**
 * Format relative time (e.g. "Updated 5 min ago", "Updated just now")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 45) return 'Updated just now';
  if (diffSec < 90) return 'Updated 1 min ago';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Updated ${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Updated ${diffHours}h ago`;
  return `Updated ${Math.floor(diffHours / 24)}d ago`;
}
