# Reference: Pixel-Art RPG Quest Explainer (9:16, ~62s, Indonesian)

Source: user-supplied reference video (McKinsey Forward explainer). Style: retro JRPG
(Pokémon/Stardew-like) used as an explainer format. Study this when the user asks
for "begini" (like this).

## Core idea
The explainer is framed as a **playable quest**, not a presentation. The viewer
identifies with the player character; information is delivered as game events:
dialogue, quest log, checklist, rewards, world map. Every explainer beat maps to
a game mechanic.

## Systems (reusable components)

### 1. JRPG dialogue box
- Bottom-anchored box, dark navy fill, light border, rounded 2px corners.
- **Name plate** top-left overlapping the box edge ("Kamu", "Kak Wowo", "Resepsionis").
- **Portrait** 48×48 px bottom-left inside the box.
- **Typewriter text**: chars reveal ~2/frame; **keywords highlighted** in light blue
  ("skill dasar", "McKinsey.org Forward", "digital badge", "LinkedIn").
- **▼ continue marker** bottom-right blinks when the line is complete.
- Emote bubbles above heads: "?" (confused, wobble) → "!" (realization, pop).

### 2. HUD (always on)
- Top-left: coin icon + "Rp0" and day counter "Mg 1" (Minggu/week). Days advance
  as the quest progresses (Mg 1 → Mg 10) — time passing is shown, not told.
- Top-center location title cards: "Hari 1 · Baru lulus", "AKADEMI FORWARD",
  "PENDAFTARAN", "JARINGAN GLOBAL — tersedia di 130+ negara".

### 3. Quest log panel
- Right-side dark panel: "QUEST BARU — McKinsey.org Forward".
- Checklist boxes fill one by one as dialogue mentions each fact
  (± 10 minggu → ± 2 jam/minggu → kursus digital + sesi live).
- "GRATIS!" badge pops in with scale spring.

### 4. Pixel world (one coherent art direction)
- Tileable grass with noise speckles, dirt paths, wooden fences, round trees,
  signposts (CODING / DESAIN / MARKETING / DATA), buildings with blue roofs.
- Interior: wood floor + striped wallpaper, desks in a row.
- World map: simplified continents on water, character markers pop in with "+".
- All pixel art: hard edges, `image-rendering: pixelated`, limited palette.

### 5. Character acting
- Player: blue hair, dark jacket. Walk cycle (2-frame leg swap) when moving.
- NPCs walk in from screen edge to deliver info, then stand by.
- Scene changes: character walks toward a sign ("KE AKADEMI") → fade/wipe →
  new area with title card.

### 6. Progress visualization
- "TAS SKILL" bar at top of academy: 5 slots fill as the player visits each desk
  (Problem Solving, Communicating, Adaptability, Relationships, Digital & AI).
- Registration checklist: boxes get checked + "LOLOS" stamp slides in per row.
- Reward moment: "Kamu mendapatkan DIGITAL BADGE!" banner + confetti particles.

### 7. End card CTA
- Title block: "McKinsey.org FORWARD — QUEST KARIR -".
- Feature icon row: GRATIS / ONLINE / 10 MINGGU / BADGE.
- Big button: "> LINK DI CAPTION < — cek jadwal & syarat terbaru".
- Small disclaimer line at bottom (keep for sponsored/3rd-party content).

## Beat map (62s)
1. Crossroads + signposts, title "Hari 1 · Baru lulus", dialogue: confused grad
2. "?" emote → NPC Kak Wowo enters → "!" emote
3. Walk north to academy, "QUEST BARU" panel builds line by line
4. Academy interior, 5 skill desks, TAS SKILL bar fills per visit
5. Registration desk, syarat checklist + LOLOS stamps
6. Badge reward + confetti, world map with 130+ countries
7. End card + link CTA

## How to build in our Remotion pipeline
- Sprites: generate pixel art as PNGs (code-drawn via canvas → PNG, or
  box-shadow pixel technique), always `image-rendering: pixelated`.
- `DialogueBox` component: props {name, portrait, lines[], keywords[]};
  typewriter via `text.slice(0, floor(frame/2))`; keyword spans pre-split.
- `QuestPanel`, `Hud`, `Checklist`, `TitleCard`, `Emote` components.
- Walk cycles: 2-frame sprite swap on `floor(frame/8) % 2`.
- Camera: fixed per area; transitions = character walks to exit → 8-frame
  fade → new area + title card (simpler than scrolling and reads fine).
- TTS: same local pipeline; dialogue timing = typewriter duration + 12f hold.
- Confetti: deterministic seeded particles (existing `rnd` in fx.tsx).
