import React, { useState } from 'react';
import { Pack } from '../types/packs';
import { PackCard } from '../components/packs/PackCard';
import { getRegion, setRegion, listPacks } from '../services/packBackend';
import { MapPin } from 'lucide-react';

interface PacksViewProps {
  refreshKey: number;
  onOpenPack: (pack: Pack) => void;
  onViewAll?: () => void;
}

const REGIONS = ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'IN', 'PK', 'PH', 'US', 'GB'];

export const PacksView: React.FC<PacksViewProps> = ({ refreshKey, onOpenPack }) => {
  const [region, setR] = useState(getRegion());
  void refreshKey; // forces re-read of the backend store after joins/draws
  const packs = listPacks();

  return (
    <div className="flex flex-col gap-4 px-4 md:px-0 pt-2 pb-28">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[22px] font-black text-white tracking-tight">Packs</h1>
          <p className="text-[12px] text-[#94A3B8] mt-0.5">Small packs. Real products. One winner each.</p>
        </div>
        <label className="flex items-center gap-1.5 rounded-xl bg-[#0B1220] border border-white/[0.08] px-2.5 h-10 text-[12px] font-bold text-white">
          <MapPin className="w-3.5 h-3.5 text-[#C8FF00]" />
          <select
            value={region}
            onChange={(e) => { setRegion(e.target.value); setR(e.target.value); }}
            className="bg-transparent outline-none text-[12px] font-bold text-white"
            aria-label="Your region"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r} className="bg-[#0B1220]">{r}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {packs.map((p) => (
          <PackCard key={p.id} pack={p} onOpen={onOpenPack} />
        ))}
      </div>

      <p className="text-center text-[11px] text-[#64748B] px-6 leading-relaxed">
        Paid packs are games of chance. 18+. Not available in all regions. See pack terms before joining.
      </p>
    </div>
  );
};
