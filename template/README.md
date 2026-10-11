# template — cinematic style

1080x1920, 30fps, narrated. Librani-bar motion graphics.

## Inside

- `src/components/` — `Background` (grid, glow, grain), `Kinetic` (word reveals), `Kicker`, `FadeIn`, `fx` (`Punch`, `SceneShell`, `Whip`, `Scramble`, `Panel`, `Dot`, `Ticker`)
- `src/scenes/Example.tsx` — a hook scene and a CTA scene. Copy the patterns, replace the content.
- `src/Video.tsx` — the SCENES table, VO wiring, SFX map, bed, whip transitions.
- `scripts/sfx.py` — whoosh, thump, riser, impact, bed. All synthesized.
- `scripts/vo.sh` — reads `scripts/script.txt` (`ID|text` per line), writes `public/vo/`.
- `scripts/fonts.sh` — downloads Inter + JetBrains Mono.

## Workflow

1. `npm install`, `./scripts/fonts.sh`, `python3 scripts/sfx.py`.
2. Put the brand's real tokens in `src/theme.ts`.
3. Write the VO (spoken form) into `scripts/script.txt`, run `./scripts/vo.sh`, `ffprobe` the durations.
4. Build scenes: kicker → kinetic headline → scramble → **the bespoke object**. See `SKILL.md` §2 for what "done" means.
5. Fill the SCENES table; put SFX on the event map, 0–2 frames before each hit.
6. Stills, fix, render.
