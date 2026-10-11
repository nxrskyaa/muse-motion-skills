I have everything I need. Here's the consolidated playbook:

---

# Playbook: Remotion Motion Graphics (from 3 skill repos)

Sources studied: `haidrrrry/claude-remotion-skill` (motion-patterns + design-rules references + theme template), `whaleyxbt/claude-motion` (taste SKILL + review-loop + sound-design skills, shipped effort-video), `direkturcrypto/remotion-opus-skill` (code-mode coder prompt, styles.md, font engine, ros CLI).

## 1. Apa itu Remotion & tech stack

- Remotion = React components yang di-render frame-by-frame jadi video. Setiap frame dievaluasi sebagai fungsi murni dari `frame` — **tidak ada CSS transitions/keyframes, tidak ada `Math.random()`, tidak ada `Date`** (flicker/drift saat render).
- Stack: Node ≥20.12, React 19, `remotion` + `@remotion/cli` (pinned di repo: 4.0.x, mis. 4.0.473/4.0.529). Rendering memakai Chromium headless (Remotion auto-download Chrome Headless Shell ~90MB saat first render; bisa pakai system chromium/playwright via `Config.setBrowserExecutable` / flag `--browser-executable`). Output MP4 di-mux via ffmpeg — Remotion bundle ffmpeg sendiri, tapi sistem `ffmpeg`/`ffprobe` berguna untuk cek klip & extract frames.
- Optional packages: `@remotion/google-fonts` (font loading), `@remotion/transitions` (wipe/slide), `@remotion/motion-blur` (`Trail`), `@remotion/captions` (TikTok-style captions dari Whisper timestamps).

## 2. Setup persis & render command

```bash
npm install remotion @remotion/cli react react-dom
# optional: @remotion/transitions @remotion/motion-blur @remotion/google-fonts
```

atau scaffold resmi: `npx create-video@latest`. Untuk edit footage user (captions/grade/intro di atas mp4): taruh file di `public/`, render via `<OffthreadVideo src={staticFile("clip.mp4")} />`, dan cek durasi/fps klip dulu dengan `ffprobe`.

**Config file** `remotion.config.ts` (pattern dari claude-motion):
```ts
import {Config} from '@remotion/cli/config';
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');   // kompatibel maksimal
```

**Render MP4:**
```bash
npx remotion render src/index.ts <CompId> out/video.mp4 --codec h264 --crf 17
# master untuk upload: --crf 16 (platform re-compress, kasih headroom)
# chromium error "Old Headless mode has been removed": pakai headless_shell binary
# draft cepat: remotion render ... --scale=0.5 --crf=28
```
**Preview easing di quarter speed** (`remotion studio`) — cacat easing yang tak terlihat di 1x terlihat jelas di 0.25x.

**Verify loop (wajib, bukan opsional):** render → extract frames → lihat → fix → re-render:
```bash
npx remotion still src/index.ts <CompId> out/check_15.png --frame 15 --overwrite
ffmpeg -v error -ss 1.5 -i out/video.mp4 -frames:v 1 check_1.png
```
claude-motion punya review-loop formal: `npm run sheet` bikin contact sheet 4×2 tiap timeline beat (0.3s setelah beat, saat motion sudah settle), scrub transition per-0.2s, satu full-res still untuk detail.

## 3. Struktur project

```
src/index.ts      → registerRoot(Root)
src/Root.tsx      → <Composition> / <Still> registrations (duration/fps/size)
src/theme.ts      → SATU theme object: colors, easings, spring presets, fonts
src/lib.ts        → helpers: palette C, font tokens F, prog(), sp(), rand()
src/scenes/*.tsx  → scene components (claude-motion) / satu scene file per film (opus code-mode)
src/components/*.tsx → primitives (Motion.tsx, Layers.tsx, useFonts.ts...)
public/           → assets user, di-load via staticFile()
timeline.json     → semua beat dalam detik (claude-motion: single source of truth untuk video + SFX)
```

**Komposisi** (`Root.tsx`):
```tsx
<Composition
  id="EffortVideo"
  component={EffortVideo}
  durationInFrames={Math.round(TL.duration * FPS)}
  fps={FPS} width={1080} height={1920}  // 1080×1920 Reels/Shorts, 1920×1080 landscape
/>
```

## 4. Pola kode inti

**Entrance workhorse** (fade + rise + scale — *lone fade dilarang*):
```tsx
const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
opacity: p,
transform: `translateY(${interpolate(p, [0,1], [40, 0])}px) scale(${interpolate(p, [0,1], [0.94, 1])})`
```
Atau bezier slide: `interpolate(frame, [0, 25], [60, 0], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" })` — **linear tidak pernah; clamp selalu kiri-kanan**.

**Easing canon:**
| Curve | Pakai untuk |
|---|---|
| `easeOut = bezier(0.16, 1, 0.3, 1)` | entrances, reveals, semua yang tiba |
| `easeIn = bezier(0.6, 0, 0.9, 0.35)` | exits (pergi cepat, tidak berlama-lama) |
| `easeInOut = bezier(0.65, 0, 0.35, 1)` | moves antara dua state (flip, morph) |
| overshoot `bezier(0.55, 0, 0.2, 1.12)` | value yang "landing" |

**Spring presets:** general UI `damping 14 / stiffness 140 / mass 0.8`; heavy calm `15–20 / 140–240 / 0.6–1`; pop `9–11 / 200–230 / 0.7` (callouts/badges); elastic `8 / 200` — **satu hero moment per video saja**. Spring untuk hal yang terasa fisik (UI, objek); bezier tween untuk type & camera-like moves.

**Stagger wajib:** words ~3 frame / 0.09s, chips/list items 4–5 frame / 0.2–0.25s, rings/dots ~0.06s. Tidak ada yang masuk bersamaan.

**Exit:** lebih cepat dari entrance (~10 vs ~20 frame; 0.35–0.55s vs 0.7–1.25s), pakai `easeIn`.

**Helpers ala claude-motion:**
```ts
prog(t, t0, t1, ease)     // tween pure function dari frame
band(x, a, b)             // smoothstep 0..1 — derive satu animasi dari value lain
sp(frame, startSec, cfg)  // spring wrapper dengan timeline detik
rand(n)                   // deterministic pseudo-random (bukan Math.random!)
effortAt(frame)           // contoh: drive glow/state dari narasi, bukan waktu
```

**Word-by-word reveal:** per-word spring dengan `delay + i*per`, plus Mask slide-up + slight tilt untuk feel premium. Gotcha: pakai pixel `gap`, bukan `em` — em resolve ke parent font-size (biasanya 16px), bikin gap hampir nol di samping type 150px.

**5-layer stack per scene** (bottom→top): background mesh → assets → graphics/type → color grade → grain + vignette. **Tidak pernah flat solid background.**

- `BgMesh`: 2–3 blob radial-gradient blur 50–70px, drift sin/cos, opacity 0.2–0.33.
- `Grade`: AbsoluteFill, `mixBlendMode: "soft-light"`, opacity 0.18 (dark) / 0.10–0.15 (light), hero color — menyatukan asset yang mismatched.
- `Grain`: procedural SVG feTurbulence data-URI, opacity ~0.05–0.09, posisi bergeser per frame (film flicker), `multiply`/`overlay`.
- `Vignette`: radial-gradient transparent 56% → rgba(0,0,0,0.22).
- `KenBurns` untuk **setiap still** tanpa kecuali: scale 1→1.08–1.1 + pan ±25px selama durasi; alterkan zoom-in/zoom-out antar shot.
- Video asset selalu `<OffthreadVideo>`, bukan `<Video>`.
- Idle >2s: breathing `1 + sin(frame/22)*0.015`, float `sin(frame/30)*3`, slow drift.
- Counter: spring + `fontVariantNumeric: "tabular-nums"` (mencegah layout jitter).
- Motion blur `Trail` untuk gerakan >30px/frame.
- Parallax: 3 layer dengan multiplier 0.3 / 0.6 / 1.0 — depth instan.
- **Transitions tanpa slide generik**: whip-pan (bg 1500px dalam 6 frame + blur(8px)), scale-through, mask wipe berwarna brand, zoom-through shape, iris, morph bentuk yang sudah ada di frame. **Transition selalu motivated oleh objek di layar** (lima dots merge jadi satu → iris). No generic wipes.

## 5. Design principles (bukan AI slop)

**Rhythm — HIT → hold → build → HIT:**
- 30s Reel: 0–1.5s HOOK (movement dalam 15 frame pertama — frame 0 bukan hitam, itu thumbnail) → 1.5–3s CONTEXT → 3–22s BODY (3–4 beats, tiap beat: HIT → hold 15–20 frame diam → build) → 22–27s PAYOFF (animasi terbesar) → 27–30s CTA (tenang, glow di kata CTA).
- Elemen visual baru tiap ≤90 frame. Hold itu desain: fast move → complete stillness → next move. **Constant motion terbaca amateur; contrast terbaca expensive.**
- Overlap scenes: scene berikutnya mulai masuk sebelum yang lama selesai. Hard gap = "loading".
- Reading holds: ≥1s setelah settle untuk frasa pendek, +0.25s per kata di atas 3 kata, ≥2s untuk final hook. Kalau ragu: hold lebih lama, animasi lebih sedikit.
- Cuts di beat musik: `framesPerBeat = fps*60/BPM`; SFX masuk 2–3 frame SEBELUM visual landing (early terasa sync; late terasa broken).

**Color:** 60/30/10 — base + ONE hero + satu accent + neutrals. **Hero color maksimal di SATU elemen per frame** — itu yang mengarahkan mata. Glow hanya di elemen hero (`boxShadow: 0 0 60px ${hero}66`). Lebih dari satu glow = Vegas.

**Typography:**
- Max 3 family: display (Instrument Serif / Clash Display / Cabinet Grotesk / Bricolage / Unbounded), UI sans (Inter), mono (JetBrains Mono) untuk label/angka.
- Hero: weight 600–800, `letterSpacing: -0.03em`, `lineHeight: 1.05`, ukuran 80–140px di 1080 wide / 100–160px di 1920.
- Highlight SATU kata per headline: hero color / animated underline / pill yang scale-in 5 frame setelah kata mendarat.
- Mono labels: uppercase, tracking 0.2–0.24em, muted — dekorasi, bukan yang harus dibaca.
- **Phone test**: di lebar 360px (feed X) key message harus tetap terbaca.
- Safe zone: konten kritis di tengah ~75% vertikal (9:16; platform UI menutup atas/bawah); tidak ada yang penting dalam ~60px dari edge kecuali sengaja crop.
- **Font loading**: `@remotion/google-fonts` dengan `waitUntilDone()` + `delayRender`/`continueRender` — `document.fonts.ready` saja tidak cukup (Remotion menambah FontFace setelah load, jadi ready resolve terlalu awal dan measurement salah). Fontsource npm packages juga dipakai claude-motion via CSS import di `index.ts`.

**Sound (50% perceived quality):** tidak deliver silent kecuali diminta. Setiap entrance HIT = whoosh/click. Riser masuk cut, bass hit TEPAT di cut. Tik loop saat counter. Music bed 0.2–0.3, ducked. Mastering target −14 LUFS, true peak ≤ −1 dBFS. claude-motion synthesize SFX murni Python stdlib dari cue sheet yang membaca timeline.json yang sama — tidak ada sample/license issue. Versi ringan: Node script generate 16-bit WAV (noise-burst whoosh, pitch-drop pop, sine-thump, detuned-sine pad) ke `public/sfx/`.

**Amateur mistakes yang selalu dicek:** emoji sebagai ikon (glyph full-color platform merusak palet — gambar dengan CSS/SVG); text menyentuh edge; elemen terlihat sebelum entrance/sesudah exit (missing clamp); satu giant component bukan reusable pieces; `durationInFrames` mismatch (dead air); lupa `--overwrite` lalu inspect file stale; system-default font untuk hero text.

## 6. Anti-slop rules

- **Tidak pernah linear easing.** Tidak pernah opacity-only fade. Tidak pernah simultaneous entrances.
- **Satu continuous world/camera lebih baik dari slide-deck scenes** — swapping scenes (A slide out, B slide in) dibaca sebagai "AI slop" oleh klien opus-skill. Info berubah lewat camera moves, morph in place, atau metafora in-world.
- Dilarang: generic gradients, flat backgrounds, text yang bergerak saat harus dibaca, >1 focal point per frame, abstract particle-morph tanpa UI/story ("jelek… maunya dynamic UI motion"), same template across videos ("kayak template", "itu-itu aja").
- Invent dunia sendiri per story: jika tentang harga, mungkin receipt printer/slot machine/timbangan; tentang coding agents → terminal swarm/race track commits. **2–4 bespoke components yang membawa metafora**, satu dominant visual idea per beat.
- Variety enforced: concept tidak boleh reuse engine/look film sebelumnya. Start fresh tiap video, invent metaphor + camera language + type.
- Depth-of-field focus: sharp = yang sedang dijelaskan narasi; sisanya blur/dim/desaturate.

## 7. Fonts & assets

- Hero text selalu display font ter-load: `@remotion/google-fonts` (mis. `loadFont("Unbounded", {weights:["500","700"], subsets:["latin"]})`) + `waitUntilDone()` + `delayRender`, atau `@font-face` + `staticFile()`, atau fontsource npm packages diimpor di `src/index.ts`.
- Font pair canon di opus-skill: display/UI/mono — unbounded, sora, bricolage, syne, space, archivo.
- Assets user di `public/` → `staticFile()`. Stills → `<Img>` + KenBurns. Footage → `<OffthreadVideo>`.
- Captions: word timestamps dari Whisper/`@remotion/install-whisper-cpp`, render via `@remotion/captions` `createTikTokStyleCaptions`, 2–4 kata per page, active word hero color, posisi ~65% height.

## 8. Catatan "vikey" (sesuai instruksi: hanya deskripsi, diabaikan untuk penggunaan)

`remotion-opus-skill` **wajibkan** Vikey API key (`VIKEY_API_KEY=<redacted>`, base `https://api.vikey.ai/v1` — OpenAI-compatible). Model builder default `anthropic/claude-opus-5.5`, alternatif murah: `glm/glm-5.3-flash`, `deepseek/deepseek-v4-flash`. `ros doctor` harus menunjukkan builder + verifier "✓ available". ElevenLabs API key **opsional** — hanya untuk voice-over (eleven_v4) + musik; tanpa itu video render captions + SFX saja. Estimasi biaya: spec mode ≈Rp8–15k/film, code mode ≈Rp30–35k/film. Kunci ditulis ke `.env`, tidak boleh di-echo ke chat/log.

---

**Inti paling actionable untuk produksi 2–3 video/hari:** pakai template ini → `theme.ts` tunggal (colors/ease/spring/fonts), `timeline.json` untuk beats + SFX sync, 5-layer stack per scene, spring+stagger entrances tanpa linear, hook di 15 frame pertama, hold yang cukup, render `--crf 16`, lalu verify loop dengan `remotion still`/ffmpeg extract frames sebelum deliver.