// Synthesises the TopBlast score + sound design, frame-locked to the video timeline.
// Output: public/topblast-score.wav (44.1kHz, 16-bit stereo). No samples needed.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
// `node make-audio.mjs` → TopBlast score; `node make-audio.mjs arena` → Stonk Arena score.
// `arena-clean` → the calmer Stonk Arena mix (same cues, softer hits).
// `topblast-clean` → the calmer TopBlast mix.
// `topblast-premium` → the premium cut: pulse, ticks, data routing, two impacts.
const V2 = process.argv[2] === 'topblast-v2';
const ODTE = process.argv[2] === 'odte';
const ODTEX = process.argv[2] === 'odte-explainer';
const IPO = process.argv[2] === 'ipo';
const IPOH = process.argv[2] === 'ipo-hype';
const PREMIUM = process.argv[2] === 'topblast-premium' || V2 || ODTEX || IPO;
const CALM = process.argv[2] === 'arena-clean' || process.argv[2] === 'topblast-clean' || PREMIUM;
const PROJECT = process.argv[2] === 'arena' || process.argv[2] === 'arena-clean' ? 'arena' : 'topblast';
const K = CALM
  ? {impact: 0.35, whoosh: 0.4, riser: 0.35, rumble: 0, crowd: 0.35, clank: 0.35, kick: 0.6, sweep: 0.4}
  : {impact: 1, whoosh: 1, riser: 1, rumble: 1, crowd: 1, clank: 1, kick: 1, sweep: 1};
const tlPath = IPOH ? '../src/ipo/hype-timeline.json' : IPO ? '../src/ipo/timeline.json' : ODTEX ? '../src/odte/explainer/timeline.json' : ODTE ? '../src/odte/timeline.json' : V2 ? '../src/v2/timeline.json' : PREMIUM ? '../src/premium/timeline.json' : PROJECT === 'arena' ? '../src/arena/timeline.json' : '../src/timeline.json';
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
  const impactT = F(S.finale.from + (IPO ? 24 : ODTEX ? 10 : V2 ? 120 : PREMIUM ? 64 : 40));
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
    const g = (PREMIUM ? 0.04 : 0.055) * intro * out * duck[i] * (t > impactT ? 1.5 : 1);
    L[i] += fl(sl, cut, 0.5).lp * g;
    R[i] += fr(sr, cut, 0.5).lp * g;
  }
}

if (IPOH) {
// ─── IPO hype: sleek, confident, not aggressive ───────────
const beat = 15; // 120 bpm
for (let fr = 6; fr < S.finale.from + 70; fr += beat) {
  const n = Math.round((fr - 6) / beat);
  kick(F(fr), n % 4 === 0 ? 0.55 : 0.4);
  hat(F(fr + beat / 2), 0.05, n % 2 ? 0.35 : -0.35);
}
impact(F(2), 0.55, 0.9);                          // IPO wordmark
click(F(16), 0.14, 2200);
click(F(34), 0.1, 2600);
Object.values(S).slice(1).forEach((sc) => { whoosh(F(sc.from - 4), 0.45, 0.22, 600, 6000); click(F(sc.from + 6), 0.12, 2400); });
[6, 20, 34].forEach((o) => click(F(S.what.from + o), 0.1, 2000));
for (let k = 0; k < 26; k++) click(F(S.how.from + 30 + k * 1.3), 0.03, 3600 + (k % 4) * 150, -0.5);   // form typing
whoosh(F(S.how.from + 72), 1.1, 0.12, 400, 3000, -0.1);                                            // raise filling
ding(F(S.how.from + 106), 0.05, 1320);
[112, 118, 124].forEach((o, k) => click(F(S.how.from + o), 0.1, 1800 + k * 250, 0.3));           // 70 / 20 / 10
for (let k = 0; k < 9; k++) click(F(S.how.from + 132 + k * 3), 0.05, 1500 * Math.pow(1.08, k), 0.5); // candles
[6, 20, 36].forEach((o) => click(F(S.why.from + o), 0.1, 2000));
for (let k = 0; k < 10; k++) click(F(S.pumpios.from + 10 + k * 4), 0.05, 3000 + k * 60, 0.4);   // counter
[8, 12, 16].forEach((o, i) => whoosh(F(S.pumpios.from + o), 0.3, 0.12, 2000, 500, (i - 1) * 0.6));
riser(F(S.finale.from - 40), F(40), 0.18);
impact(F(S.finale.from + 8), 0.8, 1.2);           // closer
ding(F(S.finale.from + 58), 0.08, 1320);
ding(F(S.finale.from + 60), 0.05, 1980);
} else if (ODTE) {
// ─── 0DTE 5s: clean ───────────────────────────────────────
add(0, SR * 1.2, (x) => Math.sin(2 * Math.PI * 41.2 * x) * Math.min(1, x / 0.6) * 0.3, {gain: 0.6, verb: 0});
whoosh(F(1), F(16), 0.55, 600, 9000);           // blade draws
impact(F(22), 0.9, 1.3);                        // mark lands
kick(F(22), 0.9);
for (let fr = 52; fr < 145; fr += 15) kick(F(fr), 0.55);   // steady pulse
for (let fr = 59; fr < 145; fr += 15) hat(F(fr), 0.06);
click(F(48), 0.25, 2200);
ding(F(78), 0.1, 1320);
ding(F(80), 0.06, 1980);
whoosh(F(96), F(22), 0.2, 3000, 9000);          // light sweep
} else if (PREMIUM) {
// ─── Premium arrangement ───────────────────────────────────
// Soft sub "heartbeat", tiny digital ticks, filtered data-routing texture.
const sub = (t, g = 0.3, hz = 44) =>
  add(t, SR * 0.9, (x) => Math.sin(2 * Math.PI * hz * x + 2 * Math.exp(-18 * x)) * Math.min(1, x * 200) * Math.exp(-5 * x), {gain: g, verb: 0.02});
const tick = (t, g = 0.08, hz = 3400, pan = 0) =>
  add(t, SR * 0.03, (x) => Math.sin(2 * Math.PI * hz * x) * Math.exp(-160 * x), {gain: g, pan, verb: 0.2});
const route = (t, dur, g = 0.12, pan = 0, base = 1400) => {
  // soft data routing: band-limited air + sparse pitched blips moving upward
  const f1 = svf();
  add(t, SR * dur, (x) => {
    const u = x / dur;
    return f1(rnd(), base + 2600 * u, 2.5).bp * Math.sin(Math.PI * u) * 0.9;
  }, {gain: g, pan, verb: 0.45});
  const n = Math.floor(dur * 9);
  for (let k = 0; k < n; k++) {
    const hz = base * Math.pow(2, ((k * 5) % 12) / 12) * (k % 3 ? 1 : 2);
    add(t + (k / n) * dur, SR * 0.09, (x) => Math.sin(2 * Math.PI * hz * x) * Math.exp(-45 * x), {gain: g * 0.35, pan: pan + ((k % 2) - 0.5) * 0.3, verb: 0.5});
  }
};
const swell = (t, dur, g = 0.25) => {
  const f1 = svf();
  add(t, SR * dur, (x) => {
    const u = x / dur;
    return f1(rnd(), 200 + 1200 * u, 0.9).lp * Math.sin(Math.PI * u) ** 2;
  }, {gain: g, verb: 0.6});
};
const glide = (t, dur, g = 0.08, from = 220, to = 880) => {
  let ph = 0;
  add(t, SR * dur, (x) => {
    const u = x / dur;
    ph += (2 * Math.PI * from * Math.pow(to / from, u * u)) / SR;
    return Math.sin(ph) * Math.sin(Math.PI * u) * (0.7 + 0.3 * Math.sin(ph * 0.5));
  }, {gain: g, verb: 0.6});
};

// low-end pulse (75 bpm), resting under the final hold
for (let fr = 12; fr < S.finale.from + (V2 ? 116 : 60); fr += 24) sub(F(fr), fr < (S.entry ? S.entry.from : S.game ? S.game.from : S.ways.from) ? 0.16 : 0.22);

if (IPO) {
// 01 Initial Pump Offering
route(F(4), 1.3, 0.1, 0, 900);                       // rising line
glide(F(4), 1.3, 0.05, 220, 660);
impact(F(20), 1.1, 1.1);                              // IPO wordmark
sub(F(20), 0.35, 40);
tick(F(62), 0.06, 2400);
tick(F(78), 0.07, 2600);
[84, 94].forEach((o) => tick(F(o), 0.09, 2000));
tick(F(110), 0.05, 3000);

// 02 Two ways
const W2 = S.ways.from;
tick(F(W2 + 8), 0.08, 2200);
[30, 42].forEach((o, i) => sub(F(W2 + o), 0.18, 48 - i * 4));
tick(F(W2 + 70), 0.09, 1800, -0.4);
route(F(W2 + 70), 0.7, 0.08, -0.4, 1600);
tick(F(W2 + 128), 0.09, 1800, 0.4);
route(F(W2 + 128), 0.7, 0.08, 0.4, 1600);
tick(F(W2 + 192), 0.08, 2400);

// 03 Terms
const T3 = S.terms.from;
[14, 46, 78].forEach((o, i) => { tick(F(T3 + o), 0.1, 1800 + i * 300); ding(F(T3 + o + 6), 0.04, 1320 * Math.pow(1.26, i)); });
for (let k = 0; k < 3; k++) tick(F(T3 + 120 + k * 23), 0.08, 2200 + k * 200);
sub(F(T3 + 190), 0.28, 44);
tick(F(T3 + 190), 0.1, 1500);

// 04 Pumpios
const P4 = S.pumpios.from;
[14, 21, 28].forEach((o, i) => { sub(F(P4 + o), 0.14, 50); tick(F(P4 + o), 0.06, 2000 + i * 250); });
tick(F(P4 + 70), 0.1, 1600);
ding(F(P4 + 72), 0.07, 1320);

// 05 End
const E5 = S.finale.from;
route(F(E5 + 10), 1.6, 0.1, 0.4, 900);
glide(F(E5 + 10), 1.6, 0.05, 220, 660);
impact(F(E5 + 24), 1.4, 1.5);
sub(F(E5 + 24), 0.4, 34);
[8, 16, 40, 70].forEach((o) => tick(F(E5 + o), 0.06, 2400));
} else if (ODTEX) {
// 01 Promise
route(F(4), 0.6, 0.08, 0, 2200);
tick(F(14), 0.07, 2600);
glide(F(14), 1.0, 0.05, 330, 660);
tick(F(34), 0.08, 2200);
tick(F(56), 0.06, 2600);

// 02 Game board
const GB = S.game.from;
for (let k = 0; k < 9; k++) tick(F(GB + 4 + k * 2.5), 0.04, 2400 + k * 90, -0.5);
[8, 84, 154, 214, 340].forEach((o) => tick(F(GB + o), 0.07, 2600));
route(F(GB + 112), 0.75, 0.13, -0.2, 1400);          // 1 token sent
tick(F(GB + 132), 0.1, 1800, -0.4);
ding(F(GB + 132), 0.05, 1760, -0.4);
[140, 156, 172].forEach((o, i) => { tick(F(GB + o), 0.08, 2000 + i * 250, 0.4); });
route(F(GB + 214), 0.5, 0.08, 0.2, 900);             // duplicate attempt
add(F(GB + 236), SR * 0.28, (x) => (Math.sin(2 * Math.PI * 150 * x) + 0.5 * Math.sin(2 * Math.PI * 225 * x)) * Math.exp(-9 * x), {gain: 0.18, pan: 0.3, verb: 0.2});
sub(F(GB + 250), 0.3, 44);                            // entries lock
tick(F(GB + 250), 0.1, 1400);
for (let k = 0; k < 8; k++) tick(F(GB + 340 + k * 12), 0.035, 3000, 0.4);   // chart running
glide(F(GB + 380), 1.9, 0.04, 220, 440);
impact(F(GB + 440), 1.1, 0.9);                        // the close
sub(F(GB + 440), 0.4, 38);
ding(F(GB + 446), 0.09, 1320);
ding(F(GB + 450), 0.06, 1980);

// 03 Payout
const PO = S.payout.from;
route(F(PO), 1.2, 0.12, -0.6, 1100);
tick(F(PO + 6), 0.07, 2600);
route(F(PO + 44), 1.4, 0.13, 0, 1500);
for (let k = 0; k < 5; k++) ding(F(PO + 70 + k * 5), 0.06, 1320 * Math.pow(1.122, k), (k / 2) - 1);
tick(F(PO + 60), 0.06, 2400);

// 04 End
const EN = S.finale.from;
glide(F(EN + 2), 1.2, 0.06, 110, 440);
impact(F(EN + 10), 1.3, 1.5);
sub(F(EN + 10), 0.4, 34);
[28, 48].forEach((o) => tick(F(EN + o), 0.06, 2400));
ding(F(EN + 62), 0.07, 1320);
} else if (V2) {
// 01 Hook — say what it is
tick(F(4), 0.06, 2600);
glide(F(6), 0.9, 0.04, 330, 660);
tick(F(12), 0.08, 2200);
tick(F(28), 0.07, 2600);
route(F(64), 1.1, 0.1, -0.5, 1100);
route(F(66), 1.1, 0.1, 0.5, 1300);
tick(F(72), 0.07, 3000);
[74, 88].forEach((o) => tick(F(o), 0.07, 2600));
tick(F(104), 0.05, 3400);
route(F(126), 0.8, 0.07, 0, 900);

// 02 Entry line → Blast Zone
const E = S.entry.from;
for (let k = 0; k < 5; k++) tick(F(E + k * 4), 0.05, 3000 - k * 150);
tick(F(E + 40), 0.12, 1800);
glide(F(E + 40), 0.4, 0.05, 880, 1320);
for (let k = 0; k < 6; k++) tick(F(E + 44 + k * 3), 0.05, 3600, 0.3);
tick(F(E + 54), 0.06, 2600);
[90, 110].forEach((o) => tick(F(E + o), 0.07, 1500));
impact(F(E + 124), 1.0, 0.7);
sub(F(E + 124), 0.35, 38);
tick(F(E + 162), 0.07, 1300);
for (let k = 0; k < 17; k++) tick(F(E + 136 + k / 0.9), 0.035, 4200, 0.2);
swell(F(E + 176), 3.0, 0.3);
glide(F(E + 206), 1.4, 0.05, 220, 440);
tick(F(E + 228), 0.06, 2400);

// 03 Funded rewards
const R = S.rewards.from;
for (let k = 0; k < 7; k++) tick(F(R + 12 + k * 3), 0.05, 2600 + k * 120, (k / 3) - 1);
tick(F(R + 14), 0.07, 2600);
route(F(R + 34), 1.4, 0.13, -0.3, 1500);
route(F(R + 40), 1.4, 0.13, 0.3, 1700);
for (let k = 0; k < 5; k++) tick(F(R + 60 + k * 5), 0.08, 1760 * Math.pow(1.12, k), (k / 2) - 1);

// 04 Creator split
const CR = S.creator.from;
tick(F(CR + 4), 0.07, 2600);
for (let k = 0; k < 12; k++) tick(F(CR + 22 + k * 3), 0.045, 3000 + k * 60, 0.4);
tick(F(CR + 60), 0.08, 1800);
ding(F(CR + 60), 0.05, 1320);

// 05 Architecture
const ST = S.stack.from;
sub(F(ST + 6), 0.2, 48);
route(F(ST + 20), 0.9, 0.08, 0, 700);
sub(F(ST + 46), 0.26, 44);
[30, 40].forEach((o) => tick(F(ST + o), 0.05, 2200));
route(F(ST + 44), 1.0, 0.09, 0, 1400);
[52, 64].forEach((o) => tick(F(ST + o), 0.07, 2600));

// 06 $TOPBLAST loop
const L = S.loop.from;
route(F(L), 1.2, 0.13, -0.6, 1000);
[16, 40, 62].forEach((o, i) => { tick(F(L + o), 0.1, 1600 + i * 300); sub(F(L + o), 0.16 + i * 0.05, 50 - i * 4); });
{
  const fb = svf();
  add(F(L + 64), SR * F(96), (x) => {
    const u = x / F(96);
    return fb(rnd(), 160 + 60 * Math.sin(x * 3), 1.4).lp * Math.sin(Math.PI * Math.min(1, u * 1.2)) * 0.9;
  }, {gain: 0.22, pan: 0.3, verb: 0.3});
}
for (let k = 0; k < 22; k++) tick(F(L + 72 + k * 4.2), 0.03, 900 + (k % 5) * 70, 0.45);
tick(F(L + 92), 0.08, 2400);
sub(F(L + 92), 0.24, 42);
tick(F(L + 104), 0.08, 2400);

// 07 System → mark
const M = S.finale.from;
for (let k = 0; k < 4; k++) tick(F(M + 4 + k * 10), 0.06, 2000 + k * 250);
route(F(M + 40), 1.0, 0.08, 0, 1200);
route(F(M + 72), 0.9, 0.09, 0, 700);
tick(F(M + 88), 0.06, 1800);
glide(F(M + 92), 0.95, 0.07, 110, 440);
impact(F(M + 120), 1.5, 1.6);
sub(F(M + 120), 0.4, 34);
[134, 142, 156, 170].forEach((o) => tick(F(M + o), 0.05, 2400));
} else {

// 01 Opening
tick(F(8), 0.06, 2600);
tick(F(22), 0.05, 3000);
route(F(34), 1.0, 0.07, 0, 2200);          // razor line drawing
for (let k = 0; k < 8; k++) tick(F(54 + k * 3.2), 0.05, 2400 + k * 180);   // icon boot
glide(F(56), 0.9, 0.05, 330, 660);
route(F(78), 0.7, 0.08, 0, 900);           // line extends

// 02 Venues → layer
const V = S.venue.from;
[18, 22].forEach((o, i) => tick(F(V + o), 0.08, 2000, i ? 0.5 : -0.5));
route(F(V + 32), 2.4, 0.12, -0.5, 1100);
route(F(V + 36), 2.4, 0.12, 0.5, 1300);
tick(F(V + 24), 0.07, 2800);
tick(F(V + 74), 0.08, 2800);
sub(F(V + 58), 0.2, 52);

// 03 Entry line → Blast Zone
const E = S.entry.from;
for (let k = 0; k < 5; k++) tick(F(E + k * 4), 0.05, 3000 - k * 150);   // grid drawing
tick(F(E + 50), 0.12, 1800);               // verified buy
glide(F(E + 50), 0.4, 0.05, 880, 1320);
for (let k = 0; k < 6; k++) tick(F(E + 54 + k * 3), 0.05, 3600, 0.3);  // line locking
[100, 118].forEach((o) => tick(F(E + o), 0.07, 1500));
impact(F(E + 130), 1.0, 0.7);              // price crosses the entry line (softened by K)
sub(F(E + 130), 0.35, 38);
for (let k = 0; k < 17; k++) tick(F(E + 140 + k / 0.9), 0.035, 4200, 0.2); // typing
swell(F(E + 160), 3.0, 0.3);               // pull-back
glide(F(E + 188), 1.4, 0.05, 220, 440);
tick(F(E + 214), 0.06, 2400);

// 04 Reward engine
const R = S.rewards.from;
for (let k = 0; k < 7; k++) tick(F(R + 12 + k * 3), 0.05, 2600 + k * 120, (k / 3) - 1);
route(F(R + 34), 1.4, 0.13, -0.3, 1500);
route(F(R + 40), 1.4, 0.13, 0.3, 1700);
for (let k = 0; k < 5; k++) tick(F(R + 60 + k * 5), 0.08, 1760 * Math.pow(1.12, k), (k / 2) - 1);
for (let k = 0; k < 10; k++) tick(F(R + 98 + k * 3), 0.045, 3000 + k * 60, 0.5);  // slider
tick(F(R + 96), 0.07, 2800);
route(F(R + 126), 0.8, 0.08, 0, 700);      // zoom-out

// 05 Architecture
const A2 = S.stack.from;
sub(F(A2 + 18), 0.2, 48);
sub(F(A2 + 26), 0.18, 44);
[26, 32, 38].forEach((o) => tick(F(A2 + o), 0.05, 2200));
route(F(A2 + 60), 0.8, 0.07, 0, 1200);
tick(F(A2 + 70), 0.07, 2600);
tick(F(A2 + 80), 0.07, 2600);

// 06 Native token
const T = S.token.from;
tick(F(T + 4), 0.07, 2600);
for (let k = 0; k < 14; k++) tick(F(T + 8 + k * 2.4), 0.035, 3200 + k * 40, -0.4);   // 0 → 100%
route(F(T + 20), 0.9, 0.09, -0.4, 1000);                                               // revenue → buybacks
sub(F(T + 22), 0.2, 46);
for (let k = 0; k < 13; k++) tick(F(T + 26 + k * 4), 0.04, 2200, 0.4);                 // cycle clock
glide(F(T + 26), 1.7, 0.04, 220, 330);
ding(F(T + 78), 0.07, 1320, 0.4);                                                       // xSOL paid out
route(F(T + 78), 0.8, 0.1, 0.4, 1600);
sub(F(T + 78), 0.22, 50);

// 07 Mark
const M = S.finale.from;
route(F(M), 1.2, 0.12, -0.7, 1100);
route(F(M + 2), 1.2, 0.12, 0.7, 1300);
tick(F(M + 26), 0.08, 1800);
glide(F(M + 34), 1.0, 0.07, 110, 440);     // illumination rising
impact(F(M + 64), 1.5, 1.6);               // the one deeper impact
sub(F(M + 64), 0.4, 34);
tick(F(M + 82), 0.05, 2400);
tick(F(M + 90), 0.05, 2400);

}
} else {
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

}

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
const outPath = path.join(here, IPOH ? '../public/ipo-hype-score.wav' : IPO ? '../public/ipo-score.wav' : ODTEX ? '../public/odte-explainer-score.wav' : ODTE ? '../public/odte-score.wav' : V2 ? '../public/topblast-v2-score.wav' : PREMIUM ? '../public/topblast-premium-score.wav' : CALM ? `../public/${PROJECT === 'arena' ? 'stonkarena' : 'topblast'}-clean-score.wav` : PROJECT === 'arena' ? '../public/stonkarena-score.wav' : '../public/topblast-score.wav');
fs.writeFileSync(outPath, buf);
console.log(`wrote ${outPath} (${(LEN / SR).toFixed(2)}s, peak ${peak.toFixed(3)})`);
