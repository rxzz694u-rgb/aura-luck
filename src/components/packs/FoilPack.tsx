import React from 'react';
import { motion } from 'framer-motion';

interface FoilPackProps {
  title: string;
  image: string;
  price?: string;
  gradient?: string;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

// Foil sachet like PackDraw screenshots: serrated top/bottom, glossy foil, price below
export const FoilPack: React.FC<FoilPackProps> = ({
  title,
  image,
  price = '$0.00',
  gradient = 'from-amber-500 via-orange-500 to-amber-600',
  onClick,
  size = 'md',
}) => {
  const dims = size === 'sm' ? 'w-full aspect-[3/4]' : 'w-full aspect-[3/4]';
  return (
    <div onClick={onClick} className="flex flex-col items-center cursor-pointer group select-none">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className={`relative ${dims} overflow-hidden bg-gradient-to-br ${gradient}`}
        style={{
          borderRadius: '10px',
          clipPath: 'polygon(0% 2%, 3% 0%, 6% 2%, 9% 0%, 12% 2%, 15% 0%, 18% 2%, 21% 0%, 24% 2%, 27% 0%, 30% 2%, 33% 0%, 36% 2%, 39% 0%, 42% 2%, 45% 0%, 48% 2%, 51% 0%, 54% 2%, 57% 0%, 60% 2%, 63% 0%, 66% 2%, 69% 0%, 72% 2%, 75% 0%, 78% 2%, 81% 0%, 84% 2%, 87% 0%, 90% 2%, 93% 0%, 96% 2%, 100% 0%, 100% 98%, 97% 100%, 94% 98%, 91% 100%, 88% 98%, 85% 100%, 82% 98%, 79% 100%, 76% 98%, 73% 100%, 70% 98%, 67% 100%, 64% 98%, 61% 100%, 58% 98%, 55% 100%, 52% 98%, 49% 100%, 46% 98%, 43% 100%, 40% 98%, 37% 100%, 34% 98%, 31% 100%, 28% 98%, 25% 100%, 22% 98%, 19% 100%, 16% 98%, 13% 100%, 10% 98%, 7% 100%, 4% 98%, 0% 100%)',
        }}
      >
        {/* inner foil shading */}
        <div className="absolute inset-[6px] rounded-[6px] bg-gradient-to-b from-white/25 via-transparent to-black/30 pointer-events-none" />
        {/* glossy sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 pointer-events-none" />
        {/* content */}
        <div className="absolute inset-[10px] flex flex-col items-center justify-start pt-2 text-center">
          <span className="text-white font-black uppercase leading-[1.05] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-[13px] md:text-[15px] line-clamp-2">
            {title}
          </span>
          <img
            src={image}
            alt={title}
            className="mt-1 w-[92%] h-[68%] object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"
            draggable={false}
          />
        </div>
      </motion.div>
      <span className="mt-1.5 text-[13px] md:text-[14px] font-bold text-zinc-200">{price}</span>
    </div>
  );
};
