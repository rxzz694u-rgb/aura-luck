import React, { useState } from 'react';
import { Giveaway, DrawCategory } from '../types';
import { DrawCard } from '../components/draw/DrawCard';
import { Search } from 'lucide-react';

interface DrawsViewProps {
  giveaways: Giveaway[];
  onSelectGiveaway: (giveaway: Giveaway) => void;
}

export const DrawsView: React.FC<DrawsViewProps> = ({ giveaways, onSelectGiveaway }) => {
  const [activeCategory, setActiveCategory] = useState<DrawCategory>('all');
  const [query, setQuery] = useState('');

  const categories: { id: DrawCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'cash', label: 'Cash' },
    { id: 'tech', label: 'Tech' },
    { id: 'lifestyle', label: 'Lifestyle' },
  ];

  const filtered = giveaways.filter((g) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      g.title.toLowerCase().includes(q) ||
      g.prizeAmount.toLowerCase().includes(q) ||
      (g.subtitle || '').toLowerCase().includes(q);
    if (!matchesQ) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'cash') return g.category === 'cash' || g.category === 'giftcard';
    return g.category === activeCategory;
  });

  return (
    <div className="flex flex-col gap-4 px-4 md:px-0 pt-2 pb-28">
      <div className="flex items-center gap-2.5 rounded-2xl bg-[#0B1220] border border-white/[0.08] px-4 h-12 focus-within:border-[#C8FF00]/60">
        <Search className="w-[18px] h-[18px] text-[#64748B] shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search draws, prizes, winners..."
          className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder:text-[#64748B]"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 h-10 rounded-full text-[13px] font-bold whitespace-nowrap transition-all active:scale-95 ${
                isActive ? 'cta-gradient text-black shadow-cta' : 'bg-[#0B1220] text-[#94A3B8] border border-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((g, i) => (
            <DrawCard key={g.id} giveaway={g} onSelect={onSelectGiveaway} featured={i === 0} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-[15px] font-bold text-white">No draws found</p>
          <p className="text-[13px] text-[#94A3B8] mt-1">Try a different search or category.</p>
        </div>
      )}
    </div>
  );
};
