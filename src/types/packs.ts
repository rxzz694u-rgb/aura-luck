export type PackStatus = 'draft' | 'published' | 'full' | 'locked' | 'completed' | 'unpublished';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export interface Pack {
  id: string;
  name: string;
  description: string;
  productName: string;
  productImage: string;
  prizeValue: string;
  totalSpots: number; // 10–15, admin-chosen
  entryPrice: number;
  currency: string; // e.g. 'AED'
  status: PackStatus;
  accent: string; // tailwind gradient classes for the card art
  startAt: string; // ISO
  endAt: string; // ISO countdown target
  blockedRegions: string[]; // jurisdiction control
  createdAt: string;
  completedAt?: string;
}

export interface PackEntry {
  id: string;
  packId: string;
  userId: string;
  username: string;
  slotNumber: number; // 1-based, unique per pack
  joinedAt: string;
  paymentStatus: PaymentStatus;
}

export interface PackResult {
  id: string;
  packId: string;
  winningEntryId: string;
  winningSlot: number;
  winnerUsername: string;
  drawnAt: string;
  drawMethod: string;
  auditHash: string;
}

export interface JoinResult {
  ok: boolean;
  error?: string;
  entry?: PackEntry;
  packFilled?: boolean;
}
