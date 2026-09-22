# TopBlast — Launch Film

A 28-second, 1920×1080 @ 30fps launch video for **TopBlast**, built in code with
[Remotion](https://remotion.dev). The score and sound design are produced by a script and locked to the same
frame timeline as the picture.

**LAUNCH ANYWHERE. REWARD THE BLAST ZONE.**
StonkFun + Pump.fun underneath. TopBlast on top.

Rendered output: `out/topblast-launch.mp4`

## Sequence

| Time | Scene | What happens |
|---|---|---|
| 0–3s | Intro | Particles rise, *TOKEN LAUNCHING EVOLVED.* compresses into a glowing line, and the orange arrow punches through it |
| 3–7s | Rails | StonkFun (blue) and Pump.fun (green) rails speed into the central TopBlast engine. *YOUR TOKEN. YOUR VENUE. TOPBLAST ON TOP.* |
| 7–12s | Blast Zone | A glass trading terminal shows a verified entry at 100 that locks the line. Price moves 100 → 92 → 81 → 70, the zone under the line fills with energy, and **BLAST ZONE** slams in. *YOUR ENTRY SETS THE LINE.* |
| 12–17s | Qualify | VERIFIED BUY → BELOW ENTRY → STILL HOLDING → BLAST ZONE. The funded pool fills, then splits to the eligible wallets. *FUNDED FIRST. REWARDED SECOND.* |
| 17–22s | Creator + Stack | On a warm off-white control panel the creator raises the reward allocation (80% of their 90% share = 72% rewards / 18% creator / 10% protocol) and funds the pool. The camera pulls back to the stack: TOKEN → STONKFUN + PUMP.FUN → TOPBLAST, which drops in *on top* |
| 22–28s | Finale | Everything collapses to the center, the mark launches, blue and green energy feed in, orange erupts, and the wordmark, taglines and URL resolve |

Scenes hand off through camera moves: the camera flies through the lens, collapses to a point, or flashes on impact. There are no slide cuts.

## Commands

```bash
npm install
npm run studio          # live preview / scrub timeline
npm run render          # regenerates audio, then renders out/topblast-launch.mp4
npm run audio           # regenerate public/topblast-score.wav only
```

On machines with a pre-installed headless Chromium, set `REMOTION_BROWSER=/path/to/headless_shell`.

## Structure

```
src/timeline.json        scene start frames — shared by the video AND the audio script
src/TopBlastLaunch.tsx   main composition (scene sequencing + transitions + audio)
src/scenes/*.tsx         Intro, Rails, Chart, Qualify, Creator, Finale
src/components/          particles, grid floor, film grain, logo, kinetic type, SceneShell
src/theme.ts             brand colours, fonts, easing helpers
scripts/make-audio.mjs   synthesised score: pad, 120bpm pulse, whooshes, UI clicks, impacts, ignition
public/logo.png          supplied TopBlast mark (cropped)
```

## Editing

- **Copy:** each scene's text is written inline in `src/scenes/*.tsx`.
- **Timing:** move a scene in `src/timeline.json`. The audio cues follow it automatically after `npm run audio`.
- **Colours:** `src/theme.ts` (TopBlast orange/red, StonkFun blue, Pump.fun green, warm off-white).
- **Vertical cut (9:16):** change `width`/`height` in `timeline.json`. Layouts are tuned for 16:9, so each scene needs repositioning for vertical.
