import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'live' | 'free' | 'verified' | 'purple' | 'gold' | 'neutral' | 'telegram';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'free',
  children,
  size = 'md',
  className,
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-[12px] px-3 py-1 gap-1.5',
  };

  const variantStyles = {
    live: 'bg-[#C8FF00]/15 text-[#C8FF00] border border-[#C8FF00]/30 font-bold',
    free: 'bg-[#C8FF00] text-black font-black',
    verified: 'bg-sky-500/15 text-sky-300 border border-sky-400/20 font-semibold',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-400/20 font-semibold',
    gold: 'bg-amber-400/15 text-amber-300 border border-amber-300/20 font-semibold',
    neutral: 'bg-white/[0.06] text-zinc-400 font-medium',
    telegram: 'bg-[#0088CC]/15 text-sky-300 border border-[#0088CC]/30 font-semibold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full tracking-tight shrink-0 select-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {variant === 'live' && (
        <span className="relative flex h-2 w-2 mr-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
