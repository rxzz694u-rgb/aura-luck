import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'gradient' | 'secondary' | 'dark' | 'telegram' | 'ghost' | 'lime';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  iconPosition = 'right',
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'h-9 px-4 text-[13px] rounded-full gap-1.5',
    md: 'h-11 px-5 text-[14px] rounded-2xl gap-2',
    lg: 'h-13 px-6 text-[15px] rounded-2xl gap-2',
    hero: 'h-14 px-6 text-[16px] rounded-2xl gap-2.5 shadow-ios-cta',
  };

  const variantStyles = {
    primary:
      'cta-gradient text-black font-bold shadow-cta hover:brightness-110',
    gradient:
      'cta-gradient text-black font-bold shadow-cta hover:brightness-110',
    secondary:
      'bg-white/[0.05] text-white border border-white/[0.08] hover:bg-white/[0.09]',
    dark: 'bg-white/[0.07] text-white hover:bg-white/[0.1] border border-white/[0.08]',
    telegram:
      'bg-[#0088CC] text-white shadow-telegram-cta hover:bg-[#007BB5]',
    ghost:
      'bg-transparent text-[#94A3B8] hover:text-white hover:bg-white/[0.05]',
    lime: 'bg-[#C8FF00] text-black font-black shadow-[0_8px_20px_rgba(200,255,0,0.3)] hover:brightness-110',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={twMerge(
        clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </motion.button>
  );
};
