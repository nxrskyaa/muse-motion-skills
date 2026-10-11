# muse-motion-skills

Make 9:16 motion-graphic explainer videos with an AI agent. Two styles, one workflow, no paid APIs.

## Layout

- `SKILL.md` — the playbook. Give this file to your agent; it covers everything below.
- `references/` — research notes: what good looks like (Librani), Remotion patterns, pixel-RPG quest breakdown, ManimGX for 3D inserts.
- `template/` — cinematic motion-graphics starter (Remotion + React + TS).
- `template-rpg/` — pixel-art RPG quest starter (sprites + chiptune included).

## For your agent

> Read `SKILL.md` in muse-motion-skills, then make a 9:16 explainer about [topic] from [source link] in the [cinematic | pixel-rpg] style.

The agent extracts the story, writes and voices the script, builds scenes from the template, mixes SFX, renders, checks stills, and hands you the MP4.

## Try it

```bash
cd template # or template-rpg
npm install
./scripts/fonts.sh            # bundled fonts
python3 scripts/sfx.py        # synthesize every SFX (numpy + ffmpeg, no APIs)
# write scripts/script.txt as ID|text lines, then:
./scripts/vo.sh               # needs a `tts` CLI: tts speak --voice <id> --output <f> --text <t>
npx remotion still src/index.ts Video /tmp/check.png --frame 100
npx remotion render src/index.ts Video out.mp4 --concurrency=2 --codec=h264 --crf 17
```

## Needs

Node 18+, ffmpeg, Python 3. A `tts` command with the interface above (built against the Hatch `tts` skill — swap in any equivalent). Nothing else. No API keys.
