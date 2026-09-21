import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';
import { triggerRestrainedConfetti } from '../ui/Confetti';
import { ArrowRight, Send, Check, ShieldCheck } from 'lucide-react';
import { NotificationPreferences } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onConnectTelegram: () => void;
  isTelegramConnected: boolean;
  telegramUsername?: string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onConnectTelegram,
  isTelegramConnected,
  telegramUsername = '@alex92',
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  const [notificationSettings, setNotificationSettings] = useState<NotificationPreferences>({
    drawResults: true,
    newGiveaways: true,
    entryUpdates: true,
    importantUpdates: false,
  });

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      if (step === 5) {
        triggerRestrainedConfetti();
      }
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleNotification = (key: keyof NotificationPreferences) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-[400px] bg-[#151923] rounded-[32px] p-6 shadow-2xl flex flex-col justify-between min-h-[580px] overflow-hidden"
      >
        {/* Top Header & Skip */}
        <div className="flex items-center justify-between z-10">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="text-[13px] font-semibold text-zinc-400 hover:text-white active:scale-95 transition-transform"
            >
              ← Back
            </button>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-widest text-electric-purple">
              AURA ONBOARDING
            </span>
          )}

          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx + 1 === step
                    ? 'w-6 bg-[#111111]'
                    : idx + 1 < step
                    ? 'w-1.5 bg-[#111111]/40'
                    : 'w-1.5 bg-black/10'
                }`}
              />
            ))}
          </div>

          {step < totalSteps && (
            <button
              onClick={onComplete}
              className="text-[13px] font-semibold text-zinc-500 hover:text-white transition-colors"
            >
              Skip
            </button>
          )}
        </div>

        {/* Dynamic Step Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-4 z-10">
          <AnimatePresence mode="wait">
            {/* SCREEN 1: WELCOME */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-52 h-52 my-3 flex items-center justify-center animate-float">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/50 via-sky-100/50 to-pink-100/40 rounded-full blur-2xl" />
                  <img
                    src="/assets/cutouts/render-pastel-lottery.png"
                    alt="3D abstract lottery sphere"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_25px_rgba(139,92,246,0.15)] relative"
                  />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-2">
                  Welcome to Aura
                </span>
                <h2 className="text-[26px] font-black tracking-tight text-white leading-tight">
                  Your lucky moment starts here.
                </h2>
                <p className="text-[14px] text-zinc-400 mt-2 max-w-[280px]">
                  Enter free giveaways and discover exciting prizes every week.
                </p>
              </motion.div>
            )}

            {/* SCREEN 2: FIND SOMETHING WORTH WINNING */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-52 h-52 my-3 flex items-center justify-center animate-float">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/60 to-purple-100/40 rounded-full blur-2xl" />
                  <img
                    src="/assets/cutouts/gift-250.png"
                    alt="Floating colorful giveaway cards"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_25px_rgba(0,0,0,0.1)] relative"
                  />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">
                  Discover Prizes
                </span>
                <h2 className="text-[26px] font-black tracking-tight text-white leading-tight">
                  Find something worth winning.
                </h2>
                <p className="text-[14px] text-zinc-400 mt-2 max-w-[290px]">
                  Browse active giveaways and enter the ones you like — completely free.
                </p>
              </motion.div>
            )}

            {/* SCREEN 3: NO COMPLICATED STEPS */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center w-full"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-2">
                  Effortless Process
                </span>
                <h2 className="text-[26px] font-black tracking-tight text-white leading-tight">
                  No complicated steps.
                </h2>
                <p className="text-[14px] text-zinc-400 mt-1 max-w-[280px] mb-5">
                  Choose a draw, tap Enter Free, and you're in.
                </p>

                {/* 3 Step Process Cards */}
                <div className="w-full space-y-2.5">
                  <div className="bg-white/[0.04] border border-white/[0.07] p-3.5 rounded-2xl flex items-center gap-3 text-left">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-extrabold text-[13px] flex items-center justify-center shrink-0">
                      01
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-white">Choose</p>
                      <p className="text-[12px] text-zinc-400">
                        Select any active cash or tech prize
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/[0.04] border border-white/[0.07] p-3.5 rounded-2xl flex items-center gap-3 text-left">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-[13px] flex items-center justify-center shrink-0">
                      02
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-white">Enter</p>
                      <p className="text-[12px] text-zinc-400">
                        One tap free entry with verified ticket ID
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/[0.04] border border-white/[0.07] p-3.5 rounded-2xl flex items-center gap-3 text-left">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-[13px] flex items-center justify-center shrink-0">
                      03
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-white">Wait</p>
                      <p className="text-[12px] text-zinc-400">
                        Live draw automated result notifications
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCREEN 4: CONNECT TELEGRAM */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-44 h-44 my-2 flex items-center justify-center animate-float">
                  <div className="absolute inset-0 bg-sky-100/60 rounded-full blur-2xl" />
                  <img
                    src="/assets/cutouts/render-telegram-glow.png"
                    alt="Telegram 3D airplane"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_20px_rgba(0,136,204,0.2)] relative"
                  />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0088CC] bg-[#E3F3FC] px-3 py-1 rounded-full mb-2">
                  Instant Notifications
                </span>
                <h2 className="text-[26px] font-black tracking-tight text-white leading-tight">
                  Never miss the result.
                </h2>
                <p className="text-[14px] text-zinc-400 mt-2 max-w-[300px]">
                  Connect Telegram to receive your entry confirmation, draw updates, and winner announcements.
                </p>

                {isTelegramConnected && (
                  <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Connected as {telegramUsername}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* SCREEN 5: NOTIFICATION PREFERENCES */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center w-full"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-1">
                  Preferences
                </span>
                <h2 className="text-[26px] font-black tracking-tight text-white leading-tight">
                  What should we tell you?
                </h2>
                <p className="text-[13px] text-zinc-400 mt-1 mb-4">
                  Customize your push alert preferences
                </p>

                <div className="w-full bg-white/[0.04] border border-white/[0.07] rounded-2xl divide-y divide-black/[0.04] overflow-hidden text-left">
                  <div className="flex items-center justify-between p-3.5">
                    <div>
                      <p className="text-[14px] font-semibold text-white">Draw Results</p>
                      <p className="text-[12px] text-zinc-400">Winner announcements</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.drawResults}
                      onChange={() => toggleNotification('drawResults')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5">
                    <div>
                      <p className="text-[14px] font-semibold text-white">New Giveaways</p>
                      <p className="text-[12px] text-zinc-400">When new draws open</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.newGiveaways}
                      onChange={() => toggleNotification('newGiveaways')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5">
                    <div>
                      <p className="text-[14px] font-semibold text-white">Entry Updates</p>
                      <p className="text-[12px] text-zinc-400">Ticket confirmations</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.entryUpdates}
                      onChange={() => toggleNotification('entryUpdates')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5">
                    <div>
                      <p className="text-[14px] font-semibold text-white">Important Updates</p>
                      <p className="text-[12px] text-zinc-400">Platform announcements</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.importantUpdates}
                      onChange={() => toggleNotification('importantUpdates')}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCREEN 6: YOU'RE READY */}
            {step === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-52 h-52 my-3 flex items-center justify-center animate-float">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/60 via-purple-100/50 to-pink-100/60 rounded-full blur-2xl" />
                  <img
                    src="/assets/cutouts/render-golden-sphere.png"
                    alt="Celebratory golden crystal sphere"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_25px_rgba(245,158,11,0.2)] relative"
                  />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-2">
                  All Set
                </span>
                <h2 className="text-[28px] font-black tracking-tight text-white leading-tight">
                  You're ready.
                </h2>
                <p className="text-[14px] text-zinc-400 mt-2 max-w-[280px]">
                  Your next lucky moment could be one tap away.
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Free · Provably Fair</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Button Area */}
        <div className="w-full pt-3 z-10">
          {step === 1 && (
            <Button fullWidth size="hero" variant="primary" onClick={nextStep} icon={<ArrowRight className="w-4 h-4" />}>
              Get Started
            </Button>
          )}

          {(step === 2 || step === 3 || step === 5) && (
            <Button fullWidth size="hero" variant="primary" onClick={nextStep} icon={<ArrowRight className="w-4 h-4" />}>
              Continue
            </Button>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-2 w-full">
              {!isTelegramConnected ? (
                <Button
                  fullWidth
                  size="hero"
                  variant="telegram"
                  onClick={() => {
                    onConnectTelegram();
                    nextStep();
                  }}
                  icon={<Send className="w-4 h-4" />}
                >
                  Connect Telegram
                </Button>
              ) : (
                <Button fullWidth size="hero" variant="primary" onClick={nextStep} icon={<ArrowRight className="w-4 h-4" />}>
                  Continue
                </Button>
              )}
              <button
                onClick={nextStep}
                className="py-2 text-[13px] font-semibold text-zinc-500 hover:text-white transition-colors"
              >
                Maybe later
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col items-center gap-2 w-full">
              <Button fullWidth size="hero" variant="primary" onClick={onComplete} icon={<ArrowRight className="w-4 h-4" />}>
                Explore Giveaways
              </Button>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Free to enter
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
