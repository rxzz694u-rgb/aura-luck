export type TabType = 'home' | 'draws' | 'packs' | 'wallet' | 'profile' | 'entries' | 'winners' | 'admin';

export type DrawCategory = 'all' | 'cash' | 'tech' | 'lifestyle';

export interface Giveaway {
  id: string;
  title: string;
  subtitle?: string;
  prizeAmount: string;
  category: 'cash' | 'tech' | 'giftcard' | 'lifestyle';
  image: string;
  accentGradient: string;
  isFeatured?: boolean;
  isLive?: boolean;
  endsAt: string; // ISO string
  totalEntrants: number;
  maxEntriesPerUser: number;
  drawDateFormatted: string;
  description: string;
  seedHash: string;
  tier: 'Grand' | 'Daily' | 'Flash' | 'Weekly';
}

export interface Entry {
  id: string;
  ticketId: string;
  giveawayId: string;
  giveawayTitle: string;
  prizeAmount: string;
  drawDateFormatted: string;
  enteredAt: string;
  status: 'active' | 'completed' | 'won';
  telegramSynced: boolean;
  telegramUsername?: string;
}

export interface Winner {
  id: string;
  username: string;
  avatarUrl: string;
  prizeAmount: string;
  prizeTitle: string;
  ticketId: string;
  drawDateFormatted: string;
  telegramVerified: boolean;
  seedHash: string;
}

export interface NotificationPreferences {
  drawResults: boolean;
  newGiveaways: boolean;
  entryUpdates: boolean;
  importantUpdates: boolean;
}

export interface TelegramState {
  isConnected: boolean;
  username: string;
  telegramId: string;
  notifications: NotificationPreferences;
}

export interface UserProfile {
  name: string;
  username: string;
  avatarUrl: string;
  joinedDate: string;
  telegramConnected: boolean;
  telegramUsername: string;
  stats: {
    totalEntries: number;
    activeEntries: number;
    totalWins: number;
  };
}
