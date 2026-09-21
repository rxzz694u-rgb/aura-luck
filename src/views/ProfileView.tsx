import React from 'react';
import { UserProfile, TelegramState, NotificationPreferences, TabType } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { Toggle } from '../components/ui/Toggle';
import {
  Send,
  Ticket,
  Wallet,
  Bell,
  Users,
  LifeBuoy,
  Settings,
  ChevronRight,
  Trophy,
  Package,
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  telegramState: TelegramState;
  onToggleTelegramNotification: (key: keyof NotificationPreferences, value: boolean) => void;
  onConnectTelegram: () => void;
  onDisconnectTelegram: () => void;
  onTestTelegramAlert: () => void;
  onNavigateToTab: (tab: TabType) => void;
  onOpenHowItWorks?: () => void;
  onOpenRules?: () => void;
  onReplayOnboarding?: () => void;
  onOpenSupport: () => void;
  onOpenWallet: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  telegramState,
  onToggleTelegramNotification,
  onConnectTelegram,
  onDisconnectTelegram,
  onTestTelegramAlert,
  onNavigateToTab,
  onOpenSupport,
  onOpenWallet,
}) => {
  const rows: {
    icon: React.ElementType;
    tint: string;
    label: string;
    badge?: number;
    action: () => void;
  }[] = [
    { icon: Ticket, tint: 'bg-[#C8FF00]/15 text-[#C8FF00]', label: 'Your Entries', badge: user.stats.activeEntries, action: () => onNavigateToTab('entries') },
    { icon: Wallet, tint: 'bg-[#19D37A]/15 text-[#19D37A]', label: 'Wallet & Rewards', action: () => onNavigateToTab('wallet') },
    { icon: Trophy, tint: 'bg-[#FFC83D]/15 text-[#FFC83D]', label: 'Recent Winners', action: () => onNavigateToTab('winners') },
    { icon: Package, tint: 'bg-[#C8FF00]/15 text-[#C8FF00]', label: 'Pack Management', action: () => onNavigateToTab('admin') },
    { icon: Bell, tint: 'bg-[#C8FF00]/15 text-[#C8FF00]', label: 'Notifications', action: () => onTestTelegramAlert() },
    { icon: Users, tint: 'bg-[#C8FF00]/15 text-[#C8FF00]', label: 'Referral Friends', action: () => onOpenWallet() },
    { icon: LifeBuoy, tint: 'bg-[#00D9FF]/15 text-[#00D9FF]', label: 'Help & Support', action: () => onOpenSupport() },
    { icon: Settings, tint: 'bg-white/[0.06] text-[#94A3B8]', label: 'Settings', action: () => onNavigateToTab('profile') },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 md:px-0 pt-2 pb-28">
      {/* header card */}
      <div className="card p-4 flex items-center gap-3 animate-fade-up">
        <Avatar src={user.avatarUrl} alt={user.username} size="lg" isVerified={telegramState.isConnected} />
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-extrabold text-white truncate">{user.name}</p>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            {user.username} • Member since {user.joinedDate}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#64748B] shrink-0" />
      </div>

      {/* menu */}
      <div className="card overflow-hidden divide-y divide-white/[0.08]">
        {rows.map((r) => (
          <button
            key={r.label}
            onClick={r.action}
            className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-colors text-left active:scale-[0.995]"
          >
            <span className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${r.tint}`}>
              <r.icon className="w-[18px] h-[18px]" />
            </span>
            <span className="flex-1 text-[14px] font-semibold text-white">{r.label}</span>
            {r.badge !== undefined && r.badge > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 bg-[#C8FF00] text-black text-[11px] font-bold rounded-full flex items-center justify-center">
                {r.badge}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>
        ))}
      </div>

      {/* telegram */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-[#0088CC]/15 text-[#00D9FF] flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-white">
              {telegramState.isConnected ? 'Telegram Connected' : 'Connect Telegram'}
            </p>
            <p className="text-[12px] text-[#94A3B8] mt-0.5">
              {telegramState.isConnected ? telegramState.username : 'Instant draw results'}
            </p>
          </div>
          {telegramState.isConnected ? (
            <button onClick={onDisconnectTelegram} className="text-[12px] font-semibold text-[#C8FF00]">
              Disconnect
            </button>
          ) : (
            <button
              onClick={onConnectTelegram}
              className="px-4 h-9 rounded-full cta-gradient text-black text-[12px] font-bold shadow-cta"
            >
              Connect
            </button>
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-white/[0.08] flex flex-col gap-1">
          {(
            [
              ['drawResults', 'Draw results'],
              ['newGiveaways', 'New giveaways'],
              ['entryUpdates', 'Entry updates'],
              ['importantUpdates', 'Important updates'],
            ] as const
          ).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between py-1.5">
              <span className="text-[13px] text-[#94A3B8]">{label}</span>
              <Toggle
                checked={telegramState.notifications[k]}
                onChange={(v: boolean) => onToggleTelegramNotification(k, v)}
                activeColor="#C8FF00"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
