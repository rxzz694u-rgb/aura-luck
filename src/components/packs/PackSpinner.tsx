import React, { useEffect, useRef, useState } from 'react';
import { PackItem, RARITY_STYLE } from '../../services/packService';
import { SoundService } from '../../services/soundService';

interface PackSpinnerProps {
  items: PackItem[];
  winIndex: number;
  spinning: boolean;
  fast?: boolean;
  onDone?: (winItem: PackItem) => void;
}

const ITEM_W = 124;
const GAP = 12;

// PackDraw-accurate reel: fast launch, long cruise, dramatic slow-down,
// velocity-synced ticks, motion blur, center focus, settle bounce on land.
export const PackSpinner: React.FC<PackSpinnerProps> = ({ items, winIndex, spinning, fast, onDone }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const lastIdxRef = useRef(-1);
  const prevXRef = useRef(0);
  const doneRef = useRef(false);
  const [landed, setLanded] = useState(false);
  const [centerIdx, setCenterIdx] = useState(-1);

  useEffect(() => {
    setLanded(false);
    if (!spinning) return;
    const track = trackRef.current;
    if (!track) return;
    doneRef.current = false;

    const viewportW = track.parentElement?.clientWidth ?? 640;
    const targetX = winIndex * (ITEM_W + GAP) + ITEM_W / 2;
    const targetScroll = Math.max(0, targetX - viewportW / 2 + (Math.random() * 24 - 12)); // tiny organic offset
    const duration = fast ? 3200 : 6800;
    const start = performance.now();
    lastIdxRef.current = -1;
    prevXRef.current = 0;

    // quint ease-out for long cruise + hard decel; separate settle phase
    const ease = (t: number) => 1 - Math.pow(1 - t, 5);

    const step = (nowTs: number) => {
      const elapsed = nowTs - start;
      const p = Math.min(1, elapsed / duration);
      const eased = ease(p);
      const x = targetScroll * eased;
      const velocity = Math.max(0, (x - prevXRef.current) / Math.max(1, targetScroll) * 60);
      prevXRef.current = x;

      track.style.transform = `translate3d(${-x}px,0,0)`;
      // subtle motion blur proportional to speed (kept light for a clean look)
      const blur = Math.min(1.2, velocity * 1.4);
      track.style.filter = blur > 0.15 && p < 0.92 ? `blur(${blur.toFixed(2)}px)` : 'none';

      const idx = Math.floor((x + viewportW / 2) / (ITEM_W + GAP));
      setCenterIdx(idx);
      if (idx !== lastIdxRef.current) {
        lastIdxRef.current = idx;
        if (p > 0.02) SoundService.tick(Math.min(1, 0.15 + velocity * 2 + (1 - p) * 0.2));
      }

      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else if (!doneRef.current) {
        doneRef.current = true;
        track.style.filter = 'none';
        // settle bounce: nudge 14px past then spring back
        track.animate(
          [{ transform: `translate3d(${-targetScroll}px,0,0)` }, { transform: `translate3d(${-targetScroll - 14}px,0,0)`, offset: 0.4 }, { transform: `translate3d(${-targetScroll}px,0,0)` }],
          { duration: 480, easing: 'cubic-bezier(0.22,0.9,0.28,1)' }
        ).onfinish = () => {
          setLanded(true);
          const win = items[winIndex];
          if (win.rarity === 'legendary' || win.rarity === 'epic') SoundService.landBig();
          else SoundService.landSmall();
          onDone?.(win);
        };
      }
    };

    track.style.transform = 'translate3d(0px,0,0)';
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, winIndex, fast]);

  return (
    <div className="relative w-full overflow-hidden py-7">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none select-none overflow-hidden text-[26px] font-black whitespace-nowrap">
        {'PackDraw '.repeat(14)}
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0B0E13] via-[#0B0E13]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0B0E13] via-[#0B0E13]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 top-1 z-20 text-white text-[16px] drop-shadow-[0_0_8px_rgba(200,255,0,0.8)]">▼</div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-1 z-20 text-white text-[16px] drop-shadow-[0_0_8px_rgba(200,255,0,0.8)]">▲</div>
      {/* center marker removed – clean look, pointers only */}

      <div ref={trackRef} className="flex gap-3 will-change-transform" style={{ width: 'max-content' }}>
        {items.map((it, i) => {
          const isCenter = i === centerIdx;
          const isWin = landed && i === winIndex;
          return (
            <div
              key={it.id}
              className={`shrink-0 rounded-2xl bg-[#151923] border-2 ${RARITY_STYLE[it.rarity]} flex flex-col items-center justify-center p-2 transition-all duration-150 ${
                isWin ? 'scale-[1.07] ring-2 ring-[#C8FF00]/80' : isCenter ? 'scale-[1.03] brightness-110' : 'brightness-[0.7]'
              }`}
              style={{ width: ITEM_W, height: 150 }}
            >
              <img src={it.image} alt={it.name} className="w-[72px] h-[72px] object-contain" draggable={false} />
              <span className="mt-1.5 text-[10px] font-bold text-zinc-300 truncate w-full text-center">{it.name}</span>
              <span className={`text-[12px] font-black ${it.rarity === 'common' ? 'text-zinc-500' : 'text-[#C8FF00]'}`}>{it.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
