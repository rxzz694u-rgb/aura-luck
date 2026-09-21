import React from 'react';
import { UserProfile } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Bell, Gift } from 'lucide-react';

interface TopNavigationProps {
  user: UserProfile;
  onProfileClick: () => void;
  onNotificationClick?: () => void;
  hasNotification?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  user,
  onProfileClick,
  onNotificationClick,
  hasNotification = true,
}) => {
  return (
    <header className="w-full px-4 pt-safe pt-3 pb-2 flex justify-between items-center z-30 select-none">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl cta-gradient flex items-center justify-center shrink-0">
          <Gift className="w-[18px] h-[18px] text-black" strokeWidth={2.2} />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-[16px] tracking-tight text-white leading-none">
            LuckyDraw
          </span>
          <span className="text-[10px] font-medium text-[#64748B] mt-0.5">
            Free. Real. Rewards.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNotificationClick}
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-full bg-[#0B1220] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] hover:text-white active:scale-95"
        >
          <Bell className="w-[18px] h-[18px]" />
          {hasNotification && (
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#C8FF00] ring-2 ring-[#050812]" />
          )}
        </button>
        <button
          onClick={onProfileClick}
          aria-label="Profile"
          className="rounded-full active:scale-95"
        >
          <Avatar src={user.avatarUrl} alt={user.username} size="xs" />
        </button>
      </div>
    </header>
  );
};
