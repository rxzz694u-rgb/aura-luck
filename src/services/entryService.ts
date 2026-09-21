import { Entry, Giveaway } from '../types';
import { INITIAL_ENTRIES } from './mockData';
import { TelegramService } from './telegramService';

const STORAGE_KEY = 'aura_user_entries';

export const EntryService = {
  getEntries(): Entry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_ENTRIES;
  },

  saveEntries(entries: Entry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  },

  hasEntered(giveawayId: string): boolean {
    const entries = this.getEntries();
    return entries.some((e) => e.giveawayId === giveawayId && e.status === 'active');
  },

  createEntry(giveaway: Giveaway): { entry: Entry; alreadyEntered: boolean } {
    const entries = this.getEntries();
    const existing = entries.find((e) => e.giveawayId === giveaway.id && e.status === 'active');
    if (existing) {
      return { entry: existing, alreadyEntered: true };
    }

    // Generate verified ticket ID: e.g. #A82K91
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const nums = '23456789';
    const randPart =
      chars.charAt(Math.floor(Math.random() * chars.length)) +
      nums.charAt(Math.floor(Math.random() * nums.length)) +
      nums.charAt(Math.floor(Math.random() * nums.length)) +
      chars.charAt(Math.floor(Math.random() * chars.length)) +
      nums.charAt(Math.floor(Math.random() * nums.length)) +
      nums.charAt(Math.floor(Math.random() * nums.length));

    const ticketId = `#${randPart}`;
    const telegramState = TelegramService.getState();

    const newEntry: Entry = {
      id: `entry-${Date.now()}`,
      ticketId,
      giveawayId: giveaway.id,
      giveawayTitle: giveaway.title,
      prizeAmount: giveaway.prizeAmount,
      drawDateFormatted: giveaway.drawDateFormatted,
      enteredAt: 'Today',
      status: 'active',
      telegramSynced: telegramState.isConnected,
      telegramUsername: telegramState.isConnected ? telegramState.username : undefined,
    };

    const updated = [newEntry, ...entries];
    this.saveEntries(updated);
    return { entry: newEntry, alreadyEntered: false };
  },
};
