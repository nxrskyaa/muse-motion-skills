# template-rpg — pixel-art RPG quest style

1080x1920, 30fps, narrated. The explainer as a playable quest.

## Inside

- `src/components/rpg.tsx` — `Px`, `Walker`, `Npc`, `Emote`, `DialogueBox`, `QuestPanel`, `Hud`, `TitleCard`, `Ground`
- `src/scenes/ExampleArea.tsx` — village, dialogue, quest panel. One area per quest beat.
- `scripts/gen_sprites.py` — every sprite, drawn in code (PIL string maps). Extend the maps for new characters/tiles.
- `scripts/chiptune.py` — blip, coin, fanfare, stamp, music loop. All synthesized.
- `scripts/vo.sh` — reads `scripts/script.txt`, writes `public/vo/` (`LANG_ID` env picks the language, default `en`).
- `scripts/fonts.sh` — downloads Press Start 2P.

## Workflow

1. `npm install`, `./scripts/fonts.sh`, `python3 scripts/gen_sprites.py`, `python3 scripts/chiptune.py`.
2. Map each explainer beat to a quest event (dialogue / checklist / progress bar / reward).
3. Write the VO into `scripts/script.txt`, run `./scripts/vo.sh`, `ffprobe` the durations.
4. Build one area per beat: TitleCard → acting → dialogue → payoff banner.
5. Mix quiet: music **0.18**, blips **0.22**.
6. Stills, fix, render.
