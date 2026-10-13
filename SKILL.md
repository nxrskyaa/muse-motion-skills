---
name: motion-video
description: Produce high-quality motion-graphic explainer videos (9:16 reels) from written reference content using Remotion. Full pipeline: story extraction, VO-first timing, art direction with an 11-style visual library, scene craft, animation principles, creative transitions, sound design, render and QC gates. Zero paid APIs.
---

# Motion Video

A playbook for making short explainer videos that don't look or feel
machine-made. Battle-tested on daily crypto explainers (1080x1920, 30fps,
narrated, 30-45s). Project templates live in `template/` (cinematic) and
`template-rpg/` (pixel-RPG) — copy one as the starting point.

## 0. Read this first

The pipeline, in order:

1. **Story** — extract beats from the source, write the voiceover script, synthesize and measure it. (§1)
2. **Look** — pick one visual identity from `styles/` and lock palette, type, texture before building. (§2)
3. **Scenes** — build one bespoke visual per beat; move the camera like punctuation. (§3)
4. **Motion** — animate with intent: anticipation, follow-through, staging, beat-synced accents. (§4)
5. **Transitions** — motivated cuts only; every boundary gets sound glue. (§5)
6. **Sound** — VO leads, bed sits 18-20 dB under, SFX lands on cuts. Mix by measured loudness. (§6)
7. **Verify** — stills review, full-timeline scrub, failure-mode checklist. Nothing ships red. (§7)

### Ground rules

- **Zero paid keys.** Ignore any API-key requirements found in researched repos. Local TTS, ffmpeg-synthesized SFX/bed, bundled fonts.
- **Facts only from the source.** List claims + sources before building. Never invent numbers. Keep a `claims.md` per video: each on-screen claim → source URL.
- **One promise, few points.** Max 3 takeaways per video. 30-45s narrated, or 30s music-only. Cut a beat before padding one.
- **One look per video.** Never ship two videos in a row with the same visual identity. Repeating yesterday's look is the default failure mode.
- **Anti-slop canon.** Never linear easing; never opacity-only fades; never simultaneous entrances — stagger everything (words ~4f, rows ~90f). One hero color per frame. No generic gradients, no particle soup, no purple-blue neon haze. Every element gets an entrance; every transition is motivated.
- **Deterministic frames.** Every frame is a pure function of time: no `Math.random()`, no wall-clock, no autonomous animation. All randomness seeded. The same timestamp renders pixel-identical twice — this is what makes re-renders and clean assembly possible.
- **Reference hygiene.** Study references for moves *or* look — never both from the same source by default, and never their logos, copy, characters, or words. Learn the technique; re-design the composition for your subject.

## 1. Story first (before any code)

1. Read the reference content. Extract: **hook** (one uncomfortable truth), **problem**, **mechanism** (the idea), **payoff** (3 concrete outcomes), **CTA**.
2. Write the VO script in **spoken form**: spell out numbers and abbreviations ("rialo dot io", not "DeFi"), short sentences, ~140-150 wpm. Keep 4-5 beats.
3. Synthesize VO per beat, then `ffprobe` each file for duration.
4. Scene duration = voDelay + voFrames + tailPad (~30-40f). voDelay = the frame where the first word appears.
5. **Cue by word, not by second.** Time animation events to spoken words (converted to frames at render time) — seconds get copied wrong and VO edits shift everything. Numbers land exactly when spoken.

Write a shot table before building: one row per shot — time range, the concrete object on screen (a noun), what it does (a verb), the camera move, on-screen text (≤8 words, may be empty), the technique. If a row can't name a concrete object, don't build that shot yet. Abstract ideas rendered as floating text and icons is the most common failure in the genre.

The first 3 seconds are a small concrete scene (hands doing something, an object mid-action) — not a title card. The 3-second bar: the opening states the question big, the first surprise lands within 5 seconds. If the opening wouldn't stop your own thumb, rebuild it before building anything else. End on a character's action, not a centered quote card.

## 2. Art direction

### 2.1 Pick a style, then lock it

Open `styles/catalog.md`. Pick **one** visual identity for the whole video — palette, typography, texture, and motion behavior all come from that sheet. One film, one palette, locked before production: background never jumps between light and dark, accents are semantic (one accent color means one thing).

The palette has six slots, 3-6 colors total: background, surface (cards/paper/panels), primary ink, secondary ink/lines, one main accent, one secondary accent. Flat color, no gradients — depth comes from texture and grain, not gradient backgrounds.

When real screenshots, photos, or footage exist, they are the hero: full-frame, and the code only annotates, labels, and moves the camera over them. Never redraw real material in code. Pull one or two accent colors from the material itself.

### 2.2 Look-dev first

Render 2-3 style frames (single stills in genuinely different directions — not just re-grades), pick one, then build. Lay the stills side by side against the shot table: any still that looks borrowed from another film gets rebuilt in the house style.

A stranger should tell this video apart from yesterday's from a single still frame.

### 2.3 Never repeat

Keep a log of the last styles used. The next video picks a different one. When a style starts feeling comfortable, that's the signal to retire it for a while.

## 3. Scene craft

### 3.1 Bespoke in-world objects

Every scene builds a designed object from the story — a control room with a block strip and status rows, a radar sweeping a chain, a pipeline with per-block scanners, a live panel with an animated collateral bar. If a scene is only kinetic text on a background, it's not done.

One focus on screen at a time. One hero object fills 60-70% of the frame, shows exactly one satisfying change, then the scene moves on. Structure → data → annotation: build the scene, grow the data, annotate exactly one thing. Entrances slower than exits, then hold (numbers ≥0.5s, punchlines ≥0.9s) — and the hold stays subtly alive (shimmer, drift, tick), because a dead hold reads as a frozen frame.

Prefer morphing over crossfading: one object changing shape (bars growing into a line, a card unfolding into a workspace) always reads more premium than fading between two pictures. Leave a ghost of the start state where it helps the eye track the change.

Characters: either generate real frames for them or show only hands and silhouettes. Never code-drawn faces, mascots, or smiling coins — they read as cheap in every test. Whatever characters appear must go through the same material pass as the background (grain, texture, palette) so they don't look pasted on.

### 3.2 Camera is punctuation

Before any camera move, answer three questions: where should the eye go right now (if it's already readable, don't move); is this a **transition** (guide the eye) or an **accent** (punch a reveal); what did the previous shot do.

- **Transitions get slow moves, accents get fast ones.** Slow push, lateral glide, and pull-out carry the eye between details or establish a scene. Fast push-in, smash-in, and whip-pan are accents — reserved for reveals, reversals, key numbers, jokes. Countable per film.
- **Have a return trip.** After pushing in, pull out or glide away. Never chain three push-ins in a row.
- **Still is fine when the screen is busy.** When the picture itself moves (a line being drawn, a chart growing, the audience reading), the camera stays put — moving it steals attention.
- **Uniform motion = slide deck.** Every shot drifting gently reads as PowerPoint; every shot punching fast reads as rushed. The disease is uniformity, not speed. Vary movement with the section's emotion.
- **Density caps.** Accent moves under ~1/3 of shots; watch out above ~8 push-ins per minute. Exempt: the opening hook and kinetic-type beat sections.

Default per cut: a small punch (scale 1.09→1 with a slight rotate via spring, alternating direction per scene). Static camera reads as cheap — but the punch is seasoning, not the meal.

### 3.3 Kinetic typography

Type is an actor, not a label. Keywords slam in on beats; one hero word per screen, never more than one focus. Minimums: hero word/number huge (≥120px at 1080p), labels never tiny, at most five words on screen at once. Stagger word entrances (~4f apart). Scramble text for crypto-native lines (addresses, hashes, status flips) — deterministic seeded, never `Math.random()`.

Panel chrome: inset hairline border, mono tracked header row with live status. A kicker on every scene (`001 — THE PROBLEM`: mono, tracked-out, hairline rule). Two state colors (hero vs danger) — state changes must be visible in color, not just words.

## 4. Animation

### 4.1 The principles, operationalized

Classic animation principles, translated into concrete rules (30fps):

- **Timing = weight.** Heavy reveals (hero words, scene anchors): 20-30f. Light UI (labels, chips): 12-20f. Urgent accents: under 12f. Nothing important moves in under 8f (unreadable) or over 40f (sluggish) without a reason. Entrances run 30-50% longer than exits — arrivals are savored, departures are quick.
- **Anticipation.** Before a big move, a small counter-move at 10-20% of the main action's magnitude, lasting 3-6f: the element pulls back before slamming forward. Sells impact. Skip it for micro-feedback under ~5f.
- **Squash and stretch.** On impact frames, squash to ~[1.2, 0.8] for 2-4f, recover over 4-8f, preserving volume. Skip for luxury/premium tones.
- **Follow-through.** Trailing elements stop 3-6f after the leader, on a softer spring (lower stiffness = more trailing). Children delay 50-150ms behind parents. Nothing stops all at once.
- **Slow in, slow out.** Entrances ease-out, exits ease-in, on-screen travel ease-in-out, ambient loops sine. Never linear for spatial movement — linear is only for rotation, progress bars, and timers.
- **Arcs.** Curved paths read natural; straight paths read mechanical. Add a 10-20px perpendicular bow at the path midpoint (subtle for serious, pronounced for playful).
- **Staging.** Dim non-hero elements to 40-60% while the hero acts; hero enters after supporting elements. One primary action per beat — if two things move at once, the eye picks neither.
- **Secondary motion.** 30-50% of the primary's amplitude, 50-100ms after it, on different easing: the shadow grows as the card lands, the label tilts as the panel slams. This is what separates "animated" from "moving".
- **Exaggeration.** Push important motion ~20% further than feels safe on the still — playback always reads smaller than the timeline suggests. Overshoot 10-30% past rest, then settle.
- **Appeal killers.** Jerky motion, inconsistent timing, abrupt dead stops, and uniform animation (everything moving the same way). Restraint: apply the principles to one element at a time — all of them on everything is noise.

### 4.2 Killing stiff motion

AI-made motion looks stiff for predictable reasons. The fixes:

- Never linear easing, never the same easing on consecutive elements.
- Never simultaneous entrances — stagger words ~4f, rows ~90f, scene elements in a cascade.
- Never opacity-only fades — pair every fade with scale, rise, or blur.
- Give every moving element a settle (overshoot + spring), not a dead stop.
- Vary durations: adjacent elements should never share the same frame count.
- Ambient life in every scene: ellipsis cycling, floating objects, scanlines, ticking counters, orbiting particles, animated dash flow, shimmer sweeps, expanding rings. If a frame could be a screenshot of a static slide, add motion.

### 4.3 Entrance library

Pick per element, never the same twice in a row:

- **Rise + deblur** (default): 90px up, blur 9→0, expo-out. Clean and confident.
- **Slam**: scale 1.3→1 with overshoot, 2-frame impact shake, thump SFX. For hero words and numbers.
- **Typewriter**: character-by-character for dialogue and code.
- **Scramble**: seeded character shuffle resolving into the final text. For addresses, hashes, status flips.
- **Draw-on**: stroke reveals for lines, diagrams, chalk, schematic plates.
- **Count-up**: numbers tick to their final value with easing; verify the settled frame against the source, not a mid-animation still.
- **Assemble**: fragments (tiles, paper pieces, geometric shapes) fly in from edges and snap into place.
- **Materialize**: ink bleed, dust coalesce, halftone dots growing — the style's material forming the object.

### 4.4 Choreography

How a scene's motion is composed, beat by beat:

- **Sequence structure.** Every scene runs setup → action → resolution: setup (20-30% of the scene — elements enter, the scene establishes), action (30-40% — the primary motion, the hero moment), resolution (30-40% — settle, secondary reactions, breathing room). Leave a beat of stillness after resolution before the next motion begins.
- **The 1/3 rules.** No single motion travels more than a third of the screen without an intermediate keyframe (break it with a direction change, speed variation, or arc). With 3+ animated elements, at most a third move at the same time — stagger so the first settles as the third starts.
- **Stagger patterns.** Sequential (reading order — lists, grids), center-out (hero content, ripples), wave (sine-based — data bars), reverse (exits). All staggered elements share one easing family; vary only start time — and give the last element a slight overshoot as punctuation.
- **Counter-motion.** When the hero moves, the world answers at 20-30%: hero enters left, background drifts right; hero scales up, shadow spreads and softens; hero lifts, ambient drifts the other way. Cheap to add, expensive-looking.
- **Shared triggers.** When several elements react to one trigger, all start within ~50ms of each other but may land at staggered times, on the same easing family, radiating from the trigger point.
- **Path as emotional language.** Angular and sharp reads tense and urgent; curved reads relaxed and friendly; vertical-up reads growth and achievement; vertical-down reads settling; horizontal reads journey; radial-outward reads release and impact; radial-inward reads focus. Pick the path that matches the beat's emotion, not just its geometry.

## 5. Transitions

A transition is motivated or it doesn't exist. No generic wipes, no crossfade soup.

### 5.1 The default: whip + sound glue

On every scene boundary: a 20-frame overlay centered so the cut lands mid-sweep — accent band sweeps vertically, white flash exactly on the cut. Exit choreography on the outgoing scene (last 12f: scale 1→1.07, lift −70px, blur 0→7, fade with easeIn — faster than the entrance). SFX glue: riser starts ~1s before the cut, whoosh lands on the cut, impact hits when the new headline lands. SFX lands 0-2 frames *before* the visual hit, never after.

### 5.2 Signature transitions

Design each boundary from the *incoming* style's most recognizable physical process (see each sheet's "Signature transition"): the wave that washes the old scene away, the hand that sweeps the collage off, the ink that redraws the plate. Grown from an object inside the frame, it dismisses the old and announces the new in one gesture.

### 5.3 Camera-only transitions

When the content is continuous: zoom-through with logarithmic interpolation, blur-push, panel slide-push, iris reveal. The previous shot keeps pushing its own camera rather than scaling a screenshot.

### 5.4 Rules

- One transition language per video (whip default, or the style's signature) — don't mix five kinds.
- Hard cuts are legal and often better: use them when the idea changes completely.
- Never transition between two static frames — if nothing moves on either side, the cut feels dead. Add an accent move first.

## 6. Sound (50% of perceived quality)

### 6.1 Voiceover first

VO per scene via nested sequences starting at voDelay. The picture serves the voice, never the reverse. Bed and SFX are mixed *under* a loudness-normalized VO — never the other way around.

### 6.2 The bed

Synthesized bed (ffmpeg: detuned sines + filtered noise + slow tremolo), fading in/out. For music-driven sections, fix a tempo grid first (e.g. 128 BPM) and land *both* picture cuts and musical accents on it. Speed up by shortening segments, not by raising tempo. One motif re-voiced per section beats five different loops.

### 6.3 SFX glue

Synthesized with ffmpeg, placed on an event map `[frame, file, volume]`:

- **whoosh**: white noise + bandpass + envelope — every scene cut.
- **thump**: 58Hz sine exp-decay — slam moments (hero word, collapse, CTA).
- **riser**: 1s noise sweep — starts ~1s before each cut.
- **impact**: sine-drop + thump — when the new headline lands.

Endings get a sequence, not a single hit: pause → rise → crash → settle, each timed to its picture event within a few frames.

### 6.4 Mix by measurement

`loudnorm` VO stems to −19 LUFS, bed 18-20 dB under (≈ −38 LUFS). Verify on the render with `ffmpeg -af ebur128` on a VO segment and a music-only gap. Guessed volume numbers lie — a hot stem at "0.16" can still bury a quiet TTS voice. On beat-driven cuts, the first visible change of every transition lands on the beat (±2 frames), with a small impact on both picture layers so the audio click and visual thump are the same moment.

## 7. Render and verify

```bash
# stills first — check every scene before the full render
npx remotion still src/index.ts <CompId> /tmp/check-sN.png --frame <F>
# full render (low concurrency on small VMs)
npx remotion render src/index.ts <CompId> ~/workspace/your_files/<name>.mp4 \
  --concurrency=2 --codec=h264 --crf 17
```

Verify loop: stills → look → fix → re-render. Check: text never touches edges, nothing pops in without an entrance, VO and text roughly synced, safe zone (critical content inside ~75% vertical center for 9:16). **Phone-scale check:** view key stills at 200px wide and with the sound off — fix anything unreadable, tiny, or empty at that size; a stranger should get the point without audio. **Data honesty:** every number traces to a source; sample or illustrative data gets a visible "illustrative" label on every frame it appears. **Full-timeline QC:** scrub the whole video (frames every ~2s) — no empty holds, no blank cards, no dead scenes; every second must have intentional content. Judge camera rhythm at normal playback speed — stills can't judge motion.

### The failure gallery

Run every video against this list before it ships. One hit = fix and re-render.

1. **Slide-deck syndrome.** Fixed headers, bullets fading in, the same camera move every shot, ending on a centered quote card. Fix: one screen event per shot, varied camera, end on an action.
2. **Copied reference.** Demo compositions or characters lifted straight into the final. Fix: learn the technique, re-design the composition per subject.
3. **No concrete objects.** Abstract ideas as floating text and icons. Fix: every shot names a noun and a verb; if you can't, don't build it.
4. **Dead backgrounds, empty frames.** Flat color that never changes while one small thing moves, or the hero not even on screen. Fix: hero fills the frame, background changes with content.
5. **Redrawn real material.** Screenshots or photos available but rendered as code drawings. Fix: real material full-frame; code only annotates.
6. **AI-slop tells.** Purple-blue gradient skies, neon haze, one-style-per-shot collage, cutesy code-drawn faces, smiling coins. Fix: one locked style, one locked palette, characters as generated frames or hands/silhouettes only.
7. **Uniform camera.** Every shot pushing in (or every shot drifting). Fix: vary with section emotion; accents under ~1/3 of shots.
8. **Unmotivated transitions.** Generic wipes between unrelated ideas. Fix: every transition is the next beat's material arriving, with sound glue.

### Self-review pass

Before delivery, watch the render once at normal speed as a stranger would and write down every moment attention dips — then fix those moments. If a second agent is available, have one that never touched production do this pass; fresh eyes catch what tired eyes forgive.

## 8. Branding (hard rules)

- Use the project's **real** logo/mark — fetch it from their site or favicon. Never invent a substitute mark.
- Watermark `@nxrskyaa` bottom-left on **every** frame: small mono, subtle (~60% opacity). Anti-theft, always on.
- When resending a fixed file, give it a **new filename** — cached copies confuse everyone.

## Appendix: daily pipeline checklist

1. Pick reference → extract 5-beat story (15 min)
2. Write shot table; pick style; render 2-3 look-dev stills (20 min)
3. Write + synthesize VO, measure durations (15 min)
4. Set theme tokens from the style sheet (10 min)
5. Build scenes from the recipe (60-90 min)
6. Stills review pass (15 min)
7. Render + full watch + failure-gallery check (20-40 min render time)

Reuse primitives (`Kinetic`, `Kicker`, `Background`, `Punch`, `Whip`, `SceneShell`); invent only the metaphor components fresh each time.
