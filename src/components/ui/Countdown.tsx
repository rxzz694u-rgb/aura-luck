import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface CountdownProps {
  targetDate: string; // ISO string or date
  variant?: 'capsules' | 'compact' | 'minimal';
  className?: string;
  onExpire?: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  variant = 'compact',
  className,
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 2,
    minutes: 14,
    seconds: 38,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (variant === 'capsules') {
    return (
      <div className={clsx('flex items-center justify-center gap-2.5 sm:gap-3', className)}>
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-ios-card border border-black/[0.04]">
                <span className="text-[24px] sm:text-[28px] font-bold text-text-primary tabular-nums">
                  {pad(timeLeft.days)}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-text-secondary mt-1.5 tracking-wider">
                DAYS
              </span>
            </div>
            <span className="text-[20px] font-bold text-slate-300 -mt-5">:</span>
          </>
        )}

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-ios-card border border-black/[0.04]">
            <span className="text-[24px] sm:text-[28px] font-bold text-text-primary tabular-nums">
              {pad(timeLeft.hours)}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-text-secondary mt-1.5 tracking-wider">
            HOURS
          </span>
        </div>

        <span className="text-[20px] font-bold text-slate-300 -mt-5">:</span>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-ios-card border border-black/[0.04]">
            <span className="text-[24px] sm:text-[28px] font-bold text-text-primary tabular-nums">
              {pad(timeLeft.minutes)}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-text-secondary mt-1.5 tracking-wider">
            MINS
          </span>
        </div>

        <span className="text-[20px] font-bold text-slate-300 -mt-5">:</span>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-ios-card border border-black/[0.04]">
            <span className="text-[24px] sm:text-[28px] font-bold text-electric-blue tabular-nums">
              {pad(timeLeft.seconds)}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-text-secondary mt-1.5 tracking-wider">
            SECS
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    if (timeLeft.days > 0) {
      return (
        <span className={clsx('font-mono tabular-nums text-text-secondary', className)}>
          {timeLeft.days}d {pad(timeLeft.hours)}h
        </span>
      );
    }
    return (
      <span className={clsx('font-mono tabular-nums text-text-secondary', className)}>
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    );
  }

  // default 'compact'
  return (
    <div className={clsx('inline-flex items-center font-mono font-bold tracking-tight', className)}>
      {timeLeft.days > 0 ? (
        <span className="tabular-nums">
          {timeLeft.days}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m
        </span>
      ) : (
        <span className="tabular-nums">
          {pad(timeLeft.hours)}
          <span className="text-text-secondary/40 mx-0.5">:</span>
          {pad(timeLeft.minutes)}
          <span className="text-text-secondary/40 mx-0.5">:</span>
          {pad(timeLeft.seconds)}
        </span>
      )}
    </div>
  );
};
