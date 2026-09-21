import React, { useState } from 'react';
import { Pack } from '../types/packs';
import {
  allPacksAdmin, createPack, updatePack, setPackStatus, lockPack, runDraw,
  packEntries, filledCount, getResult, validatePackInput, PackInput,
} from '../services/packBackend';
import { Plus, Pencil, Lock, Play, Check, X, Users } from 'lucide-react';

interface AdminPacksViewProps {
  refreshKey: number;
  onChanged: () => void;
}

const IMAGES = [
  '/assets/cutouts/airpods-pro.png',
  '/assets/cutouts/iphone-16.png',
  '/assets/cutouts/watch-ultra.png',
  '/assets/cutouts/macbook-air.png',
  '/assets/cutouts/ps5-dark.png',
  '/assets/cutouts/gamer-100.png',
  '/assets/cutouts/gold-1000.png',
  '/assets/cutouts/crypto-750.png',
  '/assets/cutouts/gift-250.png',
  '/assets/cutouts/render-golden-sphere.png',
  '/assets/cutouts/render-hero-sphere.png',
  '/assets/cutouts/render-cash-card.png',
];

const ACCENTS = [
  'from-violet-600 via-purple-500 to-fuchsia-500',
  'from-lime-400 via-lime-300 to-emerald-400',
  'from-sky-500 via-cyan-400 to-teal-300',
  'from-amber-500 via-orange-400 to-rose-400',
];

const emptyForm = (): PackInput & { customImage: string } => ({
  name: '',
  description: '',
  productName: '',
  productImage: IMAGES[0],
  prizeValue: '',
  totalSpots: 12,
  entryPrice: 10,
  currency: 'AED',
  accent: ACCENTS[0],
  startAt: new Date().toISOString().slice(0, 16),
  endAt: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16),
  blockedRegions: [],
  customImage: '',
});

type FormState = ReturnType<typeof emptyForm>;

export const AdminPacksView: React.FC<AdminPacksViewProps> = ({ refreshKey, onChanged }) => {
  void refreshKey; // re-render + re-read store after every mutation
  const list = allPacksAdmin();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [openParts, setOpenParts] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const formOpen = creating || editing;

  const startCreate = () => {
    setForm(emptyForm());
    setCreating(true);
    setEditing(null);
    setError(null);
  };
  const startEdit = (p: Pack) => {
    const inLibrary = IMAGES.includes(p.productImage);
    setForm({
      name: p.name, description: p.description, productName: p.productName,
      productImage: inLibrary ? p.productImage : IMAGES[0], prizeValue: p.prizeValue,
      totalSpots: p.totalSpots, entryPrice: p.entryPrice, currency: p.currency, accent: p.accent,
      startAt: p.startAt.slice(0, 16), endAt: p.endAt.slice(0, 16), blockedRegions: p.blockedRegions,
      customImage: inLibrary ? '' : p.productImage,
    });
    setEditing(p.id);
    setCreating(false);
    setError(null);
  };
  const cancel = () => {
    setCreating(false);
    setEditing(null);
    setError(null);
  };

  const save = () => {
    const image = form.customImage.trim() || form.productImage;
    const payload = {
      ...form,
      productImage: image,
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
    };
    delete (payload as any).customImage;
    if (editing) {
      const r = updatePack(editing, payload);
      if (r.error) return setError(r.error);
    } else {
      const err = validatePackInput(payload);
      if (err) return setError(err);
      const r = createPack(payload);
      if (r.error) return setError(r.error);
    }
    cancel();
    onChanged();
  };

  const doRun = async (id: string) => {
    setBusy(true);
    setError(null);
    try {
      await runDraw(id);
      onChanged();
    } catch (e: any) {
      setError(e.message || 'Draw failed');
    } finally {
      setBusy(false);
    }
  };

  const act = (fn: () => string | null) => {
    const err = fn();
    if (err) setError(err);
    else onChanged();
  };

  const previewSrc = form.customImage.trim() || form.productImage;

  return (
    <div className="flex flex-col gap-3 px-4 md:px-0 pt-2 pb-28">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[20px] font-black text-white tracking-tight">Pack Management</h1>
          <p className="text-[12px] text-[#94A3B8] mt-0.5">{list.length} packs • create, publish &amp; draw</p>
        </div>
        {!formOpen && (
          <button onClick={startCreate} className="flex items-center gap-1.5 h-11 px-4 rounded-2xl bg-[#C8FF00] text-black text-[13px] font-black active:scale-95">
            <Plus className="w-4 h-4" strokeWidth={3} /> New Pack
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-[13px] font-semibold text-rose-300">
          {error}
        </div>
      )}

      {formOpen && (
        <div className="rounded-[20px] bg-[#0B1220] border border-[#C8FF00]/25 overflow-hidden animate-fade-up">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08]">
            <p className="text-[15px] font-black text-white">{creating ? 'New Pack' : 'Edit Pack'}</p>
            <button onClick={cancel} aria-label="Close editor" className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-[#94A3B8] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-5">
            <Section title="Basics">
              <Field label="Pack name">
                <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inp} placeholder="Mystery Tech Pack" maxLength={40} />
              </Field>
              <Field label="Short promo line">
                <input value={form.description} onChange={(e) => set('description', e.target.value)} className={inp} placeholder="12 spots. One winner takes it all." maxLength={90} />
              </Field>
            </Section>

            <Section title="Prize & artwork">
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Product">
                  <input value={form.productName} onChange={(e) => set('productName', e.target.value)} className={inp} placeholder="Apple AirPods" maxLength={30} />
                </Field>
                <Field label="Prize value">
                  <input value={form.prizeValue} onChange={(e) => set('prizeValue', e.target.value)} className={inp} placeholder="AED 549" maxLength={16} />
                </Field>
              </div>
              <Field label="Artwork — pick or paste a link">
                <div className="grid grid-cols-4 gap-2">
                  {IMAGES.map((src) => {
                    const active = !form.customImage.trim() && form.productImage === src;
                    return (
                      <button
                        key={src}
                        onClick={() => set('productImage', src)}
                        className={`relative h-16 rounded-2xl bg-white/[0.03] border-2 p-1.5 transition-all active:scale-95 ${active ? 'border-[#C8FF00]' : 'border-white/[0.08]'}`}
                      >
                        <img src={src} alt="" className="w-full h-full object-contain" loading="lazy" />
                        {active && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C8FF00] text-black flex items-center justify-center">
                            <Check className="w-3 h-3" strokeWidth={4} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <img src={previewSrc} alt="" className="w-11 h-11 rounded-xl object-contain bg-white/[0.04] border border-white/[0.08] p-1 shrink-0" />
                  <input
                    value={form.customImage}
                    onChange={(e) => set('customImage', e.target.value)}
                    className={inp}
                    placeholder="…or paste image URL (https://…png)"
                    inputMode="url"
                  />
                </div>
                <p className="text-[11px] text-[#64748B] leading-snug">Transparent PNG ≈800px works best. A pasted link overrides the picked artwork.</p>
              </Field>
              <Field label="Card color">
                <div className="flex gap-2">
                  {ACCENTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => set('accent', a)}
                      aria-label="Card color"
                      className={`h-10 flex-1 rounded-xl bg-gradient-to-br ${a} border-2 transition-all active:scale-95 ${form.accent === a ? 'border-[#C8FF00]' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </Field>
            </Section>

            <Section title="Sale">
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Spots">
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-1.5 h-12">
                    <button onClick={() => set('totalSpots', Math.max(10, form.totalSpots - 1))} className={step} aria-label="Fewer spots">−</button>
                    <span className="text-[16px] font-black text-white tabular-nums">{form.totalSpots}</span>
                    <button onClick={() => set('totalSpots', Math.min(15, form.totalSpots + 1))} className={step} aria-label="More spots">+</button>
                  </div>
                  <p className="text-[10px] text-[#64748B] text-center">10–15</p>
                </Field>
                <Field label="Price">
                  <input type="number" min={1} value={form.entryPrice} onChange={(e) => set('entryPrice', parseFloat(e.target.value) || 0)} className={`${inp} h-12 text-center`} />
                </Field>
                <Field label="Currency">
                  <input value={form.currency} onChange={(e) => set('currency', e.target.value.toUpperCase())} className={`${inp} h-12 text-center`} maxLength={4} />
                </Field>
              </div>
            </Section>

            <Section title="Schedule & region">
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Start"><input type="datetime-local" value={form.startAt} onChange={(e) => set('startAt', e.target.value)} className={inp} /></Field>
                <Field label="End"><input type="datetime-local" value={form.endAt} onChange={(e) => set('endAt', e.target.value)} className={inp} /></Field>
              </div>
              <Field label="Blocked regions">
                <input
                  value={form.blockedRegions.join(', ')}
                  onChange={(e) => set('blockedRegions', e.target.value.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean))}
                  className={inp}
                  placeholder="None — leave empty"
                />
              </Field>
            </Section>

            <button onClick={save} className="h-14 rounded-2xl bg-[#C8FF00] text-black font-black text-[15px] active:scale-[0.99]">
              {creating ? 'Create Pack' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {list.map((p) => {
          const filled = filledCount(p.id);
          const pct = Math.round((filled / p.totalSpots) * 100);
          const res = getResult(p.id);
          return (
            <div key={p.id} className="rounded-[20px] bg-[#0B1220] border border-white/[0.08] p-4">
              <div className="flex items-center gap-3">
                <img src={p.productImage} alt="" className="w-14 h-14 rounded-2xl object-contain bg-white/[0.04] border border-white/[0.06] p-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black text-white truncate">{p.name}</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                    {p.totalSpots} spots • {p.currency} {p.entryPrice} • {p.productName}
                  </p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                    <div className="h-full rounded-full bg-[#C8FF00]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[14px] font-black text-white tabular-nums">{filled}/{p.totalSpots}</p>
                  <StatusBadge status={p.status} />
                </div>
              </div>

              {res && (
                <p className="mt-2.5 flex items-center gap-1.5 text-[12px] font-bold text-[#C8FF00]">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} /> Winner {res.winnerUsername} • Spot #{res.winningSlot}
                </p>
              )}

              <div className="mt-3 pt-3 border-t border-white/[0.08] flex gap-1.5 flex-wrap">
                <button onClick={() => startEdit(p)} disabled={p.status === 'completed'} className={btn}><Pencil className="w-3.5 h-3.5" /> Edit</button>
                {(p.status === 'draft' || p.status === 'unpublished') && (
                  <button onClick={() => act(() => setPackStatus(p.id, 'published'))} className={btn}>Publish</button>
                )}
                {p.status === 'published' && (
                  <button onClick={() => act(() => setPackStatus(p.id, 'unpublished'))} className={btn}>Unpublish</button>
                )}
                {(p.status === 'published' || p.status === 'full') && (
                  <button onClick={() => act(() => lockPack(p.id))} className={btn}><Lock className="w-3.5 h-3.5" /> Lock</button>
                )}
                {(p.status === 'full' || p.status === 'locked') && !res && (
                  <button onClick={() => doRun(p.id)} disabled={busy} className={btnAccent}><Play className="w-3.5 h-3.5" /> Run Draw</button>
                )}
                <button onClick={() => setOpenParts(openParts === p.id ? null : p.id)} className={btn}>
                  <Users className="w-3.5 h-3.5" /> {openParts === p.id ? 'Hide' : `Spots (${filled})`}
                </button>
              </div>

              {openParts === p.id && (
                <div className="mt-2.5 rounded-2xl bg-black/25 border border-white/[0.08] p-3 max-h-44 overflow-y-auto no-scrollbar">
                  {packEntries(p.id).map((e) => (
                    <div key={e.id} className="flex items-center gap-2.5 py-1.5 border-b border-white/[0.05] last:border-0">
                      <span className="text-[12px] font-black text-black bg-[#C8FF00] rounded-lg px-2 py-0.5 tabular-nums">
                        #{String(e.slotNumber).padStart(2, '0')}
                      </span>
                      <span className="text-[12px] text-[#94A3B8] truncate flex-1">{e.username}</span>
                      <span className="text-[10px] uppercase font-bold text-[#19D37A]">{e.paymentStatus}</span>
                    </div>
                  ))}
                  {filled === 0 && <p className="text-[12px] text-[#64748B] text-center py-2">No entries yet</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const inp = 'w-full h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3.5 text-[14px] text-white outline-none focus:border-[#C8FF00]/60 placeholder:text-[#64748B]';
const step = 'w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-[16px] font-black active:scale-95';
const btn = 'flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[12px] font-bold text-zinc-200 active:scale-95 disabled:opacity-40';
const btnAccent = 'flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-[#C8FF00] text-black text-[12px] font-black active:scale-95 disabled:opacity-40';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="flex flex-col gap-2.5">
    <h3 className="text-[11px] font-black uppercase tracking-widest text-[#64748B]">{title}</h3>
    {children}
  </section>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wide">{label}</span>
    {children}
  </label>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const c =
    status === 'published' ? 'text-[#19D37A]' :
    status === 'completed' ? 'text-[#94A3B8]' :
    status === 'full' || status === 'locked' ? 'text-[#C8FF00]' : 'text-[#FFC83D]';
  return <span className={`text-[10px] font-black uppercase tracking-wide ${c}`}>{status}</span>;
};
