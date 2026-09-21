import { Pack, PackEntry, PackResult, JoinResult, PackStatus } from '../types/packs';

// ============================================================================
// PackBackend – the SINGLE authority for all pack logic.
// UI layers must never assign slots, lock packs, or pick winners themselves.
// Randomness uses crypto.getRandomValues (OS CSPRNG). In production, swap
// secureRandomInt/auditHash internals for server API calls – the UI contract
// stays identical.
// ============================================================================

export const CURRENT_USER_ID = 'user-alex';
export const CURRENT_USERNAME = '@alex92';

const DB_KEY = 'packdb_v1';
const REGION_KEY = 'pack_region';

interface DB {
  packs: Pack[];
  entries: PackEntry[];
  results: PackResult[];
}

const nowISO = () => new Date().toISOString();
const inDays = (d: number) => new Date(Date.now() + d * 86400000).toISOString();
const inHours = (h: number) => new Date(Date.now() + h * 3600000).toISOString();

// --- secure randomness (CSPRNG) ---------------------------------------------
export function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) throw new Error('maxExclusive must be > 0');
  const u32 = new Uint32Array(1);
  // Rejection sampling to avoid modulo bias
  const limit = Math.floor(0xffffffff / maxExclusive) * maxExclusive;
  let x = 0;
  do {
    crypto.getRandomValues(u32);
    x = u32[0];
  } while (x >= limit);
  return x % maxExclusive;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// --- seed data ---------------------------------------------------------------
function seed(): DB {
  const packs: Pack[] = [
    {
      id: 'pack-001',
      name: 'Mystery Tech Pack',
      description: '12 spots. One winner takes the AirPods. Free-fair draw, locked the second it fills.',
      productName: 'Apple AirPods',
      productImage: '/assets/cutouts/airpods-pro.png',
      prizeValue: 'AED 549',
      totalSpots: 12,
      entryPrice: 10,
      currency: 'AED',
      status: 'published',
      accent: 'from-violet-600 via-purple-500 to-fuchsia-500',
      startAt: nowISO(),
      endAt: inDays(2),
      blockedRegions: [],
      createdAt: nowISO(),
    },
    {
      id: 'pack-002',
      name: 'Neon Cash Drop',
      description: '10 spots. Fastest pack in the studio – fills in hours, not days.',
      productName: 'AED 500 Cash',
      productImage: '/assets/cutouts/render-golden-sphere.png',
      prizeValue: 'AED 500',
      totalSpots: 10,
      entryPrice: 5,
      currency: 'AED',
      status: 'published',
      accent: 'from-lime-400 via-lime-300 to-emerald-400',
      startAt: nowISO(),
      endAt: inHours(26),
      blockedRegions: [],
      createdAt: nowISO(),
    },
    {
      id: 'pack-003',
      name: 'Luxe Watch Pack',
      description: '15 spots. Premium smartwatch for the price of a coffee.',
      productName: 'Smart Watch Ultra',
      productImage: '/assets/cutouts/watch-ultra.png',
      prizeValue: 'AED 1,299',
      totalSpots: 15,
      entryPrice: 25,
      currency: 'AED',
      status: 'published',
      accent: 'from-sky-500 via-cyan-400 to-teal-300',
      startAt: nowISO(),
      endAt: inDays(5),
      blockedRegions: [],
      createdAt: nowISO(),
    },
  ];

  const entries: PackEntry[] = [];
  const bots = ['@creek_xx', '@sophia_m', '@david_k', '@elena_r', '@marcus_t', '@nova_7', '@pixel_p', '@lucky_lee', '@mina_k', '@omar_d', '@tariq_a', '@zhen_w'];
  const fill = (packId: string, slots: number[]) => {
    slots.forEach((slot, i) => {
      entries.push({
        id: `pe-${packId}-${slot}`,
        packId,
        userId: `bot-${packId}-${slot}`,
        username: bots[(slot + i) % bots.length],
        slotNumber: slot,
        joinedAt: new Date(Date.now() - (slots.length - i) * 3600000).toISOString(),
        paymentStatus: 'paid',
      });
    });
  };
  fill('pack-001', [1, 2, 4, 5, 7, 9, 10, 12]); // 8/12
  fill('pack-002', [3, 6, 9]); // 3/10

  // Completed example with permanent result
  packs.push({
    id: 'pack-000',
    name: 'Starter Pack',
    description: 'First studio pack – completed.',
    productName: 'Gift Bundle',
    productImage: '/assets/cutouts/gift-250.png',
    prizeValue: 'AED 250',
    totalSpots: 10,
    entryPrice: 5,
    currency: 'AED',
    status: 'completed',
    accent: 'from-amber-500 via-orange-400 to-rose-400',
    startAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    endAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    blockedRegions: [],
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  });
  for (let s = 1; s <= 10; s++) {
    entries.push({
      id: `pe-pack-000-${s}`,
      packId: 'pack-000',
      userId: `bot-pack-000-${s}`,
      username: bots[s % bots.length],
      slotNumber: s,
      joinedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      paymentStatus: 'paid',
    });
  }
  const results: PackResult[] = [
    {
      id: 'pr-pack-000',
      packId: 'pack-000',
      winningEntryId: 'pe-pack-000-7',
      winningSlot: 7,
      winnerUsername: '@nova_7',
      drawnAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      drawMethod: 'CSPRNG: crypto.getRandomValues (server-side in production)',
      auditHash: 'seed-record-pack-000',
    },
  ];
  return { packs, entries, results };
}

function load(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const db = JSON.parse(raw) as DB;
      if (db.packs && db.entries && db.results) return db;
    }
  } catch { /* ignore */ }
  const db = seed();
  save(db);
  return db;
}

function save(db: DB) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch { /* ignore */ }
}

// --- region / jurisdiction ----------------------------------------------------
export function getRegion(): string {
  try {
    return localStorage.getItem(REGION_KEY) || 'AE';
  } catch {
    return 'AE';
  }
}
export function setRegion(code: string) {
  try {
    localStorage.setItem(REGION_KEY, code);
  } catch { /* ignore */ }
}

// --- queries ------------------------------------------------------------------
export function listPacks(status?: PackStatus[]): Pack[] {
  const db = load();
  const order: Record<string, number> = { published: 0, full: 1, locked: 2, completed: 3, draft: 4, unpublished: 5 };
  return db.packs
    .filter((p) => (!status ? p.status !== 'draft' && p.status !== 'unpublished' : status.includes(p.status)))
    .sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
}

export function getPack(packId: string): Pack | undefined {
  return load().packs.find((p) => p.id === packId);
}

export function packEntries(packId: string): PackEntry[] {
  return load().entries.filter((e) => e.packId === packId).sort((a, b) => a.slotNumber - b.slotNumber);
}

export function filledCount(packId: string): number {
  return packEntries(packId).length;
}

export function myEntry(packId: string, userId = CURRENT_USER_ID): PackEntry | undefined {
  return load().entries.find((e) => e.packId === packId && e.userId === userId);
}

export function getResult(packId: string): PackResult | undefined {
  return load().results.find((r) => r.packId === packId);
}

export function freeSlots(packId: string): number[] {
  const pack = getPack(packId);
  if (!pack) return [];
  const taken = new Set(packEntries(packId).map((e) => e.slotNumber));
  const out: number[] = [];
  for (let s = 1; s <= pack.totalSpots; s++) if (!taken.has(s)) out.push(s);
  return out;
}

// --- join (the ONLY way to take a slot) ---------------------------------------
export function joinPack(
  packId: string,
  user: { id: string; username: string },
  charge: (amount: number, label: string) => { ok: boolean; error?: string },
): JoinResult {
  const db = load();
  const pack = db.packs.find((p) => p.id === packId);
  if (!pack) return { ok: false, error: 'Pack not found' };
  if (pack.status !== 'published') return { ok: false, error: 'This pack is not open for entries' };
  if (pack.blockedRegions.includes(getRegion())) return { ok: false, error: 'Not available in your region' };
  if (new Date(pack.endAt).getTime() < Date.now()) return { ok: false, error: 'This pack has expired' };
  if (db.entries.some((e) => e.packId === packId && e.userId === user.id))
    return { ok: false, error: 'You already hold a spot in this pack' };

  const taken = new Set(db.entries.filter((e) => e.packId === packId).map((e) => e.slotNumber));
  if (taken.size >= pack.totalSpots) {
    if (pack.status === 'published') {
      pack.status = 'full';
      save(db);
    }
    return { ok: false, error: 'Pack is full' };
  }

  const payment = charge(pack.entryPrice, `Pack entry: ${pack.name}`);
  if (!payment.ok) return { ok: false, error: payment.error || 'Payment failed' };

  // CSPRNG slot assignment, no duplicates possible
  const free: number[] = [];
  for (let s = 1; s <= pack.totalSpots; s++) if (!taken.has(s)) free.push(s);
  const slotNumber = free[secureRandomInt(free.length)];

  const entry: PackEntry = {
    id: `pe-${packId}-${user.id}-${Date.now()}`,
    packId,
    userId: user.id,
    username: user.username,
    slotNumber,
    joinedAt: nowISO(),
    paymentStatus: 'paid',
  };
  db.entries.push(entry);

  let packFilled = false;
  if (db.entries.filter((e) => e.packId === packId).length >= pack.totalSpots) {
    pack.status = 'full'; // auto-lock the second it fills
    packFilled = true;
  }
  save(db);
  return { ok: true, entry, packFilled };
}

// --- secure draw (winner selection lives HERE, never in components) -----------
export async function runDraw(packId: string): Promise<PackResult> {
  const db = load();
  const pack = db.packs.find((p) => p.id === packId);
  if (!pack) throw new Error('Pack not found');
  if (pack.status !== 'full' && pack.status !== 'locked') throw new Error('Pack must be full/locked before the draw');
  const existing = db.results.find((r) => r.packId === packId);
  if (existing) throw new Error('Result already recorded – re-runs are not permitted');
  const pool = db.entries.filter((e) => e.packId === packId);
  if (pool.length < pack.totalSpots) throw new Error('Pack is not full yet');

  const seedBytes = new Uint8Array(32);
  crypto.getRandomValues(seedBytes);
  const seedHex = [...seedBytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  const winner = pool[secureRandomInt(pool.length)];
  const drawnAt = nowISO();
  const auditHash = await sha256Hex(`${packId}|${winner.slotNumber}|${seedHex}|${drawnAt}`);

  const result: PackResult = {
    id: `pr-${packId}-${Date.now()}`,
    packId,
    winningEntryId: winner.id,
    winningSlot: winner.slotNumber,
    winnerUsername: winner.username,
    drawnAt,
    drawMethod: 'CSPRNG: crypto.getRandomValues (server-side in production)',
    auditHash,
  };
  db.results.push(result);
  pack.status = 'completed';
  pack.completedAt = drawnAt;
  save(db);
  return result;
}

// --- admin --------------------------------------------------------------------
export interface PackInput {
  name: string;
  description: string;
  productName: string;
  productImage: string;
  prizeValue: string;
  totalSpots: number;
  entryPrice: number;
  currency: string;
  accent: string;
  startAt: string;
  endAt: string;
  blockedRegions: string[];
}

export function validatePackInput(input: PackInput, existingEntries = 0): string | null {
  if (!input.name.trim()) return 'Pack name is required';
  if (!input.productName.trim()) return 'Product name is required';
  if (!Number.isInteger(input.totalSpots) || input.totalSpots < 10 || input.totalSpots > 15)
    return 'Spots must be a whole number from 10 to 15';
  if (input.totalSpots < existingEntries) return `Cannot shrink below ${existingEntries} taken spots`;
  if (!(input.entryPrice > 0)) return 'Entry price must be greater than 0';
  if (!input.productImage.trim()) return 'Product image is required';
  if (new Date(input.endAt).getTime() <= new Date(input.startAt).getTime()) return 'End time must be after start time';
  return null;
}

export function createPack(input: PackInput): { pack?: Pack; error?: string } {
  const err = validatePackInput(input);
  if (err) return { error: err };
  const db = load();
  const pack: Pack = {
    ...input,
    id: `pack-${Date.now()}`,
    status: 'draft',
    createdAt: nowISO(),
  };
  db.packs.push(pack);
  save(db);
  return { pack };
}

export function updatePack(packId: string, patch: Partial<PackInput>): { pack?: Pack; error?: string } {
  const db = load();
  const pack = db.packs.find((p) => p.id === packId);
  if (!pack) return { error: 'Pack not found' };
  if (pack.status === 'completed') return { error: 'Completed packs are immutable' };
  const taken = db.entries.filter((e) => e.packId === packId).length;
  const merged: PackInput = {
    name: patch.name ?? pack.name,
    description: patch.description ?? pack.description,
    productName: patch.productName ?? pack.productName,
    productImage: patch.productImage ?? pack.productImage,
    prizeValue: patch.prizeValue ?? pack.prizeValue,
    totalSpots: patch.totalSpots ?? pack.totalSpots,
    entryPrice: patch.entryPrice ?? pack.entryPrice,
    currency: patch.currency ?? pack.currency,
    accent: patch.accent ?? pack.accent,
    startAt: patch.startAt ?? pack.startAt,
    endAt: patch.endAt ?? pack.endAt,
    blockedRegions: patch.blockedRegions ?? pack.blockedRegions,
  };
  const err = validatePackInput(merged, taken);
  if (err) return { error: err };
  Object.assign(pack, merged);
  save(db);
  return { pack };
}

export function setPackStatus(packId: string, status: PackStatus): string | null {
  const db = load();
  const pack = db.packs.find((p) => p.id === packId);
  if (!pack) return 'Pack not found';
  if (pack.status === 'completed') return 'Completed packs are immutable';
  if (status === 'completed') return 'Use Run Draw to complete a pack';
  pack.status = status;
  save(db);
  return null;
}

export function lockPack(packId: string): string | null {
  const db = load();
  const pack = db.packs.find((p) => p.id === packId);
  if (!pack) return 'Pack not found';
  if (pack.status !== 'published' && pack.status !== 'full') return 'Only open packs can be locked';
  pack.status = 'locked';
  save(db);
  return null;
}

export function allPacksAdmin(): Pack[] {
  return load().packs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function resetDemo() {
  localStorage.removeItem(DB_KEY);
}
