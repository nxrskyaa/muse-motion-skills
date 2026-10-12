# muse-motion-skills

A skill package that teaches an AI agent to make 9:16 motion-graphic explainer videos — narrated, kinetic, no AI slop. Two styles, one workflow, zero paid APIs.

## The two styles

**Cinematic** (`template/`) — kinetic typography, bespoke in-world objects, camera punches, whip transitions, synthesized SFX. For product explainers and narratives.

**Pixel-art RPG quest** (`template-rpg/`) — the explainer as a playable quest: dialogue boxes, typewriter text, quest log, HUD, chiptune soundtrack. For anything that can be framed as a mission.

## For your agent

Give your agent this prompt:

> Read `SKILL.md` in nxrskyaa/muse-motion-skills, then make a 9:16 explainer about [topic] from [source] in the [cinematic | pixel-rpg] style.

The agent extracts the story, writes and voices the script, builds scenes from the template, mixes SFX, renders, checks stills, and hands you the MP4.

## What's inside

| Path | Contents |
| ---- | -------- |
| `SKILL.md` | The playbook: story extraction, VO-first timing, scene systems, sound design, render checklist |
| `template/` | Cinematic starter — Remotion + React + TypeScript |
| `template-rpg/` | Pixel-RPG starter — hand-drawn sprites and chiptune included |

## Try it

```bash
cd template          # or template-rpg
npm install
./scripts/fonts.sh            # downloads the bundled fonts
python3 scripts/sfx.py        # synthesize every SFX (numpy + ffmpeg, no APIs)

# write scripts/script.txt as ID|text lines, then:
./scripts/vo.sh               # needs a `tts` CLI (see below)

npx remotion still src/index.ts Video /tmp/check.png --frame 100
npx remotion render src/index.ts Video out.mp4 --concurrency=2 --codec=h264 --crf 17
```

## Requirements

- Node 18+, ffmpeg, Python 3
- A `tts` command with this interface: `tts speak --voice <id> --output <file> --text <text>` (built against the Hatch `tts` skill — swap in any equivalent)
- Nothing else. No API keys.

## License

MIT — see [LICENSE](LICENSE).
