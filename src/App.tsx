import React, { useState, useEffect } from 'react';
import { TabType, Giveaway, Entry, Winner, UserProfile, TelegramState, NotificationPreferences } from './types';
import { MOCK_GIVEAWAYS, MOCK_WINNERS, INITIAL_USER } from './services/mockData';
import { TelegramService } from './services/telegramService';
import { EntryService } from './services/entryService';
import { WalletService, Transaction } from './services/walletService';
import { getPack } from './services/packBackend';

import { TopNavigation } from './components/layout/TopNavigation';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { DesktopHeader } from './components/layout/DesktopHeader';

import { HomeView } from './views/HomeView';
import { DrawsView } from './views/DrawsView';
import { PacksView } from './views/PacksView';
import { AdminPacksView } from './views/AdminPacksView';
import { WalletView } from './views/WalletView';
import { WinnersView } from './views/WinnersView';
import { EntriesView } from './views/EntriesView';
import { ProfileView } from './views/ProfileView';

import { DrawDetailModal } from './components/modals/DrawDetailModal';
import { PackDetailModal } from './components/modals/PackDetailModal';
import { PackOpenModal } from './components/modals/PackOpenModal';
import { EntrySuccessModal } from './components/modals/EntrySuccessModal';
import { WinnerRevealModal } from './components/modals/WinnerRevealModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { HowItWorksModal } from './components/modals/HowItWorksModal';
import { TermsRulesModal } from './components/modals/TermsRulesModal';
import { SupportModal } from './components/modals/SupportModal';
import { WalletModal } from './components/modals/WalletModal';
import { Toast, ToastMessage } from './components/ui/Toast';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [giveaways, setGiveaways] = useState<Giveaway[]>(MOCK_GIVEAWAYS);
  const [winners] = useState<Winner[]>(MOCK_WINNERS);
  const [entries, setEntries] = useState<Entry[]>(() => EntryService.getEntries());
  const [telegramState, setTelegramState] = useState<TelegramState>(() => TelegramService.getState());

  const [user, setUser] = useState<UserProfile>(() => {
    const activeEntries = EntryService.getEntries().filter((e) => e.status === 'active').length;
    return {
      ...INITIAL_USER,
      stats: {
        totalEntries: EntryService.getEntries().length,
        activeEntries,
        totalWins: 0,
      },
    };
  });

  // Modal States
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem('aura_onboarding_completed');
  });
  const [selectedGiveaway, setSelectedGiveaway] = useState<Giveaway | null>(null);
  const [studioPack, setStudioPack] = useState<Giveaway | null>(null);
  const [packDetailId, setPackDetailId] = useState<string | null>(null);
  const [packRefresh, setPackRefresh] = useState(0);
  const bumpPacks = () => setPackRefresh((k) => k + 1);
  const [successEntry, setSuccessEntry] = useState<Entry | null>(null);
  const [isWinnerRevealOpen, setIsWinnerRevealOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);

  // Desktop Device Frame Simulation Toggle
  const [isSimulatedMobile, setIsSimulatedMobile] = useState<boolean>(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [balance, setBalance] = useState(() => WalletService.getBalance());
  const [txs, setTxs] = useState<Transaction[]>(() => WalletService.getTransactions());

  // Toast State
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    setToast({
      id: `${Date.now()}`,
      title,
      description,
      type,
    });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync user stats whenever entries change
  useEffect(() => {
    const activeEntries = entries.filter((e) => e.status === 'active').length;
    setUser((prev) => ({
      ...prev,
      telegramConnected: telegramState.isConnected,
      telegramUsername: telegramState.username,
      stats: {
        totalEntries: entries.length,
        activeEntries,
        totalWins: 0,
      },
    }));
  }, [entries, telegramState]);

  // Pack entry charge – wallet is the payment rail for packs
  const chargePackEntry = (amount: number, label: string): { ok: boolean; error?: string } => {
    const r = WalletService.spend(amount, label);
    if (r.error) return { ok: false, error: r.error };
    setBalance(r.balance);
    setTxs(r.txs);
    return { ok: true };
  };

  // Handle entering a giveaway
  const handleEnterGiveaway = (giveaway: Giveaway) => {
    const { entry, alreadyEntered } = EntryService.createEntry(giveaway);

    if (alreadyEntered) {
      showToast('Already entered!', 'You already have an active ticket for this draw.', 'info');
      setSelectedGiveaway(null);
      setSuccessEntry(entry);
      return;
    }

    // Update state
    setEntries(EntryService.getEntries());

    // Update entrant count on giveaway
    setGiveaways((prev) =>
      prev.map((g) => (g.id === giveaway.id ? { ...g, totalEntrants: g.totalEntrants + 1 } : g))
    );

    setSelectedGiveaway(null);
    setSuccessEntry(entry);

    if (telegramState.isConnected) {
      showToast('Entry Confirmed! 🎉', `Ticket ${entry.ticketId} synced with Telegram`, 'telegram');
    } else {
      showToast('Entry Confirmed! 🎉', `Ticket ${entry.ticketId} registered`, 'success');
    }
  };

  const handleShare = (item: Giveaway | Entry) => {
    const title = 'giveawayTitle' in item ? item.giveawayTitle : item.title;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `I just entered the free ${title} on LuckyDraw! Join free: https://luckydraw.app/draws`
      );
      showToast('Link Copied! 🎁', 'Share with friends for bonus luck!', 'success');
    } else {
      showToast('Share Link Ready', 'Share with friends to claim extra luck!', 'info');
    }
  };

  // Telegram Controls
  const handleConnectTelegram = () => {
    const updated = TelegramService.connect('@alex92');
    setTelegramState(updated);
    showToast('Telegram Connected! ✓', 'Notifications enabled for @alex92', 'telegram');
  };

  const handleDisconnectTelegram = () => {
    const updated = TelegramService.disconnect();
    setTelegramState(updated);
    showToast('Telegram Disconnected', 'Push alerts disabled', 'info');
  };

  const handleToggleTelegramNotification = (key: keyof NotificationPreferences, value: boolean) => {
    const updated = TelegramService.updateNotification(key, value);
    setTelegramState(updated);
  };

  const handleTestTelegramAlert = () => {
    showToast(
      'Telegram Push: $500 Cash Draw',
      'Alert: Only 2 hours remaining in live draw! Tap to view your entry.',
      'telegram'
    );
  };

  const handleCompleteOnboarding = () => {
    setIsOnboardingOpen(false);
    localStorage.setItem('aura_onboarding_completed', 'true');
    showToast('Welcome to Aura! 🎉', 'Explore active draws and enter for free.', 'success');
  };

  const handleReplayOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  const hasEntered = (giveawayId: string) => {
    return EntryService.hasEntered(giveawayId);
  };

  const handleDeposit = (amount: number): string | null => {
    const { balance: b, txs: t } = WalletService.deposit(amount);
    setBalance(b);
    setTxs(t);
    showToast('Deposit successful', `$${amount.toFixed(2)} added to wallet`, 'success');
    return null;
  };

  const handleWithdraw = (amount: number): string | null => {
    const { balance: b, txs: t, error } = WalletService.withdraw(amount);
    if (error) return error;
    setBalance(b);
    setTxs(t);
    showToast('Withdrawal requested', `$${amount.toFixed(2)} on the way`, 'success');
    return null;
  };

  return (
    <div className="min-h-screen bg-[#050812] text-white flex flex-col items-center">
      {/* Floating Dynamic Island Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Responsive Desktop Navigation Header */}
      <div className="w-full">
        <DesktopHeader
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          user={user}
          isSimulatedMobile={isSimulatedMobile}
          onToggleSimulator={() => setIsSimulatedMobile((prev) => !prev)}
          balance={balance}
          onOpenWallet={() => setIsWalletOpen(true)}
        />
      </div>

      {/* Main Container - either standard centered or iPhone Frame */}
      <div
        className={`w-full transition-all duration-300 flex-1 flex flex-col justify-start relative ${
          isSimulatedMobile
            ? 'max-w-[390px] my-6 rounded-[32px] shadow-[0_25px_70px_rgba(0,0,0,0.6)] border-[8px] border-[#1D1D1F] bg-[#050812] overflow-hidden min-h-[844px]'
            : 'max-w-[480px] md:max-w-[1024px] lg:max-w-[1200px] px-0 md:px-6'
        }`}
      >
        {/* Top Mobile App Navigation Bar */}
        <TopNavigation
          user={user}
          onProfileClick={() => setCurrentTab('profile')}
          onNotificationClick={() => showToast('Notifications', 'Draw results and new prizes will appear here.', 'info')}
        />

        {/* View Routing */}
        <main className="flex-1 w-full">
          {currentTab === 'home' && (
            <HomeView
              giveaways={giveaways}
              user={user}
              onSelectGiveaway={(g) => setSelectedGiveaway(g)}
              onEnterGiveaway={handleEnterGiveaway}
              hasEntered={hasEntered}
              onViewAllDraws={() => setCurrentTab('draws')}
              onOpenPackStudio={() => setStudioPack(giveaways.find((g) => g.id === 'draw-hero-5000') || giveaways[0])}
            />
          )}

          {currentTab === 'draws' && (
            <DrawsView
              giveaways={giveaways}
              onSelectGiveaway={(g) => setSelectedGiveaway(g)}
            />
          )}

          {currentTab === 'packs' && (
            <PacksView
              refreshKey={packRefresh}
              onOpenPack={(p) => setPackDetailId(p.id)}
            />
          )}

          {currentTab === 'admin' && (
            <AdminPacksView
              refreshKey={packRefresh}
              onChanged={bumpPacks}
            />
          )}

          {currentTab === 'wallet' && (
            <WalletView
              balance={balance}
              txs={txs}
              totalEntries={user.stats.totalEntries}
              totalWins={user.stats.totalWins}
              onAddFunds={() => setIsWalletOpen(true)}
              onViewHistory={() => setIsWalletOpen(true)}
            />
          )}

          {currentTab === 'winners' && (
            <WinnersView
              winners={winners}
              onSelectWinner={() => setIsWinnerRevealOpen(true)}
              onWatchReveal={() => setIsWinnerRevealOpen(true)}
              onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            />
          )}

          {currentTab === 'entries' && (
            <EntriesView
              entries={entries}
              onViewTicket={(entry) => setSuccessEntry(entry)}
              onExploreDraws={() => setCurrentTab('draws')}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              user={user}
              telegramState={telegramState}
              onToggleTelegramNotification={handleToggleTelegramNotification}
              onConnectTelegram={handleConnectTelegram}
              onDisconnectTelegram={handleDisconnectTelegram}
              onTestTelegramAlert={handleTestTelegramAlert}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
              onOpenRules={() => setIsRulesOpen(true)}
              onReplayOnboarding={handleReplayOnboarding}
              onOpenSupport={() => setIsSupportOpen(true)}
              onOpenWallet={() => setIsWalletOpen(true)}
            />
          )}
        </main>

        {/* Mobile Frosted Tab Bar */}
        <BottomNavigation
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          activeEntriesCount={user.stats.activeEntries}
        />
      </div>

      {/* MODALS */}
      {/* 1. Onboarding Flow (6 Complete Steps) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
        onConnectTelegram={handleConnectTelegram}
        isTelegramConnected={telegramState.isConnected}
        telegramUsername={telegramState.username}
      />

      {/* 2. Draw Detail */}
      <DrawDetailModal
        giveaway={selectedGiveaway}
        isOpen={Boolean(selectedGiveaway)}
        onClose={() => setSelectedGiveaway(null)}
        onEnter={handleEnterGiveaway}
        hasEntered={selectedGiveaway ? hasEntered(selectedGiveaway.id) : false}
        onConnectTelegram={handleConnectTelegram}
        isTelegramConnected={telegramState.isConnected}
        onShare={handleShare}
      />

      {/* 2c. Pack Draw Studio – instant unbox with 16-product lineup */}
      <PackOpenModal
        giveaway={studioPack}
        isOpen={Boolean(studioPack)}
        onClose={() => setStudioPack(null)}
        onOpenPack={handleEnterGiveaway}
        hasEntered={studioPack ? hasEntered(studioPack.id) : false}
      />
      <PackDetailModal
        pack={packDetailId ? getPack(packDetailId) ?? null : null}
        isOpen={Boolean(packDetailId)}
        refreshKey={packRefresh}
        onClose={() => setPackDetailId(null)}
        onChanged={bumpPacks}
        charge={chargePackEntry}
        onNeedFunds={() => setIsWalletOpen(true)}
      />

      {/* 3. Entry Success Confirmation Sheet */}
      <EntrySuccessModal
        entry={successEntry}
        isOpen={Boolean(successEntry)}
        onClose={() => setSuccessEntry(null)}
        onViewEntries={() => setCurrentTab('entries')}
        onShare={handleShare}
      />

      {/* 4. Winner Reveal Experience */}
      <WinnerRevealModal
        isOpen={isWinnerRevealOpen}
        onClose={() => setIsWinnerRevealOpen(false)}
        onViewWinners={() => setCurrentTab('winners')}
        onJoinNextDraw={() => {
          setIsWinnerRevealOpen(false);
          const nextDraw = giveaways.find((g) => g.id === 'draw-gold-1000') || giveaways[0];
          setSelectedGiveaway(nextDraw);
        }}
      />

      {/* 5. How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* 6. Terms & Rules Modal */}
      <TermsRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* 7. Support Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        onSendFeedback={() => {
          showToast('Message Sent! ✓', 'Support will reply to @alex92 on Telegram', 'telegram');
        }}
      />

      {/* 8. Wallet – Deposit / Withdraw / History */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        balance={balance}
        txs={txs}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
}
