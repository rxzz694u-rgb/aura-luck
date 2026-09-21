import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  isVerified = false,
  className,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const badgeSizeMap = {
    xs: 'w-2.5 h-2.5 right-[-2px] bottom-[-2px]',
    sm: 'w-3.5 h-3.5 right-[-2px] bottom-[-2px]',
    md: 'w-4 h-4 right-[-2px] bottom-[-2px]',
    lg: 'w-6 h-6 right-0 bottom-0',
    xl: 'w-8 h-8 right-1 bottom-1',
  };

  return (
    <div className={clsx('relative inline-block shrink-0', className)}>
      <div
        className={clsx(
          'rounded-full overflow-hidden bg-slate-100 ring-1 ring-black/[0.06]',
          sizeMap[size]
        )}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>

      {isVerified && (
        <div
          className={clsx(
            'absolute rounded-full bg-gradient-to-br from-[#0088CC] to-[#0071E3] text-white flex items-center justify-center ring-2 ring-white shadow-sm',
            badgeSizeMap[size]
          )}
          title="Verified Account"
        >
          <Check className="w-2/3 h-2/3 stroke-[3]" />
        </div>
      )}
    </div>
  );
};
