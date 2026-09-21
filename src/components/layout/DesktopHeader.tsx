import React from 'react';
import { TabType, UserProfile } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Gift } from 'lucide-react';

interface DesktopHeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenHowItWorks: () => void;
  user: UserProfile;
  isSimulatedMobile: boolean;
  onToggleSimulator: () => void;
  balance: number;
  onOpenWallet: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentTab,
  onTabChange,
  user,
  balance,
  onOpenWallet,
}) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Home' },
    { id: 'draws' as TabType, label: 'Draws' },
    { id: 'packs' as TabType, label: 'Packs' },
    { id: 'wallet' as TabType, label: 'Wallet' },
    { id: 'profile' as TabType, label: 'Profile' },
  ];
  const resolved =
    currentTab === 'winners' ? 'draws' : currentTab === 'entries' || currentTab === 'admin' ? 'profile' : currentTab;

  return (
    <header className="w-full bg-[#080D19]/85 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-40 px-6 py-3 hidden md:flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div onClick={() => onTabChange('home')} className="flex items-center gap-2.5 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-2xl cta-gradient flex items-center justify-center">
            <Gift className="w-[18px] h-[18px] text-black" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[17px] tracking-tight text-white leading-none">LuckyDraw</span>
            <span className="text-[9px] font-medium text-[#64748B] mt-0.5">Free. Real. Rewards.</span>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
                resolved === item.id ? 'bg-white/[0.07] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenWallet}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1220] border border-white/[0.08] hover:border-white/[0.14] transition-all active:scale-95"
        >
          <span className="text-[13px] font-bold text-white">${balance.toFixed(2)}</span>
          <span className="text-[10px] font-bold uppercase cta-gradient text-black px-2 py-1 rounded-lg">Wallet</span>
        </button>
        <button
          onClick={() => onTabChange('profile')}
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors active:scale-95"
        >
          <Avatar src={user.avatarUrl} alt={user.username} size="xs" />
          <span className="text-[13px] font-bold text-white">{user.username}</span>
        </button>
      </div>
    </header>
  );
};
