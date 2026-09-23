// Synthesises the TopBlast score + sound design, frame-locked to the video timeline.
// Output: public/topblast-score.wav (44.1kHz, 16-bit stereo). No samples needed.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
// `node make-audio.mjs` → TopBlast score; `node make-audio.mjs arena` → Stonk Arena score.
// `arena-clean` → the calmer Stonk Arena mix (same cues, softer hits).
const CALM = process.argv[2] === 'arena-clean';
const PROJECT = process.argv[2] === 'arena' || CALM ? 'arena' : 'topblast';
const K = CALM
  ? {impact: 0.35, whoosh: 0.4, riser: 0.35, rumble: 0, crowd: 0.35, clank: 0.35, kick: 0.6, sweep: 0.4}
  : {impact: 1, whoosh: 1, riser: 1, rumble: 1, crowd: 1, clank: 1, kick: 1, sweep: 1};
const tlPath = PROJECT === 'arena' ? '../src/arena/timeline.json' : '../src/timeline.json';
const tl = JSON.parse(fs.readFileSync(path.join(here, tlPath), 'utf8'));
const SR = 44100;
const FPS = tl.fps;
const LEN = Math.ceil((tl.duration / FPS) * SR);
const S = tl.scenes;
const F = (frame) => frame / FPS; // frame → seconds

const L = new Float32Array(LEN);
const R = new Float32Array(LEN);
const verbL = new Float32Array(LEN);
const verbR = new Float32Array(LEN);
const duck = new Float32Array(LEN).fill(1); // sidechain for the pad

let seed = 1337;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const add = (t0, n, fn, {pan = 0, gain = 1, verb = 0.2} = {}) => {
  const s0 = Math.floor(t0 * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < n; i++) {
    const k = s0 + i;
    if (k < 0 || k >= LEN) continue;
    const v = fn(i / SR, i);
    L[k] += v * gl;
    R[k] += v * gr;
    verbL[k] += v * gl * verb;
    verbR[k] += v * gr * verb;
  }
};

// State-variable filter factory (Chamberlin).
const svf = () => {
  let lp = 0, bp = 0;
  return (x, fc, q = 0.7) => {
    const f = 2 * Math.sin((Math.PI * Math.min(fc, SR / 6)) / SR);
    lp += f * bp;
    const hp = x - lp - q * bp;
    bp += f * hp;
    return {lp, bp, hp};
  };
};

// ─── Instruments ───────────────────────────────────────────
const kick = (t, g = 1) => {
  g *= K.kick;
  add(t, SR * 0.5, (x) => {
    const ph = 2 * Math.PI * (45 * x + (110 / 28) * (1 - Math.exp(-28 * x)));
    return (Math.sin(ph) * Math.exp(-6.5 * x) + (x < 0.004 ? rnd() * 0.4 : 0)) * 0.9;
  }, {gain: g, verb: 0.03});
  const s0 = Math.floor(t * SR);
  for (let i = 0; i < SR * 0.35; i++) if (s0 + i < LEN) duck[s0 + i] = Math.min(duck[s0 + i], 1 - 0.6 * Math.exp(-9 * (i / SR)));
};

const hat = (t, g = 0.12, pan = 0.3) => {
  const f = svf();
  add(t, SR * 0.08, (x) => f(rnd(), 9000, 0.3).hp * Math.exp(-60 * x), {gain: g, pan, verb: 0.1});
};

const click = (t, g = 0.35, freq = 2400, pan = 0) =>
  add(t, SR * 0.06, (x) => (Math.sin(2 * Math.PI * freq * x) * 0.7 + Math.sin(2 * Math.PI * freq * 1.5 * x) * 0.3) * Math.exp(-80 * x), {gain: g, pan, verb: 0.25});

const ding = (t, g = 0.18, base = 1320, pan = 0) =>
  add(t, SR * 1.2, (x) => [1, 1.5, 2.01, 3].reduce((a, m, j) => a + Math.sin(2 * Math.PI * base * m * x) * Math.exp(-(4 + j * 3) * x) / (j + 1), 0), {gain: g, pan, verb: 0.5});

const whoosh = (t, dur, g = 0.5, from = 300, to = 5000, pan = 0) => {
  g *= K.whoosh;
  const f = svf();
  add(t, SR * dur, (x) => {
    const u = x / dur;
    const env = Math.sin(Math.PI * Math.pow(u, 0.7)) ** 2;
    return f(rnd(), from * Math.pow(to / from, u), 1.2).bp * env * 2.2;
  }, {gain: g, pan, verb: 0.35});
};

const riser = (t, dur, g = 0.35) => {
  g *= K.riser;
  const f = svf();
  let ph = 0;
  add(t, SR * dur, (x) => {
    const u = x / dur;
    const env = Math.pow(u, 2.2);
    const n = f(rnd(), 400 + 9000 * u * u, 0.8).bp;
    ph += (2 * Math.PI * (110 + 660 * u * u)) / SR;
    const saw = ((ph / (2 * Math.PI)) % 1) * 2 - 1;
    return (n * 1.6 + saw * 0.18) * env;
  }, {gain: g, verb: 0.4});
};

const impact = (t, g = 1, size = 1) => {
  g *= K.impact;
  // sub drop
  add(t, SR * 2.8 * size, (x) => {
    const ph = 2 * Math.PI * (32 * x + (120 / 12) * (1 - Math.exp(-12 * x)));
    return Math.tanh(Math.sin(ph) * 2.2) * Math.exp(-(1.6 / size) * x);
  }, {gain: 0.9 * g, verb: 0.05});
  // body / crack
  const f = svf();
  add(t, SR * 2 * size, (x) => f(rnd(), 180 + 5000 * Math.exp(-7 * x), 0.9).lp * Math.exp(-(2.8 / size) * x) * 1.4, {gain: 0.6 * g, verb: 0.7});
  const s0 = Math.floor(t * SR);
  for (let i = 0; i < SR * 1.2; i++) if (s0 + i < LEN) duck[s0 + i] = Math.min(duck[s0 + i], 1 - 0.85 * Math.exp(-3 * (i / SR)));
};

const rumble = (t, dur, g = 0.6) => {
  g *= K.rumble;
  const f = svf();
  const f2 = svf();
  add(t, SR * dur, (x) => {
    const u = x / dur;
    const env = Math.min(1, u * 5) * Math.pow(1 - u, 0.6);
    const n = f(rnd(), 90 + 500 * u, 1.3).lp;
    const hiss = f2(rnd(), 1800 + 5000 * u, 1).bp * 0.35;
    return Math.tanh((n * 3 + hiss) * 1.4) * env;
  }, {gain: g, verb: 0.3});
};

const sweepDown = (t, dur, g = 0.4) => {
  g *= K.sweep;
  const f = svf();
  add(t, SR * dur, (x) => {
    const u = x / dur;
    return f(rnd(), 7000 * Math.pow(200 / 7000, u), 1.1).bp * Math.sin(Math.PI * u) * 2;
  }, {gain: g, verb: 0.3});
};

const clank = (t, g = 0.4, pan = 0) => {
  g *= K.clank;
  const f = svf();
  add(t, SR * 0.5, (x) => {
    const ring = [180, 263, 397, 611].reduce((a, hz, j) => a + Math.sin(2 * Math.PI * hz * x) * Math.exp(-(8 + j * 4) * x), 0) * 0.3;
    return ring + f(rnd(), 1200, 0.8).bp * Math.exp(-30 * x) * 1.5;
  }, {gain: g, pan, verb: 0.4});
};

const crowd = (t, dur, g = 0.4) => {
  g *= K.crowd;
  const f1 = svf();
  const f2 = svf();
  add(t, SR * dur, (x) => {
    const u = x / dur;
    const env = Math.sin(Math.PI * Math.min(1, u * 1.1)) * (0.7 + 0.3 * Math.sin(x * 5.3) * Math.sin(x * 2.1));
    return (f1(rnd(), 700, 2.2).bp + f2(rnd(), 1400, 2.4).bp * 0.6) * env * 1.5;
  }, {gain: g, verb: 0.6});
};

// ─── Pad + bass bed ────────────────────────────────────────
const chord = [55, 82.41, 110, 130.81, 164.81, 246.94]; // A minor add9 voicing
const finalChord = [55, 82.41, 110, 138.59, 164.81, 220, 329.63]; // lifts to A major on the logo
{
  const fl = svf();
  const fr = svf();
  const phases = chord.map(() => [(rnd() + 1) / 2, (rnd() + 1) / 2]);
  const impactT = F(S.finale.from + 40);
  for (let i = 0; i < LEN; i++) {
    const t = i / SR;
    const notes = t >= impactT ? finalChord : chord;
    let sl = 0, sr = 0;
    notes.forEach((hz, j) => {
      const ph = phases[j % phases.length];
      ph[0] = (ph[0] + (hz * 1.003) / SR) % 1;
      ph[1] = (ph[1] + (hz * 0.997) / SR) % 1;
      sl += ph[0] * 2 - 1;
      sr += ph[1] * 2 - 1;
    });
    // filter opens across the film, closes briefly before each big hit
    let cut = 300 + 1800 * Math.pow(Math.min(1, t / 22), 1.5);
    if (t > impactT) cut = 3200 * Math.exp(-(t - impactT) * 0.25) + 700;
    const intro = Math.min(1, t / 2.2);
    const endT = tl.duration / FPS - 1;
    const out = t > endT ? Math.max(0, 1 - (t - endT) / 1.0) : 1;
    const g = 0.055 * intro * out * duck[i] * (t > impactT ? 1.5 : 1);
    L[i] += fl(sl, cut, 0.5).lp * g;
    R[i] += fr(sr, cut, 0.5).lp * g;
  }
}

// ─── Arrangement (all times from the video timeline) ───────
const beat = 15; // 120bpm at 30fps
const SC = Object.values(S); // scenes in order
const gridFrom = SC[1].from + 2;
const dropGap = PROJECT === 'arena' ? [S.fight.from - 2, S.fight.from + 24] : [S.chart.from + 75, S.chart.from + 90];
const gridTo = S.finale.from - 8;
for (let fr = gridFrom, n = 0; fr < gridTo; fr += beat / 2, n++) {
  const inGap = fr >= dropGap[0] && fr < dropGap[1];
  if (inGap) continue;
  if (n % 2 === 0) {
    kick(F(fr), fr > dropGap[1] ? 0.95 : 0.8);
    // sub bass under each kick
    const t0 = F(fr);
    add(t0, SR * 0.45, (x) => Math.sin(2 * Math.PI * 55 * x) * Math.min(1, x * 80) * Math.exp(-4 * x), {gain: 0.35, verb: 0});
  } else if (fr > SC[2].from) {
    hat(F(fr), 0.1, n % 4 === 1 ? 0.35 : -0.35);
  }
}

if (CALM) {
  // 01 Intro (calm): headline + underline, no launch/impact
  add(0, SR * 3, (x) => Math.sin(2 * Math.PI * 41.2 * x) * Math.min(1, x / 1.5) * 0.3, {gain: 0.5, verb: 0});
  for (let i = 0; i < 16; i++) click(F(6 + i * 1.4), 0.04, 3000 + (i % 4) * 200, i % 2 ? 0.3 : -0.3);
  ding(F(26), 0.1, 880);
  ding(F(30), 0.06, 1320);
} else {
// 01 Intro
riser(0.0, F(50), 0.12);
add(0, SR * 3, (x) => Math.sin(2 * Math.PI * 41.2 * x) * Math.min(1, x / 1.5) * 0.3, {gain: 0.6, verb: 0}); // drone
for (let i = 0; i < 24; i++) click(F(6 + i * 1.1), 0.05, 3200 + (i % 5) * 200, (i % 2 ? 0.4 : -0.4));
sweepDown(F(48), F(14), 0.35);
whoosh(F(58), F(16), 0.7, 200, 8000);
impact(F(72), 1, 1.1);
whoosh(F(82), F(14), 0.4, 6000, 300);

}

if (PROJECT === 'topblast') {
// 02 Rails
whoosh(F(S.rails.from + 2), 0.9, 0.35, 400, 3000, -0.6);
whoosh(F(S.rails.from + 8), 0.9, 0.35, 400, 3000, 0.6);
[24, 38].forEach((o) => click(F(S.rails.from + o), 0.3, 1800));
kick(F(S.rails.from + 56), 0.5);
ding(F(S.rails.from + 56), 0.12, 880);
riser(F(S.rails.from + 90), F(30), 0.25);
whoosh(F(S.rails.from + 112), F(22), 0.7, 300, 9000);

// 03 Chart / Blast Zone
click(F(S.chart.from + 28), 0.45, 2000);
ding(F(S.chart.from + 30), 0.14, 1760, -0.2);
for (let k = 0; k < 5; k++) click(F(S.chart.from + 32 + k * 2.5), 0.18, 3000 + k * 300, 0.3); // line locking
click(F(S.chart.from + 44), 0.4, 1400);
[56, 70, 86].forEach((o, i) => click(F(S.chart.from + o), 0.3, 1200 - i * 180));
riser(F(S.chart.from + 48), F(42), 0.4);
impact(F(S.chart.from + 90), 1.15, 1.3);
click(F(S.chart.from + 110), 0.2, 1600);
whoosh(F(S.chart.from + 140), F(22), 0.6, 300, 8000);

// 04 Qualify
[8, 24, 40].forEach((o, i) => { click(F(S.qualify.from + o), 0.35, 1900 + i * 150); ding(F(S.qualify.from + o + 1), 0.07, 1320 + i * 220, -0.3); });
kick(F(S.qualify.from + 56), 0.6);
ding(F(S.qualify.from + 56), 0.16, 880, 0);
riser(F(S.qualify.from + 62), F(28), 0.22);
impact(F(S.qualify.from + 90), 0.55, 0.7);
for (let i = 0; i < 7; i++) ding(F(S.qualify.from + 96 + i * 3), 0.07, 1760 * Math.pow(1.122, i), (i / 3) - 1);
whoosh(F(S.qualify.from + 140), F(22), 0.6, 300, 8000);

// 05 Creator + stack
for (let k = 0; k < 13; k++) click(F(S.creator.from + 12 + k * 2.8), 0.12 + k * 0.012, 2600 + k * 90, 0.2);
click(F(S.creator.from + 50), 0.5, 900);
ding(F(S.creator.from + 56), 0.14, 1320);
whoosh(F(S.creator.from + 56), F(26), 0.55, 6000, 150);
kick(F(S.creator.from + 88), 0.7);
kick(F(S.creator.from + 98), 0.7);
whoosh(F(S.creator.from + 104), F(16), 0.5, 5000, 200);
impact(F(S.creator.from + 120), 0.85, 0.9);
riser(F(S.creator.from + 124), F(40), 0.45);
sweepDown(F(S.creator.from + 146), F(20), 0.5);

} else {
// 02 Gates
whoosh(F(S.gates.from + 2), 0.9, 0.35, 400, 3000, -0.5);
whoosh(F(S.gates.from + 8), 0.9, 0.35, 400, 3000, 0.5);
for (let i = 0; i < 6; i++) {
  clank(F(S.gates.from + 22 + i * 7), 0.45, (i / 2.5) - 1);
  ding(F(S.gates.from + 30 + i * 7), 0.05, 1320 * Math.pow(1.06, i), (i / 2.5) - 1);
}
[22, 36].forEach((o) => click(F(S.gates.from + o), 0.25, 1800));
kick(F(S.gates.from + 66), 0.6);
ding(F(S.gates.from + 66), 0.12, 880);
riser(F(S.gates.from + 90), F(30), 0.25);
whoosh(F(S.gates.from + 112), F(22), 0.7, 300, 9000);

// 03 Four AIs
for (let i = 0; i < 4; i++) whoosh(F(S.fight.from + 2 + i * 4), 0.5, 0.18, 2000, 400, (i / 1.5) - 1);
[14, 19].forEach((o, i) => clank(F(S.fight.from + o), 0.4, i ? 0.3 : -0.3));
clank(F(S.fight.from + 24), 0.5, 0);
impact(F(S.fight.from + 24), 1.1, 1.1);
for (let k = 0; k < 10; k++) click(F(S.fight.from + 34 + k * 9), 0.12, 2200 + (k % 3) * 400, k % 2 ? 0.5 : -0.5);
riser(F(S.fight.from + 70), F(38), 0.3);
kick(F(S.fight.from + 108), 0.7);
ding(F(S.fight.from + 108), 0.1, 1100);
whoosh(F(S.fight.from + 140), F(22), 0.6, 300, 8000);

// 04 The Pit
for (let i = 0; i < 6; i++) { click(F(S.pit.from + 12 + i * 15), 0.28, 2400 + (i % 3) * 300, 0.4); ding(F(S.pit.from + 13 + i * 15), 0.04, 1760, 0.4); }
[42, 86].forEach((o) => { whoosh(F(S.pit.from + o), F(16), 0.35, 800, 5000, -0.4); click(F(S.pit.from + o + 16), 0.35, 1500, -0.4); });
kick(F(S.pit.from + 100), 0.7);
impact(F(S.pit.from + 112), 0.55, 0.7);
click(F(S.pit.from + 120), 0.5, 900);
whoosh(F(S.pit.from + 140), F(22), 0.6, 300, 8000);

// 05 Build the next challenger
crowd(F(S.ring.from), F(S.ring.dur + 10), 0.5);
whoosh(F(S.ring.from + 2), 1.1, 0.4, 5000, 300);
click(F(S.ring.from + 20), 0.25, 1600);
[58, 70].forEach((o) => { sweepDown(F(S.ring.from + o - 10), F(12), 0.3); impact(F(S.ring.from + o + 2), 0.45, 0.5); ding(F(S.ring.from + o + 2), 0.1, 1320); });
riser(F(S.ring.from + 100), F(30), 0.3);
whoosh(F(S.ring.from + 128), F(22), 0.6, 300, 8000);

// 06 Economy
for (let i = 0; i < 4; i++) { click(F(S.econ.from + 16 + i * 12), 0.3, 1800 + i * 200); ding(F(S.econ.from + 18 + i * 12), 0.08, 880 * Math.pow(1.26, i)); }
kick(F(S.econ.from + 64), 0.6);
riser(F(S.econ.from + 96), F(54), 0.45);
sweepDown(F(S.econ.from + 132), F(20), 0.5);
}

// 06 Finale
rumble(F(S.finale.from + 2), F(40), 0.7);
whoosh(F(S.finale.from + 12), F(26), 0.35, 300, 4000, -0.7);
whoosh(F(S.finale.from + 14), F(26), 0.35, 300, 4000, 0.7);
impact(F(S.finale.from + 40), 1.35, 1.8);
ding(F(S.finale.from + 40), 0.12, 660);
click(F(S.finale.from + 46), 0.2, 1400);
click(F(S.finale.from + 72), 0.14, 2200);
click(F(S.finale.from + 96), 0.12, 2600);
ding(F(S.finale.from + 114), 0.1, 1320);
impact(F(S.finale.from + 120), 0.35, 0.8);

// ─── Reverb bus (Schroeder) ────────────────────────────────
const reverb = (inp, spread) => {
  const out = new Float32Array(LEN);
  const combs = [1557, 1617, 1491, 1422, 1277, 1356].map((d) => ({buf: new Float32Array(d + spread), i: 0, fb: 0.84, lp: 0}));
  const aps = [556, 441, 341].map((d) => ({buf: new Float32Array(d + spread), i: 0}));
  for (let n = 0; n < LEN; n++) {
    let s = 0;
    for (const c of combs) {
      const y = c.buf[c.i];
      c.lp = y * 0.7 + c.lp * 0.3;
      c.buf[c.i] = inp[n] + c.lp * c.fb;
      c.i = (c.i + 1) % c.buf.length;
      s += y;
    }
    s /= combs.length;
    for (const a of aps) {
      const y = a.buf[a.i];
      const v = -s + y;
      a.buf[a.i] = s + y * 0.5;
      a.i = (a.i + 1) % a.buf.length;
      s = v;
    }
    out[n] = s;
  }
  return out;
};
const rl = reverb(verbL, 0);
const rr = reverb(verbR, 23);

// ─── Master ────────────────────────────────────────────────
let peak = 0;
for (let i = 0; i < LEN; i++) {
  const t = i / SR;
  const fade = t > tl.duration / FPS - 0.6 ? Math.max(0, (tl.duration / FPS - t) / 0.6) : 1;
  L[i] = Math.tanh((L[i] + rl[i] * 0.9) * 1.1) * fade;
  R[i] = Math.tanh((R[i] + rr[i] * 0.9) * 1.1) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / peak;

const buf = Buffer.alloc(44 + LEN * 4);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + LEN * 4, 4);
buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(LEN * 4, 40);
for (let i = 0; i < LEN; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
}
const outPath = path.join(here, CALM ? '../public/stonkarena-clean-score.wav' : PROJECT === 'arena' ? '../public/stonkarena-score.wav' : '../public/topblast-score.wav');
fs.writeFileSync(outPath, buf);
console.log(`wrote ${outPath} (${(LEN / SR).toFixed(2)}s, peak ${peak.toFixed(3)})`);
