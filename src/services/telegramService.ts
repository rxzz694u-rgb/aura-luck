import { TelegramState, NotificationPreferences } from '../types';

const STORAGE_KEY = 'aura_telegram_state';

const DEFAULT_STATE: TelegramState = {
  isConnected: true,
  username: '@alex92',
  telegramId: '89410294',
  notifications: {
    drawResults: true,
    newGiveaways: true,
    entryUpdates: true,
    importantUpdates: false,
  },
};

export const TelegramService = {
  getState(): TelegramState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_STATE;
  },

  saveState(state: TelegramState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  },

  connect(username: string = '@alex92'): TelegramState {
    const currentState = this.getState();
    const updated: TelegramState = {
      ...currentState,
      isConnected: true,
      username: username.startsWith('@') ? username : `@${username}`,
      telegramId: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    };
    this.saveState(updated);
    return updated;
  },

  disconnect(): TelegramState {
    const currentState = this.getState();
    const updated: TelegramState = {
      ...currentState,
      isConnected: false,
    };
    this.saveState(updated);
    return updated;
  },

  updateNotification(key: keyof NotificationPreferences, value: boolean): TelegramState {
    const currentState = this.getState();
    const updated: TelegramState = {
      ...currentState,
      notifications: {
        ...currentState.notifications,
        [key]: value,
      },
    };
    this.saveState(updated);
    return updated;
  },
};
