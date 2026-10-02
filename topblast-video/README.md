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

### Clean cut

`TopBlastClean` has the same film with the spectacle turned down. There are no flashes, shockwaves, sparks, screen shake or light rays, and fewer particles with softer glow. Scenes change with gentle fades, and the mix is softer.
Render: `npm run render:clean` → `out/topblast-clean.mp4`

### Premium cut

`TopBlastPremium` (`src/premium/`, 32s) is the calm version pushed toward a premium product film. It tells one continuous story:
the opening line becomes the TopBlast layer, the layer becomes the chart, the entry line locks at $100 ($112 → $104 → $96),
the UI below the line changes state, the camera pulls back to reveal the Blast Zone, the zone becomes the reward network
(funded pool → eligible wallets, creator split), which pulls back into the three-layer stack, then the native token beat (100% of launchpad revenue → buybacks;
xSOL paid to the Blast Zone every 15 minutes), then the mark,
lit from the bottom up by StonkFun blue and Pump.fun green. The score is a low pulse, ticks and data-routing texture,
a small hit when the price crosses the line and one deeper hit on the mark.
Render: `npm run render:premium` → `out/topblast-premium.mp4`

### v2: clear in 5 seconds + $TOPBLAST loop

`TopBlastV2` (`src/v2/`, ~36.5s) opens with what TopBlast is: LAUNCH WITH TOPBLAST, holders rewarded through the Blast Zone,
StonkFun / Pump.fun as launch rails, and the protocol revenue → $TOPBLAST buyback + burn loop. It then walks through
BUY → ENTRY LINE → BELOW ENTRY → BLAST ZONE → REWARDS with a step tracker ($100 entry; $112 → $105 → $98 → $82),
the creator split, the architecture (venues underneath, TopBlast above), the $TOPBLAST loop (protocol revenue → buy → burn, supply
shrinking), and the whole system collapsing into the mark.
Render: `npm run render:v2` → `out/topblast-v2.mp4`
The "100% of protocol revenue buys back + burns $TOPBLAST" claim appears in `src/v2/Hook.tsx`, `src/v2/Loop.tsx` and `src/v2/Finale.tsx`.

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

---

# Stonk Arena — Launch Film

A second composition, `StonkArena`, in the same project: 28 seconds at 1920×1080, in black, white and neon lime.

**STONK ARENA — ENTER THE ARENA. OUTTRADE THE FIELD.**

Rendered output: `out/stonkarena-launch.mp4` · Render: `npm run render:arena`

| Time | Scene | What happens |
|---|---|---|
| 0–3s | Intro | *THE MARKET HAS A NEW ARENA.* compresses into a blade of light, and the white/lime helmet crest slashes through it |
| 3–7s | Gates | Colosseum façade. Each gate lifts to reveal a tokenized stock (AAPLx, TSLAx, NVDAx, AMZNx, MSFTx, GOOGLx). *REAL STOCKS. TOKENIZED. ONE ARENA.* |
| 7–12s | Fight | AGENT ALPHA vs AGENT OMEGA. The VS slams in and their P&L lines race on a live NVDAx match. *AGENT VS AGENT.* |
| 12–17s | Leaderboard | A live leaderboard reshuffles twice and the leader takes the crown. *CLIMB THE RANKS. TAKE THE CROWN.* |
| 17–22s | Arena | Pull back to the full 3D colosseum with tickers orbiting the floor and crowd flashes on the rim. *THE ARENA IS OPEN.* |
| 22–28s | Finale | The helmet logo rises, white and lime energy converge, lime erupts, and the wordmark, taglines and STONKARENA.XYZ resolve |

Files: `src/arena/` (scenes, theme, timeline), `public/arena-logo.png`, score generated by `npm run audio:arena`.
Agent names, P&L values and prices are illustrative placeholders.

### Clean cut

`StonkArenaClean` has the same story and copy with the spectacle turned down. There are no flashes, shockwaves, sparks or light rays, and fewer particles with softer glow. Scenes change with gentle fades instead of fly-throughs, and the mix is softer. It's switched on with the `Calm` context in `src/components/calm.ts`.
Render: `npm run render:arena-clean` → `out/stonkarena-clean.mp4`
