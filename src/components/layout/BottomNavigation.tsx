import React from 'react';
import { TabType } from '../../types';
import { Home, Gift, Package, Wallet, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeEntriesCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  activeEntriesCount = 0,
}) => {
  // Sub-routes map to a parent tab so the bar stays on 4 items without losing routes
  const resolved: TabType =
    currentTab === 'winners' ? 'draws'
    : currentTab === 'entries' || currentTab === 'admin' ? 'profile'
    : currentTab;

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'draws' as TabType, label: 'Draws', icon: Gift },
    { id: 'packs' as TabType, label: 'Packs', icon: Package },
    { id: 'wallet' as TabType, label: 'Wallet', icon: Wallet },
    { id: 'profile' as TabType, label: 'Profile', icon: User, badge: activeEntriesCount },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-[480px] md:max-w-full bg-[#080D19]/85 backdrop-blur-2xl border-t border-white/[0.08] pb-safe pt-1.5 px-4"
    >
      <div className="flex justify-around items-center h-[60px] md:max-w-[560px] md:mx-auto">
        {tabs.map((tab) => {
          const isActive = resolved === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-1 outline-none select-none cursor-pointer"
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.div whileTap={{ scale: 0.85 }} className="relative flex items-center justify-center">
                <Icon
                  className={`w-[22px] h-[22px] transition-colors duration-200 ${
                    isActive ? 'text-[#C8FF00]' : 'text-[#64748B]'
                  }`}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-3 min-w-[16px] h-4 px-1 bg-[#C8FF00] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-[10px] tracking-tight mt-1 ${
                  isActive ? 'font-bold text-white' : 'font-medium text-[#64748B]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-0.5 w-8 h-[3px] rounded-full cta-gradient"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
