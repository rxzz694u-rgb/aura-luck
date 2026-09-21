import React from 'react';
import { motion } from 'framer-motion';
import { Giveaway } from '../../types';
import { FoilPack } from '../packs/FoilPack';

interface PrizeCardProps {
  giveaway: Giveaway;
  onSelect: (giveaway: Giveaway) => void;
  onEnterQuick?: (giveaway: Giveaway) => void;
  hasEntered?: boolean;
  layout?: 'card' | 'horizontal';
}

const GRADIENTS = [
  'from-amber-500 via-orange-500 to-amber-600',
  'from-orange-500 via-red-500 to-orange-600',
  'from-yellow-500 via-amber-600 to-orange-600',
  'from-slate-400 via-slate-200 to-slate-400',
  'from-cyan-500 via-sky-600 to-blue-700',
  'from-emerald-500 via-green-600 to-emerald-700',
  'from-violet-500 via-purple-600 to-fuchsia-600',
];

function gradientFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
  return GRADIENTS[h % GRADIENTS.length];
}

export const PrizeCard: React.FC<PrizeCardProps> = ({ giveaway, onSelect, layout = 'card' }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(giveaway)}
      className={layout === 'horizontal' ? 'w-[150px] md:w-[170px] shrink-0' : 'w-full'}
    >
      <FoilPack
        title={giveaway.title}
        image={giveaway.image}
        price="$0.00"
        gradient={gradientFor(giveaway.id)}
      />
    </motion.div>
  );
};
