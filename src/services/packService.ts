import { Giveaway } from '../types';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface PackItem {
  id: string;
  name: string;
  value: string;
  image: string;
  rarity: Rarity;
}

interface CatalogEntry {
  name: string;
  value: string;
  image: string;
  rarity: Rarity;
}

// Full 18-product lineup shown across the strip + Possible Drops.
// Transparent cutouts, one consistent art style.
const CATALOG: CatalogEntry[] = [
  { name: 'Starter Coins', value: '$0.10', image: '/assets/cutouts/starter-50.png', rarity: 'common' },
  { name: 'Retro Controller', value: '$0.10', image: '/assets/cutouts/gamer-100.png', rarity: 'common' },
  { name: 'Bronze Coins', value: '$0.25', image: '/assets/cutouts/bronze-100.png', rarity: 'common' },
  { name: 'Gift Voucher', value: '$0.50', image: '/assets/cutouts/gift-250.png', rarity: 'common' },
  { name: 'Mystery Charm', value: '$0.10', image: '/assets/cutouts/render-telegram-glow.png', rarity: 'common' },
  { name: 'Lucky Token', value: '$0.10', image: '/assets/cutouts/render-prize-cards.png', rarity: 'common' },
  { name: 'Crypto Coin', value: '$5.00', image: '/assets/cutouts/crypto-750.png', rarity: 'rare' },
  { name: 'Street Sneakers', value: '$5.00', image: '/assets/cutouts/sneakers.png', rarity: 'rare' },
  { name: 'Pro Controller', value: '$5.00', image: '/assets/cutouts/ps5-dark.png', rarity: 'rare' },
  { name: 'AirPods Pro', value: '$5.00', image: '/assets/cutouts/airpods-pro.png', rarity: 'rare' },
  { name: 'Cash Card', value: '$5.00', image: '/assets/cutouts/render-cash-card.png', rarity: 'rare' },
  { name: 'iPhone 16', value: '$500', image: '/assets/cutouts/iphone-16.png', rarity: 'epic' },
  { name: 'Gold Bar', value: '$500', image: '/assets/cutouts/gold-1000.png', rarity: 'epic' },
  { name: 'Watch Ultra', value: '$500', image: '/assets/cutouts/watch-ultra.png', rarity: 'epic' },
  { name: 'MacBook Air', value: '$500', image: '/assets/cutouts/macbook-dark.png', rarity: 'epic' },
  { name: 'Silver Orb', value: '$500', image: '/assets/cutouts/render-hero-sphere.png', rarity: 'epic' },
  { name: 'Pastel Jackpot', value: '$500', image: '/assets/cutouts/render-pastel-lottery.png', rarity: 'epic' },
  { name: 'Golden Sphere', value: '$500', image: '/assets/cutouts/render-golden-sphere.png', rarity: 'epic' },
];

const byRarity = (r: Rarity): CatalogEntry[] => CATALOG.filter((c) => c.rarity === r);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const RARITY_STYLE: Record<Rarity, string> = {
  common: 'border-white/10',
  rare: 'border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]',
  epic: 'border-purple-400/50 shadow-[0_0_14px_rgba(168,85,247,0.3)]',
  legendary: 'border-[#C8FF00]/60 shadow-[0_0_16px_rgba(200,255,0,0.3)]',
};

export function buildPackStrip(giveaway: Giveaway, length = 64): { items: PackItem[]; winIndex: number } {
  const items: PackItem[] = [];
  for (let i = 0; i < length; i++) {
    const r = Math.random();
    let entry: CatalogEntry;
    if (r > 0.985) {
      entry = { name: giveaway.prizeAmount, value: giveaway.prizeAmount, image: '/assets/cutouts/render-golden-sphere.png', rarity: 'legendary' };
    } else if (r > 0.94) {
      entry = { name: giveaway.title, value: giveaway.prizeAmount, image: giveaway.image, rarity: 'epic' };
    } else if (r > 0.78) {
      entry = pick(byRarity('rare'));
    } else {
      entry = pick(byRarity('common'));
    }
    items.push({ id: `pi-${i}`, ...entry });
  }
  // Force winner near the end (PackDraw lands ~88% through strip for suspense)
  const winIndex = Math.floor(length * 0.86) + Math.floor(Math.random() * 3);
  const isJackpot = Math.random() > 0.6;
  items[winIndex] = {
    id: `pi-win-${Date.now()}`,
    name: giveaway.title,
    value: giveaway.prizeAmount,
    image: giveaway.image,
    rarity: isJackpot ? 'legendary' : 'epic',
  };
  return { items, winIndex };
}

// Distinct product lineup for the "Possible drops" grid: jackpot first,
// then a spread across rarities. Count clamps to 12–20.
export function getPossibleDrops(giveaway: Giveaway, count = 16): PackItem[] {
  const n = Math.max(12, Math.min(20, count));
  const lineup: PackItem[] = [
    {
      id: 'pd-jackpot',
      name: giveaway.title,
      value: giveaway.prizeAmount,
      image: giveaway.image,
      rarity: 'legendary',
    },
  ];
  const pool = [...CATALOG].sort(() => Math.random() - 0.5);
  // guarantee at least 2 epics and 3 rares in the mix
  const mustHave = [
    ...byRarity('epic').sort(() => Math.random() - 0.5).slice(0, 2),
    ...byRarity('rare').sort(() => Math.random() - 0.5).slice(0, 3),
  ];
  const seen = new Set(lineup.map((l) => l.image));
  for (const m of mustHave) {
    if (lineup.length >= n) break;
    if (seen.has(m.image)) continue;
    seen.add(m.image);
    lineup.push({ id: `pd-${m.image}`, ...m });
  }
  for (const c of pool) {
    if (lineup.length >= n) break;
    if (seen.has(c.image)) continue;
    seen.add(c.image);
    lineup.push({ id: `pd-${c.image}`, ...c });
  }
  return lineup;
}
