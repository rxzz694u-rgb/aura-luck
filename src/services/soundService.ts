// High-quality WebAudio engine – compressor + noise + layered synths, synced to reel velocity.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let muted = false;
try {
  muted = localStorage.getItem('packdraw_muted') === '1';
} catch { /* ignore */ }

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 6;
      comp.connect(ctx.destination);
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(comp);
      // shared noise buffer
      const len = ctx.sampleRate * 1;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, when = 0, slideTo?: number) {
  if (muted) return;
  const c = ac();
  if (!c || !master) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function click(vol: number, freq: number, when = 0) {
  if (muted) return;
  const c = ac();
  if (!c || !master || !noiseBuf) return;
  const t = c.currentTime + when;
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = freq;
  bp.Q.value = 8;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  src.connect(bp).connect(g).connect(master);
  src.start(t, Math.random() * 0.5, 0.06);
}

export const SoundService = {
  isMuted: () => muted,
  toggleMuted(): boolean {
    muted = !muted;
    try {
      localStorage.setItem('packdraw_muted', muted ? '1' : '0');
    } catch { /* ignore */ }
    return muted;
  },
  unlock() {
    ac();
  },
  // velocity 0..1 (1 = fast). Called per item pass.
  tick(velocity: number) {
    const v = Math.max(0.08, Math.min(1, velocity));
    // fast: bright tight click; slow: deeper softer thunk
    click(0.05 + v * 0.12, 1400 + v * 2200);
    tone(320 + v * 480, 0.03, 'square', 0.015 + v * 0.02);
  },
  open() {
    if (muted) return;
    const c = ac();
    if (!c || !master || !noiseBuf) return;
    const t = c.currentTime;
    // airy whoosh
    const src = c.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(300, t);
    bp.frequency.exponentialRampToValueAtTime(4200, t + 0.55);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
    src.connect(bp).connect(g).connect(master);
    src.start(t);
    src.stop(t + 0.7);
    tone(140, 0.5, 'sawtooth', 0.05, 0, 780);
  },
  landSmall() {
    tone(180, 0.12, 'sine', 0.14);
    click(0.1, 900);
  },
  landBig() {
    tone(120, 0.25, 'sine', 0.22, 0, 60);
    click(0.18, 2500);
    click(0.12, 1200, 0.03);
  },
  win(rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'epic') {
    if (muted) return;
    if (rarity === 'common') {
      tone(220, 0.18, 'triangle', 0.1);
      tone(165, 0.3, 'triangle', 0.1, 0.1);
      return;
    }
    const seq =
      rarity === 'legendary'
        ? [523, 659, 784, 1046, 1318, 1568, 2093]
        : rarity === 'epic'
        ? [523, 659, 784, 1046, 1318]
        : [440, 554, 659, 880];
    seq.forEach((f, i) => {
      tone(f, 0.32, 'triangle', 0.13, i * 0.085);
      tone(f * 2, 0.2, 'sine', 0.05, i * 0.085); // shimmer octave
    });
    // final pad
    tone(seq[0] / 2, 0.9, 'sine', 0.07, seq.length * 0.085);
  },
  lose() {
    tone(220, 0.2, 'triangle', 0.09);
    tone(165, 0.32, 'triangle', 0.09, 0.11);
  },
};
