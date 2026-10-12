---
name: motion-video
description: Produce high-quality motion graphic explainer videos (9:16 reels) from written reference content using Remotion. Two styles: cinematic motion-graphics and pixel-art RPG quest videos. Covers story extraction, VO-first timing, kinetic typography, scene systems, sound design, and render. Optional ManimGX for true-3D inserts. Use when the user asks for a motion graphic or explainer video from a blog post, article, or any reference content.
---

# Motion Video Skill

9:16 narrated reels. 1080x1920, 30fps, 45–75 seconds. Two visual styles, one workflow, zero paid APIs.

**Start here:** copy `template/` (cinematic) or `template-rpg/` (pixel quest) — never from blank.

## 0. Rules

- **No API keys.** Not for TTS, not for SFX, not for anything. If a researched repo demands a key ("vikey" or otherwise), route around it: local TTS, numpy/ffmpeg-synthesized audio, bundled fonts.
- **Facts come from the source.** List every claim with its source before building. Never invent numbers.
- **One promise, three points max.** 6–8 beats per video.
- **VO in English** unless the user says otherwise. Write it spoken: "fifty RLO", "rialo dot io" — never "DeFi", never abbreviations the voice will mangle.
- **Anti-slop:** no linear easing, no opacity-only fades, no simultaneous entrances. Stagger everything. One hero color per frame. No generic gradients or particle soup. Every element earns its entrance; every cut is motivated.

## 1. Story before code

1. Read the reference. Pull out: hook (one uncomfortable truth), problem, mechanism, payoff (concrete outcomes), CTA.
2. Write the VO script, ~140–150 wpm, short sentences.
3. `tts speak --voice avocado_v2:MAI_03 --output vo/s1.mp3 --text "..."` — one file per beat, then `ffprobe` each duration.
4. Scene length = `voDelay + voFrames + tailPad` (30–60f). `voDelay` = frame the first word lands.

## 2. Style A — cinematic

Steal the brand's real tokens from their site CSS into `theme.ts` (bg, text, accent, borders). Bundle the fonts (`scripts/fonts.sh`).

Each scene needs:

- **A bespoke object, not a card.** Build the story's thing: a control room, a radar, a pipeline, a vault, a stepper. A scene that's only kinetic type on a background isn't finished.
- **A camera punch on the cut** (`Punch` in `components/fx.tsx`). Static camera reads cheap.
- **Scramble text** for onchain-flavored lines — deterministic seed, never `Math.random()`.
- **Two state colors** (hero vs danger). State changes show in color, not just words.
- **Panel chrome** (`Panel`): hairline border, mono header row with a live status.
- **A kicker**: `001 — THE PROBLEM`.
- **Exit choreography** (`SceneShell`): last 12 frames scale up, lift, blur, fade. Entrances are `Punch` + rise + deblur.

Cuts: `Whip` overlay on every boundary (20 frames, the cut lands at local frame 8). Sound: `riser.mp3` starts ~1s before the cut, `whoosh` lands on it, `impact.mp3` hits when the headline lands, `thump.mp3` on slam moments. All in `scripts/sfx.py`. Bed 18–20 dB under the VO (≈ −38 LUFS, ebur128-verified). Every SFX lands 0–2 frames *before* its visual — never after.

## 3. Style B — pixel-art RPG quest

The explainer becomes a quest. The viewer is the player; facts arrive as game events: dialogue, quest log, checklists, rewards.

**Systems** (`template-rpg/src/components/rpg.tsx`):

- `DialogueBox` — name plate, portrait, typewriter (~1.1 chars/frame), keyword highlights, blinking ▼. Chiptune blip every ~14 frames while typing.
- `QuestPanel` — quest log; checklist items tick in one by one + fanfare.
- `Hud` — coin count + day counter. Advance the days as the quest moves.
- `TitleCard`, `Emote` (?/!), `Walker`/`Npc`/`Px` — always `image-rendering: pixelated`.
- `Ground`/`grassMap` — tileable terrain.

**Sprites** (`scripts/gen_sprites.py`): player (front/back/side, 2-frame walk), NPCs, tiles, trees, buildings, portraits — all hand-drawn PIL string maps. Extend the maps, render a contact sheet, look at it before building scenes.

**Audio** (`scripts/chiptune.py`): blip, coin, fanfare, stamp, an 8-second music loop. **Mix by measured loudness, never by guessed volume:** `loudnorm` VO stems to −19 LUFS (true peak −1.5), sit the music bed 18–20 dB under the VO (≈ −38 LUFS), then verify on the render with `ffmpeg -af ebur128` — measure one VO segment and one music-only gap. TTS output is often whisper-quiet; a "low" volume number on a hot stem still buries the voice.

**Beat map:** TitleCard → character acting → dialogue → payoff banner. Between areas: white flash + new TitleCard.

## 4. ManimGX — 3D inserts only

ManimGX (Rust/wgpu, Manim-style Python API) does real 3D with PBR lighting — the one thing Remotion can't. Use it to render short hero moments (3–6s: intros, logo reveals), then composite the MP4 into Remotion with `<OffthreadVideo>`. Don't rebuild whole videos in it.

`uvx --python 3.14 manimgx render -qm --format mp4 scene.py` (needs Python 3.13/3.14; CPU fallback works, no GPU needed). Set `config.pixel_width/height` for 1080x1920.

Honest numbers, measured on a CPU-only box: ~25 seconds of render per 1 second of 1080x1920 3D. The win is capability, not speed — keep inserts short and render once.

## 5. Layout

```
src/index.ts        registerRoot
src/Root.tsx        Composition (1080x1920, 30fps) + FontFaces
src/Video.tsx       SCENES table [{dur, voDelay, Comp, vo}] + VO + SFX map + bed
src/theme.ts        tokens
src/components/    Background, Kinetic, fx  (A)  |  rpg.tsx  (B)
src/scenes/         one file per 1–2 scenes
public/vo/          s1..sN.mp3 + sfx mp3s
public/fonts/       via scripts/fonts.sh — never commit binaries
scripts/            sfx.py | chiptune.py, vo.sh, gen_sprites.py, fonts.sh
```

## 6. Render

```bash
npm install
npx remotion still src/index.ts <Id> /tmp/s1.png --frame <F>   # every scene, before full render
TMPDIR=~/workspace/.tmp npx remotion render src/index.ts <Id> \
  ~/workspace/your_files/<name>.mp4 --concurrency=2 --codec=h264 --crf 17
```

Stills first, always: look at each one, fix, re-render. Text never touches edges. Nothing appears without an entrance. VO and text roughly in sync. Critical content inside the middle 75% vertically. Music never drowns VO.

## 7. Before you hand it over

- [ ] Every scene checked as a still
- [ ] VO measured; tails have breathing room
- [ ] Every scene has its object (A) or its quest event (B)
- [ ] No plain cuts — whip/flash + SFX on all of them
- [ ] No frozen holds — something moves in every second
- [ ] VO at −19 LUFS; bed 18–20 dB under (ebur128-verified); SFX on the hits
- [ ] `ffprobe`: video + audio, duration as expected
